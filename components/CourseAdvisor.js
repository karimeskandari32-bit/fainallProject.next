"use client";

import { useState } from "react";
import Link from "next/link";
import { LuSparkles, LuLoader, LuClock } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const levelFa = {
  beginner: "مقدماتی",
  intermediate: "متوسط",
  advanced: "پیشرفته",
};

const levelStyle = {
  beginner:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  intermediate:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  advanced: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

const examples = [
  "می‌خواهم از صفر طراحی سایت یاد بگیرم",
  "دنبال دوره React و Next.js هستم",
  "برای ورود به بازار کار برنامه‌نویسی چه دوره‌ای بگیرم؟",
];

const fa = (n) => Number(n || 0).toLocaleString("fa-IR");

export default function CourseAdvisor() {
  const [need, setNeed] = useState("");
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState(null);
  const [failed, setFailed] = useState(false);

  async function submit() {
    if (loading || need.trim().length < 3) return;
    setLoading(true);
    setCourses(null);
    setFailed(false);
    try {
      const res = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ need }),
      });
      const data = await res.json();
      setFailed(Boolean(data.aiFailed));
      setCourses(data.courses ?? []);
    } catch {
      setFailed(true);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container py-8 sm:py-12">
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border bg-card p-5 shadow-sm sm:p-8">
        {/* درخشش ملایم پس‌زمینه */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 end-0 size-64 rounded-full bg-primary/10 blur-3xl"
        />

        <div className="relative">
          {/* سرتیتر */}
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <LuSparkles className="size-6" strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold sm:text-xl">
                مشاور هوشمند دوره
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                هدفت را بنویس، مناسب‌ترین دوره‌ها را پیشنهاد می‌دهیم
              </p>
            </div>
          </div>

          {/* ورودی */}
          <div className="relative mt-6">
            <textarea
              value={need}
              onChange={(e) => setNeed(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") submit();
              }}
              placeholder="مثلاً: می‌خواهم از صفر طراحی سایت یاد بگیرم..."
              maxLength={300}
              rows={3}
              className="min-h-28 w-full resize-none rounded-2xl border border-input bg-background p-4 pb-8 text-sm leading-7 outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30"
            />
            <span className="pointer-events-none absolute bottom-3 end-4 text-xs text-muted-foreground">
              {fa(need.length)}/{fa(300)}
            </span>
          </div>

          {/* نمونه‌ها */}
          <div className="mt-3 flex flex-wrap gap-2">
            {examples.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setNeed(ex)}
                className="rounded-full border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-foreground"
              >
                {ex}
              </button>
            ))}
          </div>

          {/* دکمه */}
          <Button
            onClick={submit}
            disabled={loading || need.trim().length < 3}
            size="lg"
            className="mt-5 w-full gap-2 rounded-full"
          >
            {loading ? (
              <>
                <LuLoader className="size-4 animate-spin" />
                در حال بررسی...
              </>
            ) : (
              <>
                <LuSparkles className="size-4" />
                پیشنهاد دوره
              </>
            )}
          </Button>

          {/* نتایج */}
          {(loading || failed || courses) && (
            <div className="mt-6 space-y-3" aria-live="polite">
              {loading && (
                <>
                  <Skeleton className="h-28 w-full rounded-2xl" />
                  <Skeleton className="h-28 w-full rounded-2xl" />
                </>
              )}

              {failed && (
                <div className="rounded-2xl border border-dashed p-5 text-center text-sm text-muted-foreground">
                  الان امکان پیشنهاد نیست، کمی بعد دوباره امتحان کنید.
                </div>
              )}

              {!failed && courses && courses.length === 0 && (
                <div className="rounded-2xl border border-dashed p-5 text-center text-sm text-muted-foreground">
                  دوره مناسبی پیدا نشد. هدفت را کمی دقیق‌تر یا با کلمه‌های دیگر
                  بنویس.
                </div>
              )}

              {courses?.map((c) => {
                const hasDiscount =
                  c.discountPrice != null && c.discountPrice < c.price;
                const finalPrice = hasDiscount ? c.discountPrice : c.price;

                return (
                  <Link
                    key={c.id}
                    href={`/course/${c.slug}`}
                    className="group flex gap-4 rounded-2xl border bg-background p-3 transition-all hover:border-primary/40 hover:shadow-md"
                  >
                    <div className="flex h-24 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted text-muted-foreground sm:w-36">
                      {c.thumbnail ? (
                        <img
                          src={c.thumbnail}
                          alt={c.title}
                          loading="lazy"
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <LuSparkles className="size-6" />
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="line-clamp-1 font-heading text-sm font-bold transition-colors group-hover:text-primary sm:text-base">
                            {c.title}
                          </h3>
                          {c.level && (
                            <span
                              className={cn(
                                "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium",
                                levelStyle[c.level] ??
                                  "bg-muted text-muted-foreground"
                              )}
                            >
                              {levelFa[c.level] ?? c.level}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs leading-6 text-muted-foreground sm:text-sm">
                          {c.shortDescription}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          {c.totalDuration && (
                            <>
                              <LuClock className="size-3.5" />
                              {c.totalDuration}
                            </>
                          )}
                        </span>

                        {c.isFree ? (
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            رایگان
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            {hasDiscount && (
                              <del className="text-muted-foreground">
                                {fa(c.price)}
                              </del>
                            )}
                            <span className="text-sm font-bold">
                              {fa(finalPrice)}{" "}
                              <span className="text-xs font-normal text-muted-foreground">
                                تومان
                              </span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}