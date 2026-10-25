"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Discount.module.css";

const fa = (n) => Number(n).toLocaleString("fa-IR");

const emptyForm = {
  code: "",
  type: "percent",
  value: "",
  maxUses: "",
  validDays: "",
  noExpiry: false,
  course: "",
  isActive: true,
};

const statusFa = {
  active: "فعال",
  inactive: "غیرفعال",
  expired: "منقضی",
  exhausted: "تمام‌شده",
};

function randomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
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
  ticket: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9a2 2 0 002-2h14a2 2 0 002 2v1.5a1.5 1.5 0 000 3V15a2 2 0 00-2 2H5a2 2 0 00-2-2v-1.5a1.5 1.5 0 000-3V9z" />
      <path d="M13 7v10" strokeDasharray="2 2.5" />
    </svg>
  ),
};

export default function DiscountsManager({ discounts, courses }) {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const change = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  function startEdit(d) {
    setEditingId(d.id);
    setForm({
      code: d.code,
      type: d.type,
      value: String(d.value),
      maxUses: d.maxUses ? String(d.maxUses) : "",
      validDays: "",
      noExpiry: !d.hasExpiry,
      course: d.courseId || "",
      isActive: d.isActive,
    });
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
        editingId ? `/api/admin/discounts/${editingId}` : "/api/admin/discounts",
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

  async function toggle(d) {
    const res = await fetch(`/api/admin/discounts/${d.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle" }),
    });
    if (res.ok) router.refresh();
  }

  async function remove(d) {
    if (!window.confirm(`کد «${d.code}» حذف شود؟`)) return;
    setError("");
    const res = await fetch(`/api/discounts/${d.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || data.message || "خطا در حذف");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (editingId === d.id) reset();
    router.refresh();
  }

  async function copy(code) {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied(""), 1500);
    } catch {}
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
          <div className={styles.cardIcon}>{editingId ? Icon.edit : Icon.plus}</div>
          <div>
            <h2 className={styles.cardTitle}>
              {editingId ? "ویرایش کد تخفیف" : "کد تخفیف جدید"}
            </h2>
            <p className={styles.cardHint}>
              {editingId
                ? "تغییرات را اعمال کنید و ذخیره بزنید"
                : "کد را بنویسید یا از دکمه «ساخت خودکار» استفاده کنید"}
            </p>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.field}>
            <span className={styles.label}>کد تخفیف</span>
            <div className={styles.codeRow}>
              <input
                className={`${styles.input} ${styles.ltr}`}
                placeholder="SALE2026"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                maxLength={20}
                required
              />
              <button
                type="button"
                className={styles.smallBtn}
                onClick={() => setForm({ ...form, code: randomCode() })}
              >
                ساخت خودکار
              </button>
            </div>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>نوع تخفیف</span>
            <div className={styles.segment}>
              <button
                type="button"
                className={styles.segBtn}
                data-on={form.type === "percent"}
                onClick={() => setForm({ ...form, type: "percent" })}
              >
                درصدی
              </button>
              <button
                type="button"
                className={styles.segBtn}
                data-on={form.type === "fixed"}
                onClick={() => setForm({ ...form, type: "fixed" })}
              >
                مبلغ ثابت
              </button>
            </div>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>
              {form.type === "percent" ? "درصد تخفیف (۱ تا ۱۰۰)" : "مبلغ تخفیف (تومان)"}
            </span>
            <input
              className={`${styles.input} ${styles.ltr}`}
              type="number"
              min="1"
              max={form.type === "percent" ? 100 : undefined}
              placeholder={form.type === "percent" ? "20" : "50000"}
              value={form.value}
              onChange={change("value")}
              required
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>تعداد دفعات مجاز (خالی = نامحدود)</span>
            <input
              className={`${styles.input} ${styles.ltr}`}
              type="number"
              min="0"
              placeholder="100"
              value={form.maxUses}
              onChange={change("maxUses")}
            />
          </label>

          <div className={styles.field}>
            <span className={styles.label}>
              مدت اعتبار (روز از همین الان)
              {editingId && " — خالی = بدون تغییر"}
            </span>
            <input
              className={`${styles.input} ${styles.ltr}`}
              type="number"
              min="1"
              placeholder="30"
              value={form.validDays}
              onChange={change("validDays")}
              disabled={form.noExpiry}
            />
            <label className={styles.check}>
              <input
                type="checkbox"
                checked={form.noExpiry}
                onChange={(e) => setForm({ ...form, noExpiry: e.target.checked })}
              />
              بدون تاریخ انقضا
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>مخصوص دوره</span>
            <select
              className={styles.select}
              value={form.course}
              onChange={change("course")}
            >
              <option value="">همه دوره‌ها</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.actions}>
          <button
            type="submit"
            disabled={loading}
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            {loading ? "در حال ذخیره..." : editingId ? "ذخیره تغییرات" : "افزودن کد تخفیف"}
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
        <h2 className={styles.listTitle}>همه کدهای تخفیف</h2>
        <span className={styles.count}>{fa(discounts.length)} مورد</span>
      </div>

      {discounts.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>{Icon.ticket}</div>
          هنوز کد تخفیفی ثبت نشده.
          <br />
          از فرم بالا اولین کد را بسازید.
        </div>
      ) : (
        <div className={styles.list}>
          {discounts.map((d) => {
            const pct =
              d.maxUses > 0 ? Math.min(100, Math.round((d.usedCount / d.maxUses) * 100)) : 0;
            return (
              <div
                key={d.id}
                className={styles.row}
                data-active={editingId === d.id ? "true" : "false"}
                data-dim={d.status !== "active" ? "true" : "false"}
              >
                <div className={styles.valueBox}>
                  {d.type === "percent" ? (
                    <>
                      <span className={styles.valueBig}>{fa(d.value)}٪</span>
                      <span className={styles.valueSmall}>تخفیف</span>
                    </>
                  ) : (
                    <>
                      <span className={styles.valueBig}>{fa(d.value)}</span>
                      <span className={styles.valueSmall}>تومان</span>
                    </>
                  )}
                </div>

                <div className={styles.main}>
                  <div className={styles.top}>
                    <span className={styles.code}>{d.code}</span>
                    <button
                      type="button"
                      className={styles.copy}
                      onClick={() => copy(d.code)}
                    >
                      {copied === d.code ? "کپی شد ✓" : "کپی"}
                    </button>
                    <span className={styles.badge} data-status={d.status}>
                      {statusFa[d.status]}
                    </span>
                  </div>

                  <div className={styles.meta}>
                    <span>
                      دوره: <b>{d.courseTitle || "همه دوره‌ها"}</b>
                    </span>
                    <span>
                      انقضا: <b>{d.hasExpiry ? d.expiresAt : "بدون انقضا"}</b>
                    </span>
                    <span>
                      ساخته‌شده: <b>{d.createdAt}</b>
                    </span>
                  </div>

                  <div className={styles.usage}>
                    {d.maxUses > 0 ? (
                      <>
                        <div className={styles.bar}>
                          <div className={styles.barFill} style={{ width: `${pct}%` }} />
                        </div>
                        <span>
                          {fa(d.usedCount)} از {fa(d.maxUses)} استفاده
                        </span>
                      </>
                    ) : (
                      <span>{fa(d.usedCount)} بار استفاده شده (نامحدود)</span>
                    )}
                  </div>
                </div>

                <div className={styles.rowActions}>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={d.isActive}
                    aria-label="فعال/غیرفعال"
                    title={d.isActive ? "غیرفعال کردن" : "فعال کردن"}
                    className={styles.switch}
                    onClick={() => toggle(d)}
                  />
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => startEdit(d)}
                    aria-label="ویرایش"
                    title="ویرایش"
                  >
                    {Icon.edit}
                  </button>
                  <button
                    type="button"
                    className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                    onClick={() => remove(d)}
                    aria-label="حذف"
                    title="حذف"
                  >
                    {Icon.trash}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}