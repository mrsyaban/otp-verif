import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { phone, inputOTP } = reqBody;

    const user = await User.findOne({ phone });

    // check otp expired
    if (Date.now() > user.otpExp) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    // otp validation
    const savedOTP = user.otp; 
    if (inputOTP !== savedOTP) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    } else {
      user.isVerified = true;
      await user.save();
    }
    
    const userUpdated = await User.findOne({ phone });

    return NextResponse.json({ message:"OTP valid", success: true, data:userUpdated }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
