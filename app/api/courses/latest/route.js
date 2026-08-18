import { NextResponse } from "next/server";
import connectToDB from "@/configs/db";
import Course from "@/models/Course";

export async function GET(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit")) || 4;

    const courses = await Course.find({ status: "published" })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select(
        "title slug shortDescription thumbnail price discountPrice isFree level studentsCount",
      )
      .lean();

    return NextResponse.json({ courses });
  } catch (err) {
    console.error("Error fetching latest courses:", err);
    return NextResponse.json({ message: "خطای سرور" }, { status: 500 });
  }
}