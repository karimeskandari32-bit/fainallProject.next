import { NextResponse } from "next/server";
import connectToDB from "@/configs/db";
import Course from "@/models/Course";

export async function GET() {
  try {
    await connectToDB();

    const courses = await Course.find({ status: "published" })
      .sort({ createdAt: -1 })
      .select(
        "title slug shortDescription thumbnail price discountPrice isFree level studentsCount",
      )
      .lean();

    return NextResponse.json({ courses });
  } catch (err) {
    console.error("Error fetching courses:", err);
    return NextResponse.json({ message: "خطای سرور" }, { status: 500 });
  }
}