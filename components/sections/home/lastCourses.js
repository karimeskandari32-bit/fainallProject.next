"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LuArrowLeft, LuCircleAlert, LuInbox } from "react-icons/lu";

import CourseCard from "@/components/ui/CourseCard";
import { Skeleton } from "@/components/ui/skeleton";

const GRID = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4";

function CourseSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="mt-4 h-5 w-1/3" />
      </div>
    </div>
  );
}

function Message({ icon: Icon, children }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-14 text-center text-sm text-muted-foreground">
      <Icon className="size-8" strokeWidth={1.5} />
      <p>{children}</p>
    </div>
  );
}

export default function LastCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchLatestCourses = async () => {
      try {
        const res = await fetch("/api/courses/latest");
        if (!res.ok) throw new Error();

        const data = await res.json();
        setCourses(data.courses || []);
      } catch (err) {
        console.error("Error fetching latest courses:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestCourses();
  }, []);

  return (
    <section className="container py-12 sm:py-16">
      {/* سرتیتر بخش */}
      <div className="mb-8 flex items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="h-8 w-1.5 rounded-full bg-primary" />
          <div>
            <h2 className="font-heading text-xl font-bold sm:text-2xl">
              آخرین دوره‌های آموزشی
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              تازه‌ترین دوره‌هایی که به سایت اضافه شدن
            </p>
          </div>
        </div>

        <Link
          href="/courses"
          className="group flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary"
        >
          همه دوره‌ها
          <LuArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
        </Link>
      </div>

      {/* محتوا */}
      {loading ? (
        <div className={GRID}>
          {Array.from({ length: 4 }).map((_, i) => (
            <CourseSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <Message icon={LuCircleAlert}>
          خطا در دریافت دوره‌ها. لطفاً دوباره تلاش کنید.
        </Message>
      ) : courses.length === 0 ? (
        <Message icon={LuInbox}>هنوز دوره‌ای ثبت نشده است.</Message>
      ) : (
        <div className={GRID}>
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </section>
  );
}