const TZ = "Asia/Tehran";

const partsFmt = new Intl.DateTimeFormat("fa-IR-u-ca-persian-nu-latn", {
  timeZone: TZ,
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

export const jalaliMonths = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
];

export function toJalaliParts(date) {
  const parts = partsFmt.formatToParts(new Date(date));
  const get = (type) => Number(parts.find((p) => p.type === type).value);
  return { year: get("year"), month: get("month"), day: get("day") };
}

const keyOf = (year, month) => `${year}-${String(month).padStart(2, "0")}`;

export function jalaliMonthKey(date) {
  const { year, month } = toJalaliParts(date);
  return keyOf(year, month);
}

export function jalaliMonthLabel(key) {
  const [y, m] = key.split("-").map(Number);
  return `${jalaliMonths[m - 1]} ${y.toLocaleString("fa-IR", { useGrouping: false })}`;
}

// کلید n ماه شمسی اخیر (قدیمی به جدید)
export function lastJalaliMonthKeys(n = 12) {
  let { year, month } = toJalaliParts(new Date());
  const keys = [];
  for (let i = 0; i < n; i++) {
    keys.unshift(keyOf(year, month));
    month--;
    if (month === 0) {
      month = 12;
      year--;
    }
  }
  return keys;
}

// جمع/شمارش اسناد بر اساس ماه شمسی
export function groupByJalaliMonth(docs, valueOf = () => 1, months = 12, dateField = "createdAt") {
  const keys = lastJalaliMonthKeys(months);
  const totals = new Map(keys.map((k) => [k, 0]));
  for (const d of docs) {
    const k = jalaliMonthKey(d[dateField]);
    if (totals.has(k)) totals.set(k, totals.get(k) + valueOf(d));
  }
  return keys.map((k) => ({ name: jalaliMonthLabel(k), value: totals.get(k) }));
}

// برای نمایش تاریخ کامل، مثلاً «۳ آبان ۱۴۰۵»
export function formatJalali(date, options = { dateStyle: "long" }) {
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", { timeZone: TZ, ...options }).format(new Date(date));
}