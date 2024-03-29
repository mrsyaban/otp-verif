import {connect} from "@/config/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { name, email, password, phone, province, city, regency } = reqBody;
    //check if user already exists
    const user = await User.findOne({ phone });
    if (user) {
        return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }
    
    //hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    
    // Generate OTP
    const otp = crypto.randomInt(100000, 999999);
    
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        phone,
        province,
        city,
        regency,
        otp,
        reqCount: 1,
    });
    
    const savedUser = await newUser.save();

    // send OTP
    const phoneNumber = phone.replace(/\D/g, '');
    const sendOtp =  await fetch(`https://wa.ikutan.my.id/send/${process.env.API_TOKEN}/${phoneNumber}?text="your otp is ${otp}"`, {
        method: "GET",
      });
    if (!sendOtp.ok) {
      return NextResponse.json({ message: "failed to send otp" }, { status: 500 });
    }
    return NextResponse.json({
      message: "Please verify your phone number",
      success: true,
      savedUser,
    }, { status: 200 });

  } catch (error: any) {
    
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
