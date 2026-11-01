import Link from "next/link";
import {
  LuArrowLeft,
  LuSparkles,
  LuGraduationCap,
  LuUsers,
  LuShoppingBag,
} from "react-icons/lu";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getHomeStats } from "@/utils/homeStats";

const fa = (n) => Number(n || 0).toLocaleString("fa-IR");

export default async function Hero() {
  const stats = await getHomeStats();

  const STATS = [
    { icon: LuGraduationCap, value: fa(stats.courses), label: "دوره آموزشی" },
    { icon: LuUsers, value: fa(stats.students), label: "کاربر ثبت‌نام‌شده" },
    { icon: LuShoppingBag, value: fa(stats.soldCourses), label: "سفارش موفق" },
  ];

  return (
    <section className="relative isolate overflow-hidden">
      {/* پس‌زمینه: لکه‌های رنگی محو */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-24 start-1/2 size-[420px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-40 end-0 size-[300px] rounded-full bg-chart-2/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      </div>

      <div className="container flex flex-col items-center py-16 text-center sm:py-24">
        {/* نشان کوچک بالای تیتر */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 inline-flex items-center gap-2 rounded-full border bg-card/60 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur sm:text-sm">
          <LuSparkles className="size-4 text-primary" />
          پلتفرم آموزش برنامه‌نویسی پروژه‌محور
        </div>

        {/* تیتر */}
        <h1 className="animate-in fade-in slide-in-from-bottom-4 delay-100 duration-700 mt-6 max-w-3xl font-heading text-3xl font-bold leading-[1.6] sm:text-5xl sm:leading-[1.5]">
          مسیر حرفه‌ای شدن در
          <span className="bg-gradient-to-l from-primary to-chart-4 bg-clip-text text-transparent">
            {" "}
            برنامه‌نویسی{" "}
          </span>
          از همین‌جا شروع می‌شه
        </h1>

        {/* توضیح */}
        <p className="animate-in fade-in slide-in-from-bottom-4 delay-200 duration-700 mt-5 max-w-xl text-sm leading-8 text-muted-foreground sm:text-base">
          با دوره‌های کاربردی و پروژه‌محور، قدم‌به‌قدم مهارت‌های موردنیاز بازار
          کار رو یاد بگیر. مشاور هوشمند ما هم کمکت می‌کنه مناسب‌ترین دوره رو
          پیدا کنی.
        </p>

        {/* دکمه‌ها */}
        <div className="animate-in fade-in slide-in-from-bottom-4 delay-300 duration-700 mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/courses"
            className={cn(
              buttonVariants({ size: "lg" }),
              "gap-2 rounded-full px-7"
            )}
          >
            مشاهده دوره‌ها
            <LuArrowLeft className="size-4" />
          </Link>
          <a
            href="#advisor"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "rounded-full px-7"
            )}
          >
            مشاور هوشمند دوره
          </a>
        </div>

        {/* آمار (از دیتابیس) */}
        <div className="animate-in fade-in slide-in-from-bottom-6 delay-500 duration-1000 mt-14 grid w-full max-w-2xl grid-cols-3 gap-3">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="rounded-2xl border bg-card/70 p-4 backdrop-blur transition-colors hover:border-primary/40"
            >
              <span className="mx-auto flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" strokeWidth={1.75} />
              </span>
              <p className="mt-3 text-xl font-bold">{value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}