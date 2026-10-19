"use client";
import { useEffect, useState } from "react";
import styles from "./AuthPage.module.css";
import { IoMdArrowRoundBack } from "react-icons/io";
import OtpInputs from "@/components/featuers/auth/Otpinput";
import toast from "react-hot-toast";
import Loader from "@/components/shared/Loader";
import { useRouter } from "next/navigation";
import { useAuth } from "@/authContet/authContext";

const OTP_LENGTH = 5;
const RESEND_SECONDS = 120;

export default function AuthPage() {
  const [phone, setPhone] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const router = useRouter();

  const { setUser } = useAuth();

  // اعتبارسنجی شماره موبایل
  const isPhoneValid = (value) => /^09\d{9}$/.test(value);
  const isOtpComplete = otp.every((input) => input !== "");

  const handleSendOtp = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/sms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (data.success) {
        setIsCodeSent(true);
        setTimer(RESEND_SECONDS);
        toast.success("کد تایید با موفقیت ارسال شد");
      } else {
        toast.error("خطا در ارسال کد تایید");
      }
    } catch (err) {
      console.error(err);
      toast.error("خطا در ارسال کد تایید");
    } finally {
      setIsLoading(false);
    }
  };

  // برگشت به مرحله‌ی شماره؛ شماره پاک نمی‌شود تا کاربر بتواند فقط اصلاحش کند
  const handleBackToPhone = () => {
    setOtp(Array(OTP_LENGTH).fill(""));
    setIsCodeSent(false);
    setTimer(RESEND_SECONDS);
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/sms/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // مهم برای کوکی
        body: JSON.stringify({ phone, otpCode }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("با موفقیت وارد شدید");
        setUser(data.user);
        router.push(data.redirectTo);
      } else if (response.status === 401) {
        toast.error("کد تایید اشتباه است");
      } else if (response.status === 410) {
        toast.error("کد تایید منقضی شده");
      } else {
        toast.error("خطا در ورود");
      }
    } catch (err) {
      toast.error("خطای سرور، لطفا بعدا تلاش کنید");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await fetch("/api/auth/sms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("کد تایید با موفقیت ارسال شد");
        setOtp(Array(OTP_LENGTH).fill(""));
        setTimer(RESEND_SECONDS);
      } else {
        toast.error("خطا در ارسال کد تایید");
      }
    } catch (err) {
      console.error(err);
      toast.error("خطا در ارسال کد تایید");
    }
  };

  const demoInfo = (
    <div className={styles.demoBox}>
      <div className={styles.demoTitle}>لطفا با این اطلاعات وارد شوید</div>
      <div>
        شماره موبایل: <strong>09160260727</strong>
      </div>
      <div>
        رمز: <strong>12345</strong>
      </div>
    </div>
  );

  useEffect(() => {
    if (!isCodeSent || timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isCodeSent, timer]);

  return (
    <div className={styles.authWrapper}>
      <div className={styles.left}></div>

      <div className={styles.authForm}>
        {!isCodeSent && (
          <>
            {demoInfo}

            <h3>ورود | ثبت نام</h3>
            <p>لطفا شماره موبایل خود را وارد کنید</p>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={11}
              placeholder="شماره موبایل"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {isLoading ? (
              <Loader />
            ) : (
              <button
                onClick={handleSendOtp}
                disabled={!isPhoneValid(phone)} // فقط با شماره‌ی معتبر فعال می‌شود
              >
                ورود
              </button>
            )}
          </>
        )}

        {isCodeSent && (
          <>
            <h2>نکست وان کد</h2>
            <div className={styles.gotoBack} onClick={handleBackToPhone}>
              <IoMdArrowRoundBack size={"20px"} />
            </div>
            <p>کد تایید برای شماره {phone} ارسال شد</p>
            <h3>کد تایید را وارد کنید</h3>
            <OtpInputs otp={otp} setOtp={setOtp} />
            {isLoading ? (
              <Loader />
            ) : (
              <button
                onClick={handleVerifyOtp}
                disabled={!isOtpComplete} // فقط با OTP کامل فعال می‌شود
              >
                تأیید و ورود
              </button>
            )}
            <div className={styles.resendOtp}>
              {timer > 0 ? (
                <p className={styles.timer}>
                  ارسال مجدد کد تا {timer} ثانیه دیگر
                </p>
              ) : (
                <p className={styles.resend} onClick={handleResendOtp}>
                  دریافت مجدد کد تایید
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}