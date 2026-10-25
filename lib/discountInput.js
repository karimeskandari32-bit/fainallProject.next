import mongoose from "mongoose";

export function parseDiscountBody(body) {
  const code = String(body.code ?? "").trim().toUpperCase();
  if (!/^[A-Z0-9_-]{3,20}$/.test(code)) {
    return { error: "کد باید ۳ تا ۲۰ کاراکتر انگلیسی، عدد، خط تیره یا آندرلاین باشد" };
  }

  const type = body.type === "fixed" ? "fixed" : "percent";
  const value = Number(body.value);
  if (!Number.isFinite(value) || value <= 0) {
    return { error: "مقدار تخفیف را درست وارد کنید" };
  }
  if (type === "percent" && value > 100) {
    return { error: "درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد" };
  }

  const maxUses = Math.max(0, Math.floor(Number(body.maxUses) || 0));
  const validDays = Math.max(0, Math.floor(Number(body.validDays) || 0));
  const noExpiry = Boolean(body.noExpiry);

  let course = null;
  if (body.course) {
    if (!mongoose.isValidObjectId(body.course)) return { error: "دوره نامعتبر است" };
    course = body.course;
  }

  return {
    data: { code, type, value, maxUses, course, isActive: body.isActive !== false },
    validDays,
    noExpiry,
  };
}

export const expiryFromDays = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);