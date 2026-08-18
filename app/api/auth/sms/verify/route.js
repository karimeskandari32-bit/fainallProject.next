import conectToDB from "@/configs/db"
import User from "@/models/User"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"



export async function POST(req){
    try{
        const {phone , otpCode}= await req.json()
        if(!phone || !otpCode){
            return NextResponse.json(
                {success:false,message:"phone or otpcode is required"},
                {statuse:400},
            )
        }
        await conectToDB()

        const user= await User.findOne({phone}).select(
            "name phone email role purchaseCourses otp _id "
        )
        if(!user){
            return NextResponse.json(
                {success:false,message:"user not found"},
                {status:404},
            )
        }

        const {otp}= user
        if(!otp || otp.code !== otpCode){
            return NextResponse.json(
                {success:false,message:"invalid otp code"},
                {status:401},
            )
        }

       const currentTime = new Date().getTime()
       const isExpired = currentTime > otp.expiresAt
       if(isExpired){
        user.otp = null
        await user.save()

        return NextResponse.json(
            {success:false,message:"otp codeis expired"},
            {status:410}
        )
       }

       const accessPayload = {
        userId :user._id.toString(),
        phone :user.phone,
        role :user.role,

       }

       const accessToken = jwt.sign(
        accessPayload,
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn :"30m"},

       )
       const refreshToken = jwt.sign(
        accessPayload,
        process.env.REFRESH_TOKEN_CECRET,
        {expiresIn :"7d"},

       )

       user.refreshToken = refreshToken
       user.otp = null
       user.isVerified = true
       user.lastLoginAt = new Date()

       await user.save()

      const cookieStote = await cookies()
      cookieStote.set("accessToken" , accessToken,{
        httpOnly:true,
        maxAge:30*60 , 
        sameSite:"strict",
        secure:process.env.MODE_ENV === "production",
        path:"/",
      }) 
     
      cookieStote.set("refreshToken" , refreshToken,{
        httpOnly:true,
        maxAge:7*24*60*60 , 
        sameSite:"strict",
        secure:process.env.MODE_ENV === "production",
        path:"/",
      })
      
      return NextResponse.json(
        {
        success:true,
        message:"otp code is accepted",
        redirectTo: user.role === "admin" ? "/admin/dashboard" : "/profile",
        user :{
            id :user._id.toString(),
            phone:user.phone,
            name:user.name || "" ,
            role:user.role,
            purchaseCourses:user.purchaseCourses || [],

        },
        },
        {status:200},
      )


    }catch(err){
        console.error("error verifying otp" , err)
        return NextResponse.json({
            success:false, message:"server error"
        },
    {status:500},
)

    }

}