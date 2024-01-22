"use client"
import { useRouter } from "next/router";
import axios from "axios";
import toast, {Toaster} from 'react-hot-toast';
import { useState } from "react";

const VerifOTP = () => {
  const router = useRouter();



  return (
    <div className="flex flex-col gap-2 h-screen items-center justify-center text-white">
        <Toaster/>
        <h2>Enter the 6-digit OTP</h2>
        <div className="flex gap-1">
            <input className="outline outline-slate-500" type="number" id="digit1" />
            <input className="outline outline-slate-500" type="number" id="digit2" />
            <input className="outline outline-slate-500" type="number" id="digit3" />
            <input className="outline outline-slate-500" type="number" id="digit4" />
            <input className="outline outline-slate-500" type="number" id="digit5" />
            <input className="outline outline-slate-500" type="number" id="digit6" />
        </div>
        <button className="bg-slate-400 rounded-md py-2 px-4">Verify</button>
        <button className="bg-slate-400 rounded-md py-2 px-4">Resend</button>
    </div>
  )
}

export default VerifOTP