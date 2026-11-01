import { LuChevronDown } from "react-icons/lu";

// ✏️ جواب‌ها رو با قوانین واقعی سایتت چک و ویرایش کن
const FAQS = [
  {
    q: "چطور یک دوره رو بخرم؟",
    a: "دوره رو به سبد خرید اضافه کن، سفارش رو ثبت کن و از طریق درگاه پرداخت، مبلغ رو پرداخت کن. بعد از پرداخت موفق، دوره به حساب کاربری‌ات اضافه می‌شه.",
  },
  {
    q: "دوره‌هایی که خریدم کجا هستن؟",
    a: "از منوی حساب کاربری (بالای صفحه) روی «دوره‌های من» بزن تا همه دوره‌های خریداری‌شده‌ات رو ببینی.",
  },
  {
    q: "مشاور هوشمند چطور کار می‌کنه؟",
    a: "توی بخش مشاور هوشمند هدفت رو بنویس. سیستم بر اساس نوشته‌ات از بین دوره‌های سایت، مرتبط‌ترین‌ها رو پیشنهاد می‌ده.",
  },
  {
    q: "اگه پرداخت ناموفق بود چی‌کار کنم؟",
    a: "سفارش رو دوباره از سبد خرید یا بخش سفارش‌ها پرداخت کن. اگه مبلغی از حسابت کم شده ولی دوره اضافه نشده، موضوع رو با پشتیبانی در میون بذار.",
  },
];

export default function Faq() {
  return (
    <section className="container py-12 sm:py-16">
      <div className="mb-10 text-center">
        <h2 className="font-heading text-xl font-bold sm:text-2xl">
          سوالات متداول
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          جواب چند سوالی که بیشتر پرسیده می‌شه
        </p>
      </div>

      <div className="mx-auto max-w-3xl space-y-3">
        {FAQS.map(({ q, a }) => (
          <details
            key={q}
            className="group rounded-2xl border bg-card px-5 transition-colors open:border-primary/40"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-medium sm:text-base [&::-webkit-details-marker]:hidden">
              {q}
              <LuChevronDown className="size-5 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180 group-open:text-primary" />
            </summary>
            <p className="pb-5 text-sm leading-7 text-muted-foreground">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}