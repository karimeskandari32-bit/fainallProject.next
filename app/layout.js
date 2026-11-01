import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "نام سایت شما",
  description: "پلتفرم آموزش آنلاین برنامه‌نویسی",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}