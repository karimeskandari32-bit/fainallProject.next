import connectToDB from "@/configs/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

const validatePhoneNumber = (phone) => /^09\d{9}$/.test(phone);

export async function POST(req) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json({ success: false, message: "Phone number is required" }, { status: 400 });
    }

    if (!validatePhoneNumber(phone)) {
      return NextResponse.json({ success: false, message: "Invalid phone number format" }, { status: 400 });
    }

    await connectToDB();


    const isDemo =
      process.env.DEMO_LOGIN_ENABLED === "true" && phone === process.env.DEMO_PHONE;

    if (isDemo) {
      const expiresAt = new Date(Date.now() + 120 * 1000);
      const otp = { code: process.env.DEMO_OTP, expiresAt };

      const demoUser = await User.findOne({ phone });
      if (demoUser) {
        demoUser.otp = otp;
        await demoUser.save();
      } else {
        await User.create({ phone, otp });
      }

      return NextResponse.json(
        { success: true, message: "OTP sent successfully" },
        { status: 200 }
      );
    }
    // ---------- پایان حالت دمو ----------



//     const user = await User.findOne({ phone });
//     if (user && user.otp.expiresAt > new Date()) {
//       return NextResponse.json(
//         { success: false, message: "OTP already sent. Please wait." },
//         { status: 429 }
//       );
//     }

// const otpCode = Math.floor(10000 + Math.random() * 90000);
// const expiresAt = new Date(Date.now() + 120 * 1000);

// const smsRes = await fetch("https://api.iranpayamak.com/ws/v1/sms/pattern", {
//   method: "POST",
//   headers: {
//     "Api-Key": process.env.FARAZSMS_API_KEY,
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     code: process.env.FARAZSMS_PATTERN_CODE,
//     attributes: { code: String(otpCode) },  
//     recipient: phone,                      
//     line_number: process.env.FARAZSMS_FROM_NUMBER,
//     number_format: "english",
//   }),
// });

// const smsResult = await smsRes.json();
// console.log("SMS response:", smsRes.status, smsResult);

// if (!smsRes.ok) {
//   return NextResponse.json(
//     { success: false, message: "SMS sending failed" },
//     { status: 502 }
//   );
// }

// 
// if (user) {
//   user.otp = { code: otpCode, expiresAt };
//   await user.save();
// } else {
//   await User.create({ phone, otp: { code: otpCode, expiresAt } });
// }  
//  return NextResponse.json(
//       { success: true, message: "OTP sent successfully" },
//       { status: 200 }
//     );

  } catch (err) {
    console.error("Error sending OTP:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
