import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
export const runtime = "nodejs"

export function middleware(request , response){
    
    const accessToken = request.cookies.get('accessToken')?.value

     const pathname = request.nextUrl.pathname;

  if (pathname == "/auth") {
    if (accessToken) {
      try {
        const payload = jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET,
        );
        const redirectTo = payload.role == "user" ? "/profile" : "/admin/dashboard";
        return NextResponse.redirect(new URL(redirectTo, request.url));
      } catch (err) {
        // توکن نامعتبر یا منقضی → اجازه بده بره /auth (برای لاگین مجدد)
        return NextResponse.next();
      }
    }

    return NextResponse.next();
  }

   
    if(!accessToken){
        return NextResponse.redirect(new URL('/auth' , request.url))
    }

    try{
        jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
        return NextResponse.next()

    }catch(err){
            return NextResponse.redirect(new URL('/auth' , request.url))
    }
    
}

export const config = {
    matcher :  ["/profile/:path*",  "/admin/:path*" , "/auth"],
}