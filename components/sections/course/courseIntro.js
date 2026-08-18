"use client";

import { useState } from "react";
import Link from "next/link";
import { FaCartShopping } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import styles from "./courseIntro.module.css";
import toast from "react-hot-toast";
import { useCart } from "@/authContet/CartContext";
import { useAuth } from "@/authContet/authContext";



export default function CourseIntro({
  course,
  totalDuration,
  totalLessons,
  statusText,
  levelText,
}) {
  const { cart, addToCart } = useCart();
  const { user } = useAuth()
  const [loading, setLoading] = useState(false);

  const isFree = false;
  const hasPurchased = user && user.purchaseCourses?.some( purchaseCourse => purchaseCourse === course._id );
  const hasDiscount = false;
  const finalPrice = hasDiscount ? course.discountPrice : course.price;
  const isCourseInCart = cart.some(
    (courseInCart) => courseInCart._id === course._id,
  );

  const addToCartHandler = () => {
    if (!user) {
      return toast.error("ابتدا باید لاگین کنی");
    }
    addToCart(course);
    toast.success("دوره به سبد خرید اضافه شد!");
  };

  return (
    <div className={styles.courseIntro}>
      <div className={styles.courseInfo}>
        <h1 className={styles.courseTitle}>{course.title}</h1>

        <p className={styles.courseDesc}>
          {course.shortDescription ||
            "توضیحات کوتاهی برای این دوره در دسترس نیست."}
        </p>

        <div className={styles.coursePayment}>
          {hasPurchased ? (
            <div className={styles.purchasedBox}>
              <FaCheckCircle size="28px" color="#10b981" />
              <span>شما در این دوره ثبت‌ نام کرده‌اید</span>
              <Link
                href={`/learn/${course.slug}`}
                className={styles.startLearningBtn}
              >
                شروع یادگیری
              </Link>
            </div>
          ) : (
            <button
              onClick={() => addToCartHandler(course)}
              disabled={loading}
              className={true ? styles.freeEnrollBtn : styles.enrollBtn}
            >
              <FaCartShopping size="22px" />
              <span>
                {loading
                  ? "در حال پردازش..."
                  : isFree
                    ? "ثبت‌ نام رایگان"
                    : isCourseInCart
                      ? "به سبد خرید اضافه شده"
                      : "ثبت نام در دوره"}
              </span>
            </button>
          )}

          {!isFree && !hasPurchased && (
            <div className={styles.priceBox}>
              {hasDiscount && (
                <del className={styles.originalPrice}>
                  {course.price?.toLocaleString()} تومان
                </del>
              )}
              <p className={styles.finalPrice}>
                <span>{finalPrice?.toLocaleString()}</span>
                <span> تومان</span>
              </p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.courseMeta}>
        <MetaItem label="وضعیت دوره" value={statusText} />
        <MetaItem label="سطح" value={levelText} />
        <MetaItem label="مدت زمان" value={totalDuration} />
        <MetaItem label="تعداد جلسات" value={`${totalLessons} جلسه`} />
        <MetaItem label="روش پشتیبانی" value="تیکت و پرسش و پاسخ" />
        <MetaItem label="پیش‌ نیاز" value="ندارد" />
      </div>
    </div>
  );
}

function MetaItem({ label, value }) {
  return (
    <div className={styles.courseDetailBox}>
      <p className={styles.label}>
        <b>{label}</b>
      </p>
      <p className={styles.value}>{value}</p>
    </div>
  );
}