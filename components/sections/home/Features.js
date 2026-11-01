import { LuCode, LuSparkles, LuShieldCheck, LuTag } from "react-icons/lu";

// ✏️ متن‌ها رو مطابق ویژگی‌های واقعی سایتت ویرایش کن
const FEATURES = [
  {
    icon: LuCode,
    title: "آموزش پروژه‌محور",
    desc: "هر دوره حول پروژه‌های واقعی طراحی شده تا چیزی که یاد می‌گیری رو همون لحظه به کار ببری.",
  },
  {
    icon: LuSparkles,
    title: "مشاور هوشمند",
    desc: "هدفت رو بنویس و مشاور هوشمند سایت، مناسب‌ترین دوره‌ها رو برات پیشنهاد می‌ده.",
  },
  {
    icon: LuShieldCheck,
    title: "پرداخت امن",
    desc: "خرید از طریق درگاه پرداخت معتبر انجام می‌شه و بعد از پرداخت، دوره به حساب خودت اضافه می‌شه.",
  },
  {
    icon: LuTag,
    title: "کد تخفیف و دوره رایگان",
    desc: "بعضی دوره‌ها رایگان‌ان و برای بقیه هم کدهای تخفیف و تخفیف‌های دوره‌ای ارائه می‌شه.",
  },
];

export default function Features() {
  return (
    <section className="container py-12 sm:py-16">
      <div className="mb-10 text-center">
        <h2 className="font-heading text-xl font-bold sm:text-2xl">
          چرا از اینجا یاد بگیریم؟
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          چیزهایی که یادگیری رو ساده‌تر و مطمئن‌تر می‌کنه
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="group rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
          >
            <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="size-6" strokeWidth={1.75} />
            </span>
            <h3 className="mt-5 font-heading text-base font-bold">{title}</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}