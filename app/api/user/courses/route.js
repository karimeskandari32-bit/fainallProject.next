import { NextResponse } from "next/server";
import connectToDB from "@/configs/db";
import User from "@/models/User";
import Course from "@/models/Course";
import { getCurrentUser } from "@/utils/auth";

export async function GET(req) {
  try {
    await connectToDB();

    const auth = await getCurrentUser(req);
    if (!auth?.success) {
      return NextResponse.json({ message: "وارد حساب خود شوید" }, { status: 401 });
    }

    const user = await User.findById(auth.userId)
      .populate({
        path: "purchaseCourses",
        model: Course,
        select: "title slug shortDescription thumbnail level studentsCount",
      })
      .lean();

    return NextResponse.json({ courses: user?.purchaseCourses || [] });
  } catch (err) {
    console.error("Error fetching purchased courses:", err);
    return NextResponse.json({ message: "خطای سرور" }, { status: 500 });
  }
}