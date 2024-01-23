import {connect} from "@/config/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { phone } = reqBody;

    const user = await User.findOne({ phone });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    } else if (user.reqCount >= 5) {
        return NextResponse.json({ message: "your on the request limit (5)" }, { status: 400 });
    }

    // check otp expired
    if (Date.now() < user.otpExp) {
      return NextResponse.json({ message: "you can resend after 5 minutes from your last attempt" }, { status: 400 });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999);
    
    user.otp = otp;
    user.otpExp = Date.now() + 5 * 60 * 1000;
    user.reqCount = user.reqCount + 1;
    
    // send OTP
    const phoneNumber = phone.replace(/\D/g, '');
    const sendOtp =  await fetch(`https://wa.ikutan.my.id/send/${process.env.API_TOKEN}/${phoneNumber}?text="your otp is ${otp}"`, {
      method: "GET",
    });
    if (!sendOtp.ok) {
      return NextResponse.json({ message: "failed to send otp" }, { status: 500 });
    }
    
    const savedUser = await user.save();
    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser,
    }, { status: 200 });

  } catch (error: any) {
    
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
