import connectToDB from "@/configs/db";
import User from "@/models/User";
import { isAdmin } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    await connectToDB();

    const auth = isAdmin(req);
    if (!auth.isAdmin) {
      return auth;
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "userId is required" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const { name, email, role } = body;

    // validation

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "user not found" },
        { status: 404 },
      );
    }

    if (name !== undefined) user.name = name.trim() || "";
    if (email !== undefined) user.email = email.trim() || null;
    if (role !== undefined) user.role = role;

    await user.save();

    const updatedUser = await User.findById(id).select("name role phone email");
    return NextResponse.json({
      success: true,
      message: "user updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "server error" },
      { status: 500 },
    );
  }
}

// /api/admin/users/[id]