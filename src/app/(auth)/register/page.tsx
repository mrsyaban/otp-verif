"use client"

import { useState, FormEvent, ChangeEvent } from 'react';
import { HiEye, HiEyeOff } from "react-icons/hi";
import toast, {Toaster} from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  phone: string;
  province: string;
  city: string;
  regency: string;
}

const RegisterPage = () => {
  const router = useRouter();
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [verifyPassword, setVerifyPassword] = useState<string>("");
  const [formData, setFormData] = useState<RegisterForm>({
    name: '',
    email: '',
    password: '',
    phone: '',
    province: '',
    city: '',
    regency: '',
  });

  const [inputOTP, setInputOTP] = useState<number>();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 8 || !/\d/.test(formData.password) || !/[a-zA-Z]/.test(formData.password)) {
      toast.error("Password must have a minimum of 8 characters, including both letters and numbers.");
      return;
    }

    // Check if the entered password matches the verified password
    if (formData.password !== verifyPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!formData.phone.startsWith('+62')) {
      toast.error("Phone number must start with +62");
      return;
    }

    toast.promise(
      (async () => {
        const response = await axios.post(
          "/api/users/signup",
          formData
        );

        if (response.status === 200) {
          setIsOtpSent(true);
        } else {
          return new Promise((_, reject) => {
            reject(new Error(response.data.message));
          });
        }
      })(),
      {
        loading: "Loading...",
        success: <b>Please verify your phone number</b>,
        error: <b>Sign Up failed</b>,
      }
    );
  };

  
  const handleResend = () => {
    toast.promise(
      (async () => {
        const response = await axios.post(
          "/api/users/resend-otp",
          {
            phone: formData.phone,
          }
        );

        if (response.status !== 200) {
          return new Promise((_, reject) => {
            reject(new Error(response.data.message));
          });
        }
      })(),
      {
        loading: "Loading...",
        success: <b>OTP has been sent</b>,
        error:<b>failed to send OTP</b>,
      }
    );
  }

  const handleVerify = () => {
    toast.promise(
      (async () => {
        const response = await axios.post(
          "/api/users/verify-otp",
          {
            phone: formData.phone,
            inputOTP: inputOTP,
          }
        );

        if (response.status !== 200) {
          return new Promise((_, reject) => {
            reject(new Error(response.data.message));
          });
        } else {
          router.push('/');
        }
      })(),
      { 
        loading: "Loading...",
        success: <b>Sign Up Successfully</b>,
        error: <b>Failed to verify token</b>,
      }
    );
  }

  return (
    <>
    { isOtpSent ?
        <div className="flex flex-col gap-2 h-screen items-center justify-center text-white">
        <Toaster />
        <h2>Enter the 6-digit OTP</h2>
        <input type="number" className='text-slate-800 text-center justify-center py-2' onChange={(e) => setInputOTP(parseInt(e.target.value))} />
        <button onClick={handleVerify} className="bg-slate-400 hover:bg-slate-600 rounded-md py-2 px-4">Verify</button>
        <button onClick={handleResend} className="bg-slate-400 hover:bg-slate- rounded-md py-2 px-4">Resend</button>
    </div> :

    <div className="flex justify-center items-center bg-black">
      <Toaster />
      <div className='flex flex-col p-4 items-center w-1/2'>
        <h1>Register</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-2 w-full text-slate-800'>
          <div id='inputWrapper' className='flex flex-col gap-1'>
            <h1>Name</h1>
            <input
              name="name"
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="bg-primaryLight rounded-md py-2 px-4 outline outline-1 outline-slate-500 focus:drop-shadow-xl focus:outline-2 focus:outline-black"
            />
          </div>
          <div id='inputWrapper' className='flex flex-col gap-1'>
            <h1>Email</h1>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="bg-primaryLight rounded-md py-2 px-4 outline outline-1 outline-slate-500 focus:drop-shadow-xl focus:outline-2 focus:outline-black"
              required
            />
          </div>
          <div id='inputWrapper' className='flex flex-col gap-1'>
            <h1>Password</h1>
            <div id="passWrapper" className="flex flex-row justify-between w-full py-2 px-4 bg-white rounded-md items-center">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="outline outline-0 w-full pr-4"
              />
              <div className="flex justify-center h-full items-center  cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <HiEyeOff className='fill-black'/> : <HiEye className='fill-black'/>}
              </div>
            </div>
          </div>
          <div id='inputWrapper' className='flex flex-col gap-1'>
            <h1>Verify Password</h1>
            <input
              type="password"
              name="email"
              placeholder="Verify Password"
              onChange={(e) => setVerifyPassword(e.target.value)}
              className="bg-primaryLight rounded-md py-2 px-4 outline outline-1 outline-slate-500 focus:drop-shadow-xl focus:outline-2 focus:outline-black"
              required
            />
          </div>
          <div id='inputWrapper' className='flex flex-col gap-1'>
            <h1>Phone</h1>
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="bg-primaryLight rounded-md py-2 px-4 outline outline-1 outline-slate-500 focus:drop-shadow-xl focus:outline-2 focus:outline-black"
              required
            />
          </div>
          <div id='inputWrapper' className='flex flex-col gap-1'>
            <h1>Province</h1>
            <input
              type="text"
              name="province"
              placeholder="Province"
              value={formData.province}
              onChange={handleChange}
              className="bg-primaryLight rounded-md py-2 px-4 outline outline-1 outline-slate-500 focus:drop-shadow-xl focus:outline-2 focus:outline-black"
              required
            />
          </div>
          <div id='inputWrapper' className='flex flex-col gap-1'>
            <h1>City</h1>
            <input
              type="text"
              name="city"
              placeholder="Bandung"
              value={formData.city}
              onChange={handleChange}
              className="bg-primaryLight rounded-md py-2 px-4 outline outline-1 outline-slate-500 focus:drop-shadow-xl focus:outline-2 focus:outline-black"
              required
            />
          </div>
          <div id='inputWrapper' className='flex flex-col gap-1'>
            <h1>Regency</h1>
            <input
              type="text"
              name="regency"
              placeholder="Bandung Wetan"
              value={formData.regency}
              onChange={handleChange}
              className="bg-primaryLight rounded-md py-2 px-4 outline outline-1 outline-slate-500 focus:drop-shadow-xl focus:outline-2 focus:outline-black"
              required
            />
          </div>
          <button type="submit" className="flex w-full mt-12 justify-center bg-slate-400 hover:bg-slate-600 rounded-md p-4">Register</button>
        </form>
      </div>
    </div>
    }
    </>
  );
};

export default RegisterPage;
