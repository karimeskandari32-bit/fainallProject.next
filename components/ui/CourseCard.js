import Link from "next/link";
import { LuUsers, LuImageOff } from "react-icons/lu";

import { Badge } from "@/components/ui/badge";

const fa = (n) => Number(n || 0).toLocaleString("fa-IR");

function getDiscountPercent(price, discountPrice) {
  if (!price || !discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
}

export default function CourseCard({ course }) {
  const href = `/course/${course.slug}`;
  const percent = course.isFree
    ? 0
    : getDiscountPercent(course.price, course.discountPrice);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
      {/* تصویر */}
      <Link href={href} className="relative block aspect-video overflow-hidden bg-muted">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <LuImageOff className="size-8" strokeWidth={1.5} />
          </div>
        )}

        {percent > 0 && (
          <Badge className="absolute end-3 top-3 rounded-full bg-destructive px-2.5 text-white">
            {fa(percent)}٪ تخفیف
          </Badge>
        )}
      </Link>

      {/* محتوا */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Link href={href}>
          <h3 className="line-clamp-1 font-heading text-base font-bold transition-colors group-hover:text-primary">
            {course.title}
          </h3>
        </Link>

        <p className="line-clamp-2 min-h-12 text-sm leading-6 text-muted-foreground">
          {course.shortDescription}
        </p>

        {/* مدرس */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
            م
          </span>
          محبوبه صالحی
        </div>
      </div>

      {/* فوتر کارت */}
      <div className="flex items-center justify-between gap-2 border-t px-4 py-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <LuUsers className="size-4" strokeWidth={1.75} />
          <span>{fa(course.studentsCount)}</span>
        </div>

        <div className="text-end">
          {course.isFree ? (
            <Badge variant="secondary" className="rounded-full text-sm font-bold text-emerald-600 dark:text-emerald-400">
              رایگان
            </Badge>
          ) : course.discountPrice ? (
            <div className="flex flex-col items-end leading-tight">
              <del className="text-xs text-muted-foreground">
                {fa(course.price)}
              </del>
              <span className="text-sm font-bold">
                {fa(course.discountPrice)}{" "}
                <span className="text-xs font-normal text-muted-foreground">تومان</span>
              </span>
            </div>
          ) : (
            <span className="text-sm font-bold">
              {fa(course.price)}{" "}
              <span className="text-xs font-normal text-muted-foreground">تومان</span>
            </span>
          )}
        </div>
      </div>
    </article>
  );
}