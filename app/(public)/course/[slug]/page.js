import conectToDB from "@/configs/db"
import Course from "@/models/Course"
import { notFound } from "next/navigation"
import styles from './page.module.css'
import CourseIntro from "@/components/sections/course/courseIntro"
import CourseDescription from "@/components/sections/course/CourseDescription"
import CourseChapters from "@/components/sections/course/CourseChapters"
import CourseComments from "@/components/sections/course/CourseComment"
import Comment from "@/models/Comment"
import User from "@/models/User"

export default async function CourseDitails({params}){
    const {slug}=await params
    await conectToDB()
    const course = await Course.findOne({slug}).lean()
    if(!course){
        return notFound()
    }

     // گرفتن کامنت‌های تأیید شده جداگانه
  const comments = await Comment.find({ course: course._id, isApproved: true })
    .populate("user", "name")
    .sort({ createdAt: -1 })
    .lean();



     // محاسبه مدت زمان کل دوره
  const calculateTotalDuration = (chapters) => {
    let totalSeconds = 0;

    chapters.forEach((chapter) => {
      chapter.lessons.forEach((lesson) => {
        if (!lesson.duration) return;

        const parts = lesson.duration.trim().split(":");
        let seconds = 0;

        // فرمت MM:SS
        const minutes = parseInt(parts[0]) || 0;
        const secs = parseInt(parts[1]) || 0;
        seconds = minutes * 60 + secs;
        totalSeconds += seconds;
      });
    });

    // تبدیل به فرمت خوانا
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${hours} ساعت و ${minutes} دقیقه`;
    } else if (minutes > 0) {
      return `${minutes} دقیقه${secs > 0 ? ` و ${secs} ثانیه` : ""}`;
    } else {
      return `${secs} ثانیه`;
    }
  };

  const totalDuration = calculateTotalDuration(course.chapters);
  const totalLessons = course.lessonsCount;

  const statusText =
    course.status === "published"
      ? "منتشر شده"
      : course.status === "coming-soon"
        ? "به زودی"
        : "پیش‌ نویس";

  //سطح دوره
  const levelText =
    course.level === "beginner"
      ? "مبتدی"
      : course.level === "intermediate"
        ? "متوسط"
        : "پیشرفته";



    const plainCourse=JSON.parse(JSON.stringify(course))
      const plainComments = JSON.parse(JSON.stringify(comments));
    return(
         <div className="container">
      <div className={styles.courseDetailsPage}>
        <CourseIntro
          course={plainCourse}
          totalDuration={totalDuration}
          totalLessons={totalLessons}
          statusText={statusText}
          levelText={levelText}
        />
         <CourseDescription fullDescription={course. fullDescription}/>
         <CourseChapters course={plainCourse}/>
         <CourseComments course={plainCourse} comments={plainComments}/>
      </div>
     
    </div>
    )
}
