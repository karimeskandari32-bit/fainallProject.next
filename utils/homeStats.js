import connectToDB from "@/configs/db";
import Course from "@/models/Course";
import User from "@/models/User";
import Order from "@/models/Order";

export async function getHomeStats() {
  try {
    await connectToDB();

    const [courses, students, soldCourses] = await Promise.all([
      Course.countDocuments({ status: "published" }),
      User.countDocuments({}),
      Order.countDocuments({ status: "paid" }),
    ]);

    return { courses, students, soldCourses };
  } catch (err) {
    console.error("Error fetching home stats:", err);
    return { courses: 0, students: 0, soldCourses: 0 };
  }
}