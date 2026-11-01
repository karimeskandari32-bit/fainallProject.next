import Hero from "@/components/sections/home/Hero";
import CourseAdvisor from "@/components/CourseAdvisor";
import LastCourses from "@/components/sections/home/lastCourses";
import Features from "@/components/sections/home/Features";
import Testimonials from "@/components/sections/home/Testimonials";
import Faq from "@/components/sections/home/Faq";
import CtaSection from "@/components/sections/home/CtaSection";

// آمار و نظرات صفحه اصلی هر ۵ دقیقه یک‌بار از دیتابیس تازه می‌شن
export const revalidate = 300;

export default function Home() {
  return (
    <>
      <Hero />
      <div id="advisor" className="scroll-mt-20">
        <CourseAdvisor />
      </div>
      <LastCourses />
      <Features />
      <Testimonials />
      <Faq />
      <CtaSection />
    </>
  );
}