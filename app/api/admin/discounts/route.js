import conectToDB from "@/configs/db";
import Discount from "@/models/Discount";
import { parseDiscountBody, expiryFromDays } from "@/lib/discountInput";
import { isAdmin } from "@/utils/auth"; // مسیر واقعی فایل isAdmin

export async function POST(req) {
  // 1.admin check ==========================
  const auth = isAdmin(req);
  if (!auth.isAdmin) {
    return auth;
  }

  const body = await req.json().catch(() => ({}));
  const parsed = parseDiscountBody(body);
  if (parsed.error) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  const { data, validDays, noExpiry } = parsed;
  const expiresAt = !noExpiry && validDays > 0 ? expiryFromDays(validDays) : null;

  await conectToDB();
  try {
    const discount = await Discount.create({ ...data, expiresAt });
    return Response.json({ discount }, { status: 201 });
  } catch (e) {
    if (e?.code === 11000) {
      return Response.json({ error: "این کد تخفیف قبلاً ثبت شده" }, { status: 409 });
    }
    return Response.json({ error: "خطای سرور" }, { status: 500 });
  }
}