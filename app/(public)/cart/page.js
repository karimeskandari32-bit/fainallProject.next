"use client";


import styles from "./page.module.css";
import Link from "next/link";
import { FaTrash, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useCart } from "@/authContet/CartContext";

export default function Cart() {
  const { cart, totalPrice, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [code, setCode] = useState("");

  const handleCheckout = async () => {
  if (loading) return;
  setLoading(true);
  try {
    // 1- ساخت سفارش
    const orderRes = await fetch("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        courseIds: cart.map((course) => course._id),
      }),
      headers: { "Content-Type": "application/json" },
    });

    const orderData = await orderRes.json();

    if (!orderData.success) {
      return toast.error("خطا هنگام ثبت سفارش");
    }

    const orderId = orderData.orderId;

    // 2- درخواست لینک پرداخت (با کد تخفیف، اگر وارد شده)
    const paymentRes = await fetch("/api/payment/request", {
      method: "POST",
      body: JSON.stringify({ orderId, code: code.trim() }),
      headers: { "Content-Type": "application/json" },
    });

    const paymentData = await paymentRes.json();

    if (!paymentData.success) {
      console.log(paymentData); // برای دیدن علت دقیق در کنسول مرورگر
      const msg = paymentData.message || "";
      // پیام‌های تخفیف فارسی هستند و مستقیم نمایش داده می‌شوند
      return toast.error(
        /[\u0600-\u06FF]/.test(msg) ? msg : "خطا در ارسال به درگاه پرداخت",
      );
    }

    toast.success("در حال انتقال به درگاه پرداخت");
    router.push(paymentData.paymentUrl);
  } catch (err) {
    console.log(err);
    toast.error("خطا در درگاه پرداخت");
  } finally {
    setLoading(false);
  }
};

  if (cart.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <FaShoppingCart size={80} color="#cbd5e1" />
        <h2>سبد خرید شما خالی است</h2>
        <p>هنوز دوره‌ای به سبد خرید اضافه نکرده‌اید.</p>
        <Link href="/courses" className={styles.browseBtn}>
          مشاهده دوره‌ها
        </Link>
      </div>
    );
  }

  return (
   <div className={styles.cartPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>سبد خرید</h1>
        <Link href="/courses" className={styles.backLink}>
          <FaArrowLeft />
          ادامه خرید
        </Link>
      </div>

    <div className={styles.cartContainer}>
        <div className={styles.cartItems}>
          {cart.map((course) => (
            <div key={course._id} className={styles.cartItem}>
              <div className={styles.itemThumbnail}>
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  width={120}
                  height={80}
                  className={styles.thumbnailImg}
                />
              </div>

              <div className={styles.itemInfo}>
                <h3 className={styles.itemTitle}>{course.title}</h3>
              </div>

              <div className={styles.itemPrice}>
                {(course.discountPrice || course.price)?.toLocaleString()} تومان
              </div>

              <button
                onClick={() => removeFromCart(course._id)}
                className={styles.removeBtn}
                aria-label="حذف از سبد"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        <div className={styles.cartSummary}>
          <div className={styles.summaryHeader}>
            <h3>خلاصه سبد خرید</h3>
            <p>{cart.length} دوره</p>
          </div>

          <div className={styles.priceDetails}>
            <div className={styles.priceRow}>
              <span>مجموع قیمت</span>
              <span>{totalPrice.toLocaleString()} تومان</span>
            </div>
            {/* اگر تخفیف کلی داشتی، اینجا اضافه کن */}
          </div>

          <div className={styles.totalPrice}>
            <span>پرداخت نهایی</span>
            <span className={styles.finalAmount}>
              {totalPrice.toLocaleString()} تومان
            </span>
          </div>
          <div className={styles.couponBox}>
  <input
    className={styles.couponInput}
    value={code}
    onChange={(e) => setCode(e.target.value.toUpperCase())}
    placeholder="کد تخفیف (اختیاری)"
    maxLength={20}
    dir="ltr"
  />
</div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className={styles.checkoutBtn}
          >
            {loading ? "در حال پردازش..." : "تکمیل خرید"}
          </button>

          <p className={styles.secureNote}>پرداخت امن با درگاه معتبر</p>
        </div>
      </div>
    </div>
  );
}