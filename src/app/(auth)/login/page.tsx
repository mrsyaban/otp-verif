"use client"

import { useState, FormEvent, ChangeEvent } from 'react';
import { HiEye, HiEyeOff } from "react-icons/hi";
import axios from 'axios';
import toast, {Toaster} from 'react-hot-toast';

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage = () => {
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [inputOTP, setInputOTP] = useState<number>();
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/users/login', formData);
      toast.success("Login Successful");
    } catch (error:any) {
      if (error.response) {
        if (error.response.data.message === "User not verified" && error.response.status === 301) {
          setIsOtpSent(true);
        }
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  return (
    <>
    <Toaster />
    {isOtpSent ? 
      <div className="flex flex-col gap-2 h-screen items-center justify-center text-white">
        <h2>Enter the 6-digit OTP</h2>
        <input type="number" className='text-slate-800 text-center justify-center py-2' onChange={(e) => setInputOTP(parseInt(e.target.value))} />
        <button  className="bg-slate-400 hover:bg-slate-600 rounded-md py-2 px-4">Verify</button>
        <button className="bg-slate-400 hover:bg-slate- rounded-md py-2 px-4">Resend</button>
      </div> :

      <div className="flex justify-center items-center bg-black">
        <div className='flex flex-col p-4 items-center w-1/2'>
          <h1>Log in</h1>
          <form onSubmit={handleSubmit} className='flex flex-col gap-2 w-full'>
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
            <div id="passWrapper" className="flex flex-row justify-between w-full py-2 px-4 text-slate-800 bg-white rounded-md items-center">
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
            <button onClick={handleSubmit} type="submit" className="flex w-full mt-12 justify-center bg-slate-400 hover:bg-slate-600 rounded-md p-4">Log in</button>
          </form>
        </div>
      </div>
    }
    </>
  );
};

export default LoginPage;
