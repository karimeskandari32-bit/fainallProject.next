import { NextResponse } from "next/server";
import connectToDB from "@/configs/db";
import Comment from "@/models/Comment";
import { isAdmin } from "@/utils/auth";

export async function DELETE (req, { params }) {
  try {
    await connectToDB();

    //admin check ==========================
    const auth = isAdmin(req);
    if (!auth.isAdmin) {
      return auth;
    }

    const { id } = await params;

    const comment = await Comment.findByIdAndDelete(id);

    if (!comment) {
      return NextResponse.json(
        { success: false, message: "کامنت یافت نشد" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "کامنت با موفقیت حذف شد",
      },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "خطای سرور" },
      { status: 500 },
    );
  }
}