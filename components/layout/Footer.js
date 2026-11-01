import Link from "next/link";
import Image from "next/image";

const EXPLORE = [
  { href: "/courses", label: "دوره‌های آموزشی" },
  { href: "/podcast", label: "پادکست" },
  { href: "/articles", label: "مقاله‌ها" },
];

const ACCOUNT = [
  { href: "/profile", label: "پروفایل" },
  { href: "/my-courses", label: "دوره‌های من" },
  { href: "/cart", label: "سبد خرید" },
];

function LinkGroup({ title, items }) {
  return (
    <div>
      <h3 className="font-heading text-sm font-bold">{title}</h3>
      <ul className="mt-4 space-y-3">
        {items.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const year = new Date().toLocaleDateString("fa-IR", { year: "numeric" });

  return (
    <footer className="mt-12 border-t bg-card/40">
      <div className="container grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Link href="/" className="inline-block">
            <Image
              src="/images/image.png"
              alt="لوگو"
              width={48}
              height={48}
              className="h-11 w-auto"
            />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
            پلتفرم آموزش آنلاین برنامه‌نویسی با دوره‌های پروژه‌محور و مشاور
            هوشمند برای انتخاب مسیر یادگیری.
          </p>
        </div>

        <LinkGroup title="دسترسی سریع" items={EXPLORE} />
        <LinkGroup title="حساب کاربری" items={ACCOUNT} />
      </div>

      <div className="border-t">
        <p className="container py-5 text-center text-xs text-muted-foreground">
          © {year} — تمامی حقوق محفوظ است.
        </p>
      </div>
    </footer>
  );
}