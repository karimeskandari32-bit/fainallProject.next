"use client";
import { useState } from "react";
import styles from "./CourseAdvisor.module.css";

const levelFa = {
  beginner: "مقدماتی",
  intermediate: "متوسط",
  advanced: "پیشرفته",
};

const examples = [
  "می‌خواهم از صفر طراحی سایت یاد بگیرم",
  "دنبال دوره React و Next.js هستم",
  "برای ورود به بازار کار برنامه‌نویسی چه دوره‌ای بگیرم؟",
];

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2zm7 11l.9 2.6 2.6.9-2.6.9L19 20l-.9-2.6-2.6-.9 2.6-.9L19 13zM6 14l.9 2.6 2.6.9-2.6.9L6 21l-.9-2.6-2.6-.9 2.6-.9L6 14z" />
    </svg>
  );
}

export default function CourseAdvisor() {
  const [need, setNeed] = useState("");
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState(null);
  const [failed, setFailed] = useState(false);

  async function submit() {
    if (loading || need.trim().length < 3) return;
    setLoading(true);
    setCourses(null);
    setFailed(false);
    try {
      const res = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ need }),
      });
      const data = await res.json();
      setFailed(Boolean(data.aiFailed));
      setCourses(data.courses ?? []);
    } catch {
      setFailed(true);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section dir="rtl" className={styles.root}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.icon}>
            <SparkIcon />
          </div>
          <div>
            <h2 className={styles.title}>مشاور هوشمند دوره</h2>
            <p className={styles.subtitle}>
              هدفت را بنویس، مناسب‌ترین دوره‌ها را پیشنهاد می‌دهیم
            </p>
          </div>
        </div>

        <div className={styles.field}>
          <textarea
            className={styles.textarea}
            value={need}
            onChange={(e) => setNeed(e.target.value)}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === "Enter") submit();
            }}
            placeholder="مثلاً: می‌خواهم از صفر طراحی سایت یاد بگیرم..."
            maxLength={300}
          />
          <span className={styles.counter}>{need.length}/300</span>
        </div>

        <div className={styles.chips}>
          {examples.map((ex) => (
            <button
              key={ex}
              type="button"
              className={styles.chip}
              onClick={() => setNeed(ex)}
            >
              {ex}
            </button>
          ))}
        </div>

        <button
          className={styles.btn}
          onClick={submit}
          disabled={loading || need.trim().length < 3}
        >
          {loading ? (
            <>
              <span className={styles.spinner} />
              در حال بررسی...
            </>
          ) : (
            <>
              <SparkIcon />
              پیشنهاد دوره
            </>
          )}
        </button>

        {(loading || failed || courses) && (
          <div className={styles.results}>
            {loading && (
              <>
                <div className={styles.skeleton} />
                <div className={styles.skeleton} />
              </>
            )}

            {failed && (
              <div className={styles.notice}>
                الان امکان پیشنهاد نیست، کمی بعد دوباره امتحان کنید.
              </div>
            )}

            {!failed && courses && courses.length === 0 && (
              <div className={styles.notice}>
                دوره مناسبی پیدا نشد. هدفت را کمی دقیق‌تر یا با کلمه‌های دیگر
                بنویس.
              </div>
            )}

            {courses?.map((c) => {
              const hasDiscount =
                c.discountPrice != null && c.discountPrice < c.price;
              const finalPrice = hasDiscount ? c.discountPrice : c.price;

              return (
                <a key={c.id} href={`/course/${c.slug}`} className={styles.item}>
                  <div className={styles.thumb}>
                    {c.thumbnail ? (
                      <img src={c.thumbnail} alt={c.title} />
                    ) : (
                      <SparkIcon />
                    )}
                  </div>

                  <div className={styles.body}>
                    <div className={styles.top}>
                      <h3 className={styles.name}>{c.title}</h3>
                      <span className={styles.badge} data-level={c.level}>
                        {levelFa[c.level] ?? c.level}
                      </span>
                    </div>

                    <p className={styles.desc}>{c.shortDescription}</p>

                    <div className={styles.meta}>
                      <span className={styles.duration}>
                        {c.totalDuration || ""}
                      </span>
                      {c.isFree ? (
                        <span className={styles.free}>رایگان</span>
                      ) : (
                        <div className={styles.priceBox}>
                          {hasDiscount && (
                            <span className={styles.old}>
                              {c.price.toLocaleString("fa-IR")}
                            </span>
                          )}
                          <span className={styles.price}>
                            {finalPrice.toLocaleString("fa-IR")} تومان
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}