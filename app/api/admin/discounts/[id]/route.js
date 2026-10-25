import conectToDB from "@/configs/db";
import Discount from "@/models/Discount";
import { parseDiscountBody, expiryFromDays } from "@/lib/discountInput";
import { isAdmin } from "@/utils/auth"; // مسیر واقعی فایل isAdmin

export async function PATCH(req, { params }) {
  // 1.admin check ==========================
  const auth = isAdmin(req);
  if (!auth.isAdmin) {
    return auth;
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  await conectToDB();

  // فعال/غیرفعال کردن سریع
  if (body.action === "toggle") {
    const current = await Discount.findById(id);
    if (!current) {
      return Response.json({ error: "تخفیف پیدا نشد" }, { status: 404 });
    }
    current.isActive = !current.isActive;
    await current.save();
    return Response.json({ discount: current });
  }

  const parsed = parseDiscountBody(body);
  if (parsed.error) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  const { data, validDays, noExpiry } = parsed;
  const update = { ...data };
  if (noExpiry) update.expiresAt = null;
  else if (validDays > 0) update.expiresAt = expiryFromDays(validDays);
  // در غیر این صورت تاریخ انقضای قبلی بدون تغییر می‌ماند

  try {
    const discount = await Discount.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    if (!discount) {
      return Response.json({ error: "تخفیف پیدا نشد" }, { status: 404 });
    }
    return Response.json({ discount });
  } catch (e) {
    if (e?.code === 11000) {
      return Response.json({ error: "این کد تخفیف قبلاً ثبت شده" }, { status: 409 });
    }
    return Response.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  // 1.admin check ==========================
  const auth = isAdmin(req);
  if (!auth.isAdmin) {
    return auth;
  }

  const { id } = await params;
  await conectToDB();
  const deleted = await Discount.findByIdAndDelete(id);
  if (!deleted) {
    return Response.json({ error: "تخفیف پیدا نشد" }, { status: 404 });
  }
  return Response.json({ ok: true });
}