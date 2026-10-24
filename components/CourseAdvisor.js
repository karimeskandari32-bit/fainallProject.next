"use client";
import { useState } from "react";

const levelFa = {
  beginner: "مقدماتی",
  intermediate: "متوسط",
  advanced: "پیشرفته",
};

export default function CourseAdvisor() {
  const [need, setNeed] = useState("");
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState(null);
  const [failed, setFailed] = useState(false);

  async function submit() {
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
    <div className="max-w-2xl mx-auto p-4 space-y-3" dir="rtl">
      <textarea
        value={need}
        onChange={(e) => setNeed(e.target.value)}
        placeholder="چه چیزی می‌خواهید یاد بگیرید؟ مثلاً: می‌خواهم از صفر طراحی سایت یاد بگیرم"
        className="w-full border rounded-lg p-3"
        rows={3}
        maxLength={300}
      />
      <button
        onClick={submit}
        disabled={loading || need.trim().length < 3}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? "در حال بررسی..." : "پیشنهاد دوره"}
      </button>

      {failed && <p>الان امکان پیشنهاد نیست، کمی بعد دوباره امتحان کنید.</p>}
      {!failed && courses && courses.length === 0 && (
        <p>دوره مناسبی پیدا نشد.</p>
      )}

      {courses?.map((c) => (
        <a
          key={c.id}
          href={`/course/${c.slug}`}
          className="block border rounded-lg p-3 hover:shadow"
        >
          <h3 className="font-bold">{c.title}</h3>
          <p className="text-sm text-gray-600">{c.shortDescription}</p>
          <div className="text-xs mt-2 flex gap-3">
            <span>سطح: {levelFa[c.level] ?? c.level}</span>
            {c.totalDuration && <span>{c.totalDuration}</span>}
            <span>
              {c.isFree
                ? "رایگان"
                : `${(c.discountPrice ?? c.price).toLocaleString("fa-IR")} تومان`}
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}