"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./CategoriesManager.module.css";

const emptyForm = { title: "", slug: "", description: "" };

// هر دسته یک رنگ ثابت بر اساس عنوانش می‌گیرد
function colorOf(text) {
  let h = 0;
  for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return `linear-gradient(135deg, hsl(${h} 70% 55%), hsl(${(h + 40) % 360} 70% 50%))`;
}

const Icon = {
  plus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  edit: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  ),
  trash: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6" />
    </svg>
  ),
  folder: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
    </svg>
  ),
};

export default function CategoriesManager({ categories }) {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const change = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  function startEdit(c) {
    setEditingId(c.id);
    setForm({ title: c.title, slug: c.slug, description: c.description });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || data.message || "خطا در ذخیره");
        return;
      }
      reset();
      router.refresh();
    } catch {
      setError("ارتباط با سرور برقرار نشد");
    } finally {
      setLoading(false);
    }
  }

  async function remove(c) {
    if (!window.confirm(`دسته‌بندی «${c.title}» حذف شود؟`)) return;
    setError("");
    const res = await fetch(`/api/admin/categories/${c.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || data.message || "خطا در حذف");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (editingId === c.id) reset();
    router.refresh();
  }

  return (
    <div className={styles.root} dir="rtl">
      {/* فرم */}
      <form
        onSubmit={submit}
        className={styles.card}
        data-editing={editingId ? "true" : "false"}
      >
        <div className={styles.cardHead}>
          <div className={styles.cardIcon}>
            {editingId ? Icon.edit : Icon.plus}
          </div>
          <div>
            <h2 className={styles.cardTitle}>
              {editingId ? "ویرایش دسته‌بندی" : "دسته‌بندی جدید"}
            </h2>
            <p className={styles.cardHint}>
              {editingId
                ? "تغییرات را اعمال کنید و ذخیره بزنید"
                : "عنوان را بنویسید، اسلاگ خودکار ساخته می‌شود"}
            </p>
          </div>
        </div>

        <div className={styles.grid}>
          <label className={styles.field}>
            <span className={styles.label}>عنوان</span>
            <input
              className={styles.input}
              placeholder="مثلاً برنامه‌نویسی وب"
              value={form.title}
              onChange={change("title")}
              required
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>اسلاگ (اختیاری)</span>
            <input
              className={styles.input}
              placeholder="web-development"
              value={form.slug}
              onChange={change("slug")}
              dir="ltr"
            />
          </label>

          <label className={`${styles.field} ${styles.full}`}>
            <span className={styles.label}>توضیح کوتاه (اختیاری)</span>
            <textarea
              className={styles.textarea}
              placeholder="این دسته‌بندی درباره چیست؟"
              maxLength={300}
              value={form.description}
              onChange={change("description")}
            />
          </label>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.actions}>
          <button
            type="submit"
            disabled={loading}
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            {loading ? "در حال ذخیره..." : editingId ? "ذخیره تغییرات" : "افزودن دسته‌بندی"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={reset}
              className={`${styles.btn} ${styles.btnGhost}`}
            >
              انصراف
            </button>
          )}
        </div>
      </form>

      {/* لیست */}
      <div className={styles.listHead}>
        <h2 className={styles.listTitle}>همه دسته‌بندی‌ها</h2>
        <span className={styles.count}>
          {categories.length.toLocaleString("fa-IR")} مورد
        </span>
      </div>

      {categories.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>{Icon.folder}</div>
          هنوز دسته‌بندی‌ای ثبت نشده.
          <br />
          از فرم بالا اولین دسته‌بندی را اضافه کنید.
        </div>
      ) : (
        <div className={styles.list}>
          {categories.map((c) => (
            <div
              key={c.id}
              className={styles.row}
              data-active={editingId === c.id ? "true" : "false"}
            >
              <div className={styles.avatar} style={{ background: colorOf(c.title) }}>
                {c.title.trim().charAt(0)}
              </div>

              <div className={styles.info}>
                <h3 className={styles.name}>{c.title}</h3>
                {c.description && <p className={styles.desc}>{c.description}</p>}
                <div className={styles.tags}>
                  <span className={styles.slug}>{c.slug}</span>
                  <span className={styles.date}>{c.createdAt}</span>
                </div>
              </div>

              <div className={styles.rowActions}>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => startEdit(c)}
                  aria-label="ویرایش"
                  title="ویرایش"
                >
                  {Icon.edit}
                </button>
                <button
                  type="button"
                  className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                  onClick={() => remove(c)}
                  aria-label="حذف"
                  title="حذف"
                >
                  {Icon.trash}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}