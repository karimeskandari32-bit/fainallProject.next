import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import conectToDB from "@/configs/db";
import User from "@/models/User";

export async function POST(params){
    const cookieStote=await cookies()
    try{
        const refreshToken=cookieStote.get('refreshToken')?.value
        if(!refreshToken){
            return NextResponse.json({
                success:false,message:"refresh token not found"
            },{status:401},)
        }

        let payload;
        try{
            payload=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_CECRET)


        }catch(error){
            cookieStote.delete("refreshToken" , {path:"/"})
            cookieStote.delete("accessToken" , {path:"/"})
            return NextResponse.json(
                {success:false, message:"invalid refresh token"},
                {status:401}

            )

        }

        await conectToDB()
        const user = await User.findById(payload.userId)
        if(!user){
             cookieStote.delete("refreshToken" , {path:"/"})
            cookieStote.delete("accessToken" , {path:"/"})
            return NextResponse.json(
                {success:false, message:"user not found"},
                {status:404}

            )

        }

        const newAccessToken = jwt.sign(
            {
                userId:user._id,
                phone:user.phone,
                role:user.role,
            },
             process.env.ACCESS_TOKEN_SECRET,
        {expiresIn :"15m"},
        )

        const response = NextResponse.json(
           {
             success:true,
             message:"accesstoken refresh successfully",

             user:{
                id:user._id.toString(),
                phone:user.phone,
                role:user.role || "user,"

             }
           }
        )

        response.cookies.set("accessToken" , newAccessToken,{
            httpOnly:true,
            secure:process.env.MODE_ENV === "production",
              sameSite:"strict",
              maxAge:15*60 , 
              params:"/"
        })

        return response

    }catch(error){
        cookieStote.delete("refreshToken" , {path:"/"})
            cookieStote.delete("accessToken" , {path:"/"})
            return NextResponse.json(
                {success:false, message:"server error"},
                {status:500}

            )

    }

}