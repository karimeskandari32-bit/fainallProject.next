import connectToDB from "@/configs/db";
import User from "@/models/User";
import { isAdmin } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectToDB();

    const auth=isAdmin(req)
    if(!auth.isAdmin){
      return auth
    }
    
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = searchParams.get("page") || 1;
    const limit = 5;

    const query = search
      ? {
          $or: [
            { name: { $regex: search } },
            { phone: { $regex: search } },
            { email: { $regex: search } },
          ],
        }
      : {};
    const users = await User.find(query)
    .select('_id name role phone email isVerified createdAt ')
    .skip((page-1)*limit)
    .limit(limit)
    .lean();

     const total = await User.countDocuments(query);
     
    return NextResponse.json({ success: true, users , total}, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}