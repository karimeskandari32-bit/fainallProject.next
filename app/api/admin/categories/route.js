import conectToDB from "@/configs/db";
import Category from "@/models/Category";
import { slugify } from "@/lib/slugify";
import { isAdmin } from "@/utils/auth"; // مسیر واقعی فایل isAdmin

// لیست دسته‌بندی‌ها عمومی است (برای فیلتر دوره‌ها در سایت)
export async function GET() {
  await conectToDB();
  const categories = await Category.find().sort({ createdAt: -1 }).lean();
  return Response.json({ categories });
}

export async function POST(req) {
  // 1.admin check ==========================
  const auth = isAdmin(req);
  if (!auth.isAdmin) {
    return auth;
  }

  const body = await req.json().catch(() => ({}));
  const title = String(body.title ?? "").trim();
  const description = String(body.description ?? "").trim().slice(0, 300);

  if (title.length < 2) {
    return Response.json({ error: "عنوان دسته‌بندی را وارد کنید" }, { status: 400 });
  }

  const slug = slugify(body.slug || title);
  if (!slug) {
    return Response.json({ error: "اسلاگ معتبر نیست" }, { status: 400 });
  }

  await conectToDB();
  try {
    const category = await Category.create({ title, slug, description });
    return Response.json({ category }, { status: 201 });
  } catch (e) {
    if (e?.code === 11000) {
      return Response.json({ error: "این عنوان یا اسلاگ قبلاً ثبت شده" }, { status: 409 });
    }
    return Response.json({ error: "خطای سرور" }, { status: 500 });
  }
}