"use client"

import { useState, FormEvent, ChangeEvent } from 'react';

interface LoginForm {
  email: string;
}

const LoginPage = () => {
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
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
          <button type="submit" className="flex w-full mt-12 justify-center bg-slate-400 hover:bg-slate-600 rounded-md p-4">Log in</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
