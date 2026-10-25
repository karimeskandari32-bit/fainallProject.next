import conectToDB from "@/configs/db";
import Category from "@/models/Category";
import Course from "@/models/Course";
import { slugify } from "@/lib/slugify";
import { isAdmin } from "@/utils/auth"; // مسیر واقعی فایل isAdmin

export async function PATCH(req, { params }) {
  // 1.admin check ==========================
  const auth = isAdmin(req);
  if (!auth.isAdmin) {
    return auth;
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const title = String(body.title ?? "").trim();
  const description = String(body.description ?? "").trim().slice(0, 300);

  if (title.length < 2) {
    return Response.json({ error: "عنوان دسته‌بندی را وارد کنید" }, { status: 400 });
  }

  await conectToDB();
  try {
    const category = await Category.findByIdAndUpdate(
      id,
      { title, description, slug: slugify(body.slug || title) },
      { new: true, runValidators: true }
    );
    if (!category) {
      return Response.json({ error: "دسته‌بندی پیدا نشد" }, { status: 404 });
    }
    return Response.json({ category });
  } catch (e) {
    if (e?.code === 11000) {
      return Response.json({ error: "این عنوان یا اسلاگ قبلاً ثبت شده" }, { status: 409 });
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

  const used = await Course.countDocuments({ category: id });
  if (used > 0) {
    return Response.json(
      { error: `${used} دوره از این دسته‌بندی استفاده می‌کنند` },
      { status: 409 }
    );
  }

  const deleted = await Category.findByIdAndDelete(id);
  if (!deleted) {
    return Response.json({ error: "دسته‌بندی پیدا نشد" }, { status: 404 });
  }
  return Response.json({ ok: true });
}