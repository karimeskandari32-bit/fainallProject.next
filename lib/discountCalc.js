import Discount from "@/models/Discount";

export async function calcDiscount(code, order) {
  const clean = String(code ?? "").trim().toUpperCase();
  if (!clean) return { error: "کد تخفیف را وارد کنید" };

  const discount = await Discount.findOne({ code: clean });
  if (!discount || !discount.isActive) {
    return { error: "کد تخفیف معتبر نیست" };
  }
  if (discount.expiresAt && discount.expiresAt < new Date()) {
    return { error: "این کد تخفیف منقضی شده" };
  }
  if (discount.maxUses > 0 && discount.usedCount >= discount.maxUses) {
    return { error: "ظرفیت این کد تخفیف تمام شده" };
  }

  // مبنای محاسبه: کل سفارش، یا فقط دوره‌ی مخصوص این کد
  let base = order.totalPrice;
  if (discount.course) {
    const item = (order.items ?? []).find(
      (i) => String(i.course) === String(discount.course)
    );
    if (!item) {
      return { error: "این کد برای دوره‌های سفارش شما نیست" };
    }
    base = item.price;
  }

  let discountAmount =
    discount.type === "percent"
      ? Math.floor((base * discount.value) / 100)
      : discount.value;
  discountAmount = Math.min(discountAmount, base);

  return {
    discount,
    discountAmount,
    finalPrice: order.totalPrice - discountAmount,
  };
}