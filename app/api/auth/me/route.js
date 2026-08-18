import conectToDB from "@/configs/db";
import User from "@/models/User";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"

export async function GET(){
    try{
        await conectToDB()

        const cookieStore = await cookies()
        const accessToken = cookieStore.get("accessToken")?.value;

        if(!accessToken){
            return NextResponse.json({
                success:false,message:"please log in to your eccont"
            },
        {status:401},)
        }

        let payload;
        try{
            payload = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)

        }catch(err){
            return NextResponse.json({
                success:false,message:"TOKEN EXPIRED OR INVALID"
            },{status:401},)

        }

        const user = await User.findById(payload.userId)
        .select("name phone email role purchaseCourses createdAt")
        // .populate("purchaseCourses" , "title")
        .lean()

        if(!user){
            return NextResponse.json({
                success:false,message:"user not found"
            },{status:404},)
        }

        return NextResponse.json({success:true , user})



    }catch(err){
        console.log(err.message)

        return NextResponse.json({
            success:false, message:"server error"
        },{status:500},)

    }

}