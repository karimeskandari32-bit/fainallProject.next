import Link from "next/link";
import { LuSearchX } from "react-icons/lu";

import connectToDB from "@/configs/db";
import Course from "@/models/Course";
import CourseCard from "@/components/ui/CourseCard";
import CoursesFilters from "@/components/sections/Courses/CoursesFilters";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "همه دوره‌ها",
  description: "فهرست کامل دوره‌های آموزشی",
};

const PER_PAGE = 12;
const LEVELS = ["beginner", "intermediate", "advanced"];

const SORT_MAP = {
  newest: { createdAt: -1 },
  popular: { studentsCount: -1, createdAt: -1 },
  cheap: { price: 1 },
  expensive: { price: -1 },
};

const fa = (n) => Number(n || 0).toLocaleString("fa-IR");
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// عددهای صفحه‌بندی: حداکثر ۵ تا دور صفحه فعلی
function getPageNumbers(current, total) {
  const start = Math.max(1, Math.min(current - 2, total - 4));
  const end = Math.min(total, start + 4);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export default async function CoursesPage({ searchParams }) {
  const sp = await searchParams;

  const q = (typeof sp?.q === "string" ? sp.q : "").trim().slice(0, 60);
  const level = LEVELS.includes(sp?.level) ? sp.level : "";
  const price = ["free", "paid", "discount"].includes(sp?.price) ? sp.price : "";
  const sort = SORT_MAP[sp?.sort] ? sp.sort : "newest";
  const requestedPage = Math.max(1, parseInt(sp?.page) || 1);

  // ساخت شرط جستجو
  const filter = { status: "published" };
  if (q) {
    const re = new RegExp(escapeRegex(q), "i");
    filter.$or = [{ title: re }, { shortDescription: re }];
  }
  if (level) filter.level = level;
  if (price === "free") filter.isFree = true;
  if (price === "paid") filter.isFree = false;
  if (price === "discount") {
    filter.isFree = false;
    filter.discountPrice = { $gt: 0 };
  }

  await connectToDB();

  const total = await Course.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const page = Math.min(requestedPage, totalPages);

  const courses = await Course.find(filter)
    .sort(SORT_MAP[sort])
    .skip((page - 1) * PER_PAGE)
    .limit(PER_PAGE)
    .select(
      "title slug shortDescription thumbnail price discountPrice isFree level studentsCount"
    )
    .lean();

  // ساخت لینک صفحه‌ها با حفظ فیلترها
  const buildHref = (p) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (level) params.set("level", level);
    if (price) params.set("price", price);
    if (sort !== "newest") params.set("sort", sort);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/courses?${qs}` : "/courses";
  };

  return (
    <div className="container py-10 sm:py-14">
      {/* سرتیتر */}
      <div className="mb-8 flex items-center gap-3">
        <span className="h-9 w-1.5 rounded-full bg-primary" />
        <div>
          <h1 className="font-heading text-2xl font-bold sm:text-3xl">
            همه دوره‌ها
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            دوره مناسب خودت رو جستجو و انتخاب کن
          </p>
        </div>
      </div>

      <CoursesFilters />

      <p className="mt-6 mb-4 text-sm text-muted-foreground">
        {total > 0 ? `${fa(total)} دوره پیدا شد` : "نتیجه‌ای پیدا نشد"}
      </p>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-20 text-center text-sm text-muted-foreground">
          <LuSearchX className="size-10" strokeWidth={1.5} />
          <p>دوره‌ای با این مشخصات پیدا نشد. فیلترها یا عبارت جستجو رو تغییر بده.</p>
          <Link
            href="/courses"
            className={cn(buttonVariants({ variant: "outline" }), "mt-2 rounded-full")}
          >
            نمایش همه دوره‌ها
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course) => (
            <CourseCard key={String(course._id)} course={course} />
          ))}
        </div>
      )}

      {/* صفحه‌بندی */}
      {totalPages > 1 && (
        <nav
          aria-label="صفحه‌بندی"
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
          {page > 1 && (
            <Link
              href={buildHref(page - 1)}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full")}
            >
              قبلی
            </Link>
          )}

          {getPageNumbers(page, totalPages).map((p) => (
            <Link
              key={p}
              href={buildHref(p)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                buttonVariants({
                  variant: p === page ? "default" : "outline",
                  size: "icon",
                }),
                "rounded-full"
              )}
            >
              {fa(p)}
            </Link>
          ))}

          {page < totalPages && (
            <Link
              href={buildHref(page + 1)}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full")}
            >
              بعدی
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}