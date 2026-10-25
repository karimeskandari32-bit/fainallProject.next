import conectToDB from "@/configs/db";
import Category from "@/models/Category";
import CategoriesManager from "@/components/CategoriesManager";
import { formatJalali } from "@/lib/jalali";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  await conectToDB();
  const docs = await Category.find().sort({ createdAt: -1 }).lean();

  const categories = docs.map((c) => ({
    id: String(c._id),
    title: c.title,
    slug: c.slug,
    description: c.description || "",
    createdAt: formatJalali(c.createdAt),
  }));

  return (
    <main className="p-6">
      <h1 className="mb-6 text-2xl font-bold">دسته‌بندی‌ها</h1>
      <CategoriesManager categories={categories} />
    </main>
  );
}