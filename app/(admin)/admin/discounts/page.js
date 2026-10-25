import conectToDB from "@/configs/db";
import Discount from "@/models/Discount";
import Course from "@/models/Course";
import  DiscountsManager from "@/components/Discount";
import { formatJalali } from "@/lib/jalali";

export const dynamic = "force-dynamic";

export default async function DiscountsPage() {
  await conectToDB();

  const [docs, courseDocs] = await Promise.all([
    Discount.find().sort({ createdAt: -1 }).populate("course", "title").lean(),
    Course.find().select("title").sort({ createdAt: -1 }).lean(),
  ]);

  const now = Date.now();

  const discounts = docs.map((d) => {
    const expired = d.expiresAt ? new Date(d.expiresAt).getTime() < now : false;
    const exhausted = d.maxUses > 0 && d.usedCount >= d.maxUses;
    const status = !d.isActive
      ? "inactive"
      : expired
      ? "expired"
      : exhausted
      ? "exhausted"
      : "active";

    return {
      id: String(d._id),
      code: d.code,
      type: d.type,
      value: d.value,
      maxUses: d.maxUses,
      usedCount: d.usedCount,
      isActive: d.isActive,
      hasExpiry: Boolean(d.expiresAt),
      expiresAt: d.expiresAt ? formatJalali(d.expiresAt) : "",
      courseId: d.course ? String(d.course._id) : "",
      courseTitle: d.course?.title || "",
      createdAt: formatJalali(d.createdAt),
      status,
    };
  });

  const courses = courseDocs.map((c) => ({ id: String(c._id), title: c.title }));

  return (
    <main className="p-6">
      <h1 className="mb-6 text-2xl font-bold">کدهای تخفیف</h1>
      <DiscountsManager discounts={discounts} courses={courses} />
    </main>
  );
}