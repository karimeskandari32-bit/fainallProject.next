"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import {
  LuHouse,
  LuGraduationCap,
  LuMic,
  LuNewspaper,
  LuShoppingBasket,
  LuUserRound,
  LuMenu,
  LuLogOut,
  LuBookOpen,
  LuBox,
  LuCircleUser,
} from "react-icons/lu";

import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/authContet/authContext";
import { useCart } from "@/authContet/CartContext";
import ThemeToggle from "../shared/ThemeToggle";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "صفحه اصلی", icon: LuHouse },
  { href: "/courses", label: "دوره‌های آموزشی", icon: LuGraduationCap },
  { href: "/podcast", label: "پادکست", icon: LuMic },
  { href: "/articles", label: "مقاله‌ها", icon: LuNewspaper },
];

const iconBtn = buttonVariants({ variant: "outline", size: "icon" });

export default function Header() {
  const { loading, user, logout } = useAuth();
  const { cartCount } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
        {/* لوگو */}
        <Link href="/" className="shrink-0">
          <Image
            src="/images/image.png"
            alt="لوگو"
            width={48}
            height={48}
            priority
            className="h-11 w-auto"
          />
        </Link>

        {/* منوی دسکتاپ */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-foreground/70 hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="size-[18px] shrink-0" strokeWidth={1.75} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* سمت چپ هدر */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* سبد خرید */}
          <Link
            href="/cart"
            aria-label="سبد خرید"
            className={cn(iconBtn, "relative")}
          >
            <LuShoppingBasket className="size-5" strokeWidth={1.75} />
            {cartCount > 0 && (
              <Badge className="absolute -top-2 -end-2 h-5 min-w-5 justify-center rounded-full px-1 text-xs">
                {cartCount}
              </Badge>
            )}
          </Link>

          {/* کاربر */}
          {loading ? (
            <Skeleton className="size-9 rounded-md" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger aria-label="حساب کاربری" className={iconBtn}>
                <LuUserRound className="size-5" strokeWidth={1.75} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem
                  className="cursor-pointer gap-2"
                  onClick={() => router.push("/profile")}
                >
                  <LuCircleUser className="size-4" strokeWidth={1.75} />
                  پروفایل
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer gap-2"
                  onClick={() => router.push("/my-courses")}
                >
                  <LuBookOpen className="size-4" strokeWidth={1.75} />
                  دوره‌های من
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer gap-2"
                  onClick={() => router.push("/profile")}
                >
                  <LuBox className="size-4" strokeWidth={1.75} />
                  لایسنس‌های من
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                >
                  <LuLogOut className="size-4" strokeWidth={1.75} />
                  خروج از حساب کاربری
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/auth"
              className={cn(
                buttonVariants(),
                "hidden rounded-full px-5 sm:inline-flex"
              )}
            >
              ورود | ثبت‌نام
            </Link>
          )}

          {/* منوی موبایل */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger
              aria-label="منو"
              className={cn(iconBtn, "md:hidden")}
            >
              <LuMenu className="size-5" strokeWidth={1.75} />
            </SheetTrigger>

            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>منو</SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-1 px-4">
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                  const active = isActive(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setSheetOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors",
                        active
                          ? "bg-primary/10 font-semibold text-primary"
                          : "text-foreground/70 hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <Icon className="size-5 shrink-0" strokeWidth={1.75} />
                      {label}
                    </Link>
                  );
                })}

                {!loading && !user && (
                  <>
                    <Separator className="my-3" />
                    <Link
                      href="/auth"
                      onClick={() => setSheetOpen(false)}
                      className={cn(buttonVariants(), "rounded-full")}
                    >
                      ورود | ثبت‌نام
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}