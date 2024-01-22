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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    } else if (user.reqCount >= 5) {
        return NextResponse.json({ error: "your on the request limit (5)" }, { status: 400 });
    }

    // check otp expired
    if (Date.now() < user.otpExp) {
      return NextResponse.json({ error: "you can resend after 5 minutes from your last attempt" }, { status: 400 });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999);
    
    user.otp = otp;
    user.otpExp = Date.now() + 5 * 60 * 1000;
    user.reqCount = user.reqCount + 1;
    const savedUser = await user.save();

    // send OTP
    const phoneNumber = phone.replace(/\D/g, '');
    await fetch(`https://wa.ikutan.my.id/send/${process.env.API_TOKEN}/${phoneNumber}?text=your otp is ${otp}`, {
      method: "GET",
    });

    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser,
    }, { status: 200 });

  } catch (error: any) {
    
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
