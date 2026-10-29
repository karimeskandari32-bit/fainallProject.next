// app/api/payment/verify/route.js

import { NextResponse } from "next/server";
import connectToDB from "@/configs/db";
import Order from "@/models/Order";
import User from "@/models/User";
import Course from "@/models/Course";
import Discount from "@/models/Discount";

export async function POST(req) {
  try {
    await connectToDB();

    const { authority, status } = await req.json();

    if (!authority || !status) {
      return NextResponse.json(
        { success: false, message: "آتوریتی و استاتوس ضروری هست" },
        { status: 400 },
      );
    }

    const order = await Order.findOne({ authority });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "سفارش یافت نشد" },
        { status: 404 },
      );
    }

    // اگر قبلاً پرداخت شده باشد
    if (order.status === "paid") {
      return NextResponse.json({
        success: true,
        message: "پرداخت قبلا تایید شده",
        refId: order.refId,
      });
    }

    // کاربر پرداخت را لغو کرده
    if (status !== "OK") {
      await Order.updateOne(
        { _id: order._id, status: { $ne: "paid" } },
        { status: "failed" },
      );
      return NextResponse.json({ success: false, message: "پرداخت لغو شد" });
    }

    // مبلغ باید دقیقاً همان مبلغ تخفیف‌خورده‌ای باشد که به درگاه فرستاده شده
    const amount = order.totalPrice - (order.discountAmount || 0);

    // Verify Request
    const response = await fetch(
      "https://sandbox.zarinpal.com/pg/v4/payment/verify.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          merchant_id: process.env.ZARINPAL_MERCHANT_ID,
          amount,
          authority,
        }),
      },
    );

    const result = await response.json();
    const code = result.data?.code;

    if (code !== 100 && code !== 101) {
      await Order.updateOne(
        { _id: order._id, status: { $ne: "paid" } },
        { status: "failed" },
      );

      return NextResponse.json(
        { success: false, message: "تایید پرداخت ناموفق بود" },
        { status: 400 },
      );
    }

    // تغییر وضعیت اتمیک: فقط یک درخواست می‌تواند سفارش را paid کند
    const paidOrder = await Order.findOneAndUpdate(
      { _id: order._id, status: { $ne: "paid" } },
      {
        status: "paid",
        refId: String(result.data.ref_id),
        paidAt: new Date(),
      },
      { new: true },
    );

    // اگر درخواست دیگری زودتر تأیید کرده، دوباره کاری انجام نمی‌دهیم
    if (!paidOrder) {
      const current = await Order.findById(order._id);
      return NextResponse.json({
        success: true,
        message: "پرداخت قبلا تایید شده",
        refId: current?.refId,
      });
    }

    const purchasedCourses = paidOrder.items.map((item) => item.course);

    // اضافه کردن دوره‌ها به کاربر (بدون تکراری شدن)
    await User.findByIdAndUpdate(paidOrder.user, {
      $addToSet: { purchaseCourses: { $each: purchasedCourses } },
    });

    // افزایش تعداد دانشجوهای هر دوره
    await Course.updateMany(
      { _id: { $in: purchasedCourses } },
      { $inc: { studentsCount: 1 } },
    );

    // ثبت استفاده از کد تخفیف، فقط یک بار و با رعایت سقف
    if (paidOrder.discountCode) {
      await Discount.findOneAndUpdate(
        {
          code: paidOrder.discountCode,
          $or: [
            { maxUses: 0 },
            { $expr: { $lt: ["$usedCount", "$maxUses"] } },
          ],
        },
        { $inc: { usedCount: 1 } },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "خرید با موفقیت انجام شد",
        refId: paidOrder.refId,
      },
      { status: 200 },
    );
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      { success: false, message: "خطای داخلی سرور" },
      { status: 500 },
    );
  }
}