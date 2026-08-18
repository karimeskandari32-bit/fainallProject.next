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
        console.log(data)
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
    <div className="container section">
      <div className="sectionHeader">
        <p className="sectionTitle">آخرین دوره های آموزشی</p>
        <p className="sectionMore">همه دوره ها</p>
      </div>
      <div className={styles.lastCourses}>
           {loading ? (
          <p>در حال لود دوره ها</p>
        ) : (
          courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))
        )}
     
      </div>
    </div>
  );
}