"use client";
import { useEffect, useState } from "react";
import styles from "./lastCourses.module.css";
import CourseCard from "@/components/ui/CourseCard";

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
    <section className={`container section ${styles.wrapper}`}>
      <div className="sectionHeader">
        <p className="sectionTitle">آخرین دوره های آموزشی</p>
        <p className="sectionMore">همه دوره ها</p>
      </div>

      {loading ? (
        <p>در حال لود دوره ها...</p>
      ) : error ? (
        <p>خطا در دریافت دوره‌ها. لطفاً دوباره تلاش کنید.</p>
      ) : courses.length === 0 ? (
        <p>هنوز دوره‌ای ثبت نشده است.</p>
      ) : (
        <div className={styles.lastCourses}>
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </section>
  );
}