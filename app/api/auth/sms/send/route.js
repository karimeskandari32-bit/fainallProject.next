import conectToDB from "@/configs/db"
import User from "@/models/User"
import { NextResponse } from "next/server"
const validatePhoneNumber = (phone)=> /^09\d{9}$/.test(phone)

export async function POST(req){
    try{
        const {phone} =await req.json()
        if(!phone){
            return NextResponse.json(
                {success:false, message:"phone number is required"},
                {status:400},
            )
        }

        if(!validatePhoneNumber(phone)){
            return NextResponse.json(
                {success:false, message:"invalid phone number format"},
                {status:400}
            )
        }

        await conectToDB()
        const user = await User.findOne({phone})
        if(user && user.otp.expiresAt > new Date()){
            return NextResponse.json(
                {success:false,message:"otp already sent,please wite befor requesting agin"}
                ,{status:429},
            )

        }

        const otpCode = Math.floor(Math.random()*9000)+10000
        const expiresAt = new Date().getTime()+120*1000


         const res= await fetch('https://ippanel.com/api/select' , 
            {method:'POST' ,
            body:JSON.stringify({
                op :"pattern",
                user:process.env.IPPANEL_USER,
                pass:process.env.IPPANEL_PASS,
                fromNum:process.env.IPPANEL_FROM,
                toNum:phone,
                patternCode:process.env.IPPANEL_PATTERN,
                inputData:[
                    {
                        "code":otpCode,
                    }
                ],

            }),
            headers:{"Content-Type": "application/json"},
            }
        )
        if(res.status == 200){
            if(user){
                user.otp.code = otpCode
                user.otp.expiresAt = new Date(expiresAt)
                await user.save()

            }else{
                await User.create({
                    phone,
                    otp:{code:otpCode , expiresAt:new Date(expiresAt)},
                })
            }
            return NextResponse.json(
                {success:true, message:"otp sent successfully"},
                {status:200}
            )
        }else{
            return NextResponse.json(
                {success:false, message:"failed to send otp"},
                {status:500},
            )
        }
    }catch(error){
        console.log(error)
        return NextResponse.json(
            {success:false , message:"server error"},
            {status:500},
        )

    }
}