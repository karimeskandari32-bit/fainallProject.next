"use client";
import { useEffect, useState } from "react";
import styles from "./AuthPage.module.css";
import { IoMdArrowRoundBack } from "react-icons/io";
import OtpInputs from "@/components/featuers/auth/Otpinput";
import toast from "react-hot-toast";
import Loader from "@/components/shared/Loader";
import { useRouter } from "next/navigation";
import { useAuth } from "@/authContet/authContext";


export default function AuthPage(){
    
    const [phone, setPhone] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(120);
  const[isResendDisabled,setIsResendDisabled]=useState(true)
  const [otp, setOtp] = useState(['','','','','']);
  const router = useRouter()

  const {setUser}=useAuth()

  // اعتبارسنجی شماره موبایل
  const isPhoneValid = (phone) => /^09\d{9}$/.test(phone);
  const isOtpComplete = otp.every(input => input !== '')

  const handleSendOtp = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/sms/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json()
      
      if(data.success){
        setIsCodeSent(true)
        toast.success('کد تایید با موفقیت ارسال شد')
      }else{
        toast.error('خطا در ارسال کد تایید')
      }
      
    } catch (err) {
        console.error(err);
        toast.error('خطا در ارسال کد تایید')
    }
    finally{
        setIsLoading(false)
    }
  };

  const handleBackToPhone = () => {
    setOtp(['','','','',''])
    setIsCodeSent(false)
    setTimer(120)
    setPhone('')
  };

   const handleVerifyOtp = async () => {
    const otpCode = otp.join("");
    try {
      setIsLoading(true)
      const response = await fetch("/api/auth/sms/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // مهم برای کوکی
        body: JSON.stringify({ phone, otpCode }),
      });

      const data = await response.json();

      
      if(data.success){
        toast.success('با موفقیت وارد شدید')
        setUser(data.user)
      router.push(data.redirectTo)
      }else{
        if(response.status == 401){
          toast.error('کد تایید اشتباه است')
        }else if(response.status == 410){
          toast.error('کد تایید منقضی شده')
        }else{
          toast.error('خطا در وورد')
        }
      }

    } catch (err) {
      toast.error('خطای سرور ، لطفا بعدا تلاش کنید')
    } finally{
        setIsLoading(false)
    }
  };

  const handleResendOtp =async ()=>{
   
     try {
      const res = await fetch("/api/auth/sms/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json()
      
      if(data.success){
        
        toast.success('کد تایید با موفقیت ارسال شد')
        setOtp(['','','','',''])
         setTimer(120)
      }else{
        toast.error('خطا در ارسال کد تایید')
      }
      
    } catch (err) {
        console.error(err);
        toast.error('خطا در ارسال کد تایید')
    }

  }

  
  useEffect(()=>{
    let interval;
    if(isCodeSent && timer>0){
      interval = setInterval(()=>{
        setTimer((timer)=>timer - 1)
      },1000)
    }else if(timer == 0){
      setIsResendDisabled(false)

    }

    return ()=> clearInterval(interval)
  }
  ,[isCodeSent , timer])

  return (
    <div className={styles.authWrapper}>
      <div className={styles.right}></div>
      <div className={styles.authForm}>
        {!isCodeSent && (
          <>
            <h2>نکست وان کد</h2>
            <h3>ورود | ثبت نام</h3>
            <p>لطفا شماره موبایل خود را وارد کنید</p>
            <input
              type="text"
              placeholder="شماره موبایل"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {isLoading ? (
              <Loader />
            ) : (
              <button
                onClick={handleSendOtp}
                disabled={!isPhoneValid(phone)} // دکمه ورود فقط زمانی فعال می‌شود که شماره موبایل معتبر باشد
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
            <OtpInputs  otp={otp} setOtp={setOtp}/>
            {isLoading ? (
              <Loader />
            ) : (
              <button
                onClick={handleVerifyOtp}
                disabled={!isOtpComplete} // دکمه فقط زمانی فعال می‌شود که OTP کامل شده باشد
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
                <p
                  className={styles.resend}
                  onClick={handleResendOtp}
                  disabled={isResendDisabled}
                >
                  دریافت مجدد کد تایید
                </p>
              )}
            </div>
          </>
        )}
      </div>
      <div className={styles.left}></div>
    </div>
  );
}

// next1code.ir/auth
// localhost:3000/auth
    