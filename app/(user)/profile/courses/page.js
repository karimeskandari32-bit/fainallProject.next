"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MyCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/user/courses");
        if (res.status === 401) {
          setError("برای دیدن دوره‌ها باید وارد شوید.");
          return;
        }
        if (!res.ok) throw new Error();
        const data = await res.json();
        setCourses(data.courses || []);
      } catch {
        setError("خطا در دریافت دوره‌ها");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <p className="p-10">در حال بارگذاری...</p>;
  if (error) return <p className="p-10">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">دوره‌های خریداری‌شده من</h1>

      {courses.length === 0 ? (
        <p>هنوز دوره‌ای نخریده‌اید.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <Link
              key={course._id}
              href={`/courses/${course.slug}`}
              className="border rounded-xl overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="font-bold mb-2">{course.title}</h2>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {course.shortDescription}
                </p>
                <span className="inline-block mt-3 text-blue-600 font-semibold">
                  شروع یادگیری
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}