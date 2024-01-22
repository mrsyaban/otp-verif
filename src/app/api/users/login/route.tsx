import {connect} from "@/config/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    // validate email exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    } 

    
    // check if password is correct
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Incorrect password" }, { status: 400 });
    }
    
    // check if user is verified
    if (!user.isVerified) {
      return NextResponse.json({ message: "User not verified" }, { status: 301 });
    }

    return NextResponse.json({
      message: "Login Successful",
      success: true,
    }, { status: 200 });

  } catch (error: any) {
    
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
