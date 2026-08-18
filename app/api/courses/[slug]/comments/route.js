import { NextResponse } from "next/server";
import connectToDB from "@/configs/db";
import Comment from "@/models/Comment"; // مدل کامنت
import Course from "@/models/Course"; // مدل دوره
import User from "@/models/User"

export async function GET(req , { params }) {
  try {
    await connectToDB();

    const { slug } = await params;

    const course = await Course.findOne({ slug });

    if (!course) {
      return NextResponse.json(
        { success: false, message: "course not found" },
        { status: 404 },
      );
    }

    const comments = await Comment.find({
      course: course._id,
      isApproved: true,
    })
      .populate("user" , "name")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      comments,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "server error" },
      { status: 500 },
    );
  }
}