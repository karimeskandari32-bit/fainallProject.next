import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CtaSection() {
  return (
    <section className="container py-12 sm:py-16">
      <div className="relative isolate overflow-hidden rounded-3xl border bg-card px-6 py-12 text-center sm:px-12 sm:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/15 via-transparent to-chart-2/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 start-1/2 -z-10 size-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
        />

        <h2 className="mx-auto max-w-xl font-heading text-2xl font-bold leading-[1.6] sm:text-3xl">
          آماده‌ای یادگیری رو شروع کنی؟
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
          دوره‌ها رو ببین و مسیر مناسب خودت رو انتخاب کن.
        </p>

        <Link
          href="/courses"
          className={cn(
            buttonVariants({ size: "lg" }),
            "mt-8 gap-2 rounded-full px-8"
          )}
        >
          مشاهده همه دوره‌ها
          <LuArrowLeft className="size-4" />
        </Link>
      </div>
    </section>
  );
}