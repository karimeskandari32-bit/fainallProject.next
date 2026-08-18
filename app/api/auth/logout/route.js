import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import connectToDB from "@/configs/db";
import User from "@/models/User";

export async function POST() {
  try {
    const cookieStore = await cookies();

    const refreshToken = cookieStore.get("refreshToken")?.value;

    let userId = null;

    if (refreshToken) {
      try {
        const payload = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_CECRET,
        );
        userId = payload.userId;
       
      } catch (err) {
        // توکن نامعتبر یا منقضی → مشکلی نیست، فقط کوکی را پاک می‌کنیم
        console.log("Refresh token invalid during logout:", err.message);
      }
    }

    if (userId) {
      await connectToDB().catch(() => {});

      await User.findByIdAndUpdate(userId, {
        $unset: { refreshToken: "" },
      }).catch((err) => {
        console.log("Failed to unset refreshToken in DB:", err.message);
      });
    }

    const response = NextResponse.json(
      { success: true, message: "logout successfully" },
      { status: 200 },
    );

    const cookieOptions = {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    };
    response.cookies.delete("accessToken", cookieOptions);
    response.cookies.delete("refreshToken", cookieOptions);
    return response;
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "error ! try again" },
      { status: 500 },
    );
  }
}