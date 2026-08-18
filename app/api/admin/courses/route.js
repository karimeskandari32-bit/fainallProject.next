import { NextResponse } from "next/server";
import connectToDB from "@/configs/db";
import Course from "@/models/Course";
import { isAdmin } from "@/utils/auth";

export async function GET(req) {
  try {
    await connectToDB();
    // 1.admin check ==========================
    const auth = isAdmin(req);
    if (!auth.isAdmin) {
      return auth;
    }

     const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const query = search ? { title : { $regex: search } } : {};

    // 2.get courses ==========================
    const courses = await Course.find(query);
    return NextResponse.json({ success: true, courses });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "server error" },
      { status: 500 },
    );
  }
}