"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LuSearch, LuX, LuLoader } from "react-icons/lu";

import { cn } from "@/lib/utils";

const LEVELS = [
  { value: "", label: "همه سطح‌ها" },
  { value: "beginner", label: "مقدماتی" },
  { value: "intermediate", label: "متوسط" },
  { value: "advanced", label: "پیشرفته" },
];

const PRICES = [
  { value: "", label: "همه" },
  { value: "free", label: "رایگان" },
  { value: "paid", label: "پولی" },
  { value: "discount", label: "تخفیف‌دار" },
];

const SORTS = [
  { value: "newest", label: "جدیدترین" },
  { value: "popular", label: "محبوب‌ترین" },
  { value: "cheap", label: "ارزان‌ترین" },
  { value: "expensive", label: "گران‌ترین" },
];

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-xs transition-colors sm:text-sm",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

export default function CoursesFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const level = searchParams.get("level") || "";
  const price = searchParams.get("price") || "";
  const sort = searchParams.get("sort") || "newest";
  const currentQ = searchParams.get("q") || "";

  const [q, setQ] = useState(currentQ);

  function update(changes) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(changes).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    params.delete("page"); // با هر تغییر فیلتر، از صفحه اول شروع شه
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  // جستجو با کمی تأخیر تا با هر حرف درخواست نره
  useEffect(() => {
    if (q.trim() === currentQ) return;
    const t = setTimeout(() => update({ q: q.trim() }), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const hasFilters = Boolean(currentQ || level || price || sort !== "newest");

  function reset() {
    setQ("");
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }

  return (
    <div className="rounded-2xl border bg-card p-4 sm:p-5">
      {/* جستجو + مرتب‌سازی */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <LuSearch className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="جستجوی دوره... (مثلاً React)"
            className="h-12 w-full rounded-xl border border-input bg-background ps-12 pe-4 text-sm outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30"
          />
          {isPending && (
            <LuLoader className="absolute end-4 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
        </div>

        <select
          value={sort}
          onChange={(e) =>
            update({ sort: e.target.value === "newest" ? "" : e.target.value })
          }
          aria-label="مرتب‌سازی"
          className="h-12 rounded-xl border border-input bg-background px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 sm:w-44"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* فیلترها */}
      <div className="mt-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-12 text-xs text-muted-foreground">سطح:</span>
          {LEVELS.map((l) => (
            <Chip
              key={l.value}
              active={level === l.value}
              onClick={() => update({ level: l.value })}
            >
              {l.label}
            </Chip>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="w-12 text-xs text-muted-foreground">قیمت:</span>
          {PRICES.map((p) => (
            <Chip
              key={p.value}
              active={price === p.value}
              onClick={() => update({ price: p.value })}
            >
              {p.label}
            </Chip>
          ))}
        </div>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={reset}
          className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-destructive"
        >
          <LuX className="size-4" />
          پاک کردن همه فیلترها
        </button>
      )}
    </div>
  );
}