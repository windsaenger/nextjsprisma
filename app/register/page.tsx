import React from 'react'
import bcrypt from "bcrypt";
import { PrismaClient } from '@prisma/client'
import { redirect } from 'next/navigation'
import Button from '../components/Button';

const prisma = new PrismaClient()

const RegisterPage = () => {
    
  const saveForm = async (formData: FormData) => {
    'use server'
    
    const firstname = formData.get("firstname")?.toString();
    const lastname = formData.get("lastname")?.toString();
    const username = formData.get("username")?.toString();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const confirmpassword = formData.get("confirmpassword")?.toString();

    console.log(formData);

    if (!firstname || !lastname || !username || !email || !password || !confirmpassword) 
      throw Error("Required field(s) missing.")

    if (password !== confirmpassword) 
      throw Error("Passwords do not match.")

    const emailExists = await prisma.user.findUnique({
      where: {email}
    });

    if (emailExists) 
      throw Error("User already exists.")

    const userExists = await prisma.user.findFirst({
      where: {name: username}
    });
  
    if (userExists) 
      throw Error("User already exists.")
    
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(hashedPassword);

    const newuser = await prisma.user.create({
      data: {
        firstname,
        lastname,
        name: username,
        email,
        hashedPassword,
      }
    });
    
    console.log(newuser)

    redirect('/api/auth/signin');

    }

  return (
    <form action={saveForm} className="flex flex-col w-[300px] m-auto border-2">
      <div className="bg-blue-900 text-white text-center text-2xl mb-2 p-2 top-0 left-0 w-full">User Registration</div>
      <label htmlFor="firstname" className="pl-2">First Name</label>
      <input type="text" autoComplete="on" id="firstname" name="firstname" autoFocus required className="border-2 border-slate-300 bg-blue-100 m-2 p-2"  />
      <label htmlFor="lastname" className="pl-2">Last Name</label>
      <input type="text" autoComplete="on" id="lastname" name="lastname" required className="border-2 border-slate-300 bg-blue-100 m-2 p-2" />
      <label htmlFor="username" className="pl-2">User Name</label>
      <input type="text" autoComplete="on" id="username" name="username" required className="border-2 border-slate-300 bg-blue-100 m-2 p-2"  />
      <label htmlFor="email" className="pl-2">Email</label>
      <input type="email" autoComplete="on" id="email" name="email" required className="border-2 border-slate-300 bg-blue-100 m-2 p-2" />
      <label htmlFor="password" className="pl-2">Password</label>
      <input type="password" autoComplete="off" id="password"  name="password" required className="border-2 border-slate-300 bg-blue-100 m-2 p-2"  />
      <label htmlFor="confirmpassword" className="pl-2">Confirm Password</label>
      <input type="password" autoComplete="off" id="confirmpassword" name="confirmpassword" required className="border-2 border-slate bg-blue-100-300 bg-blue-100 m-2 p-2" />
      <div className="flex flex-row justify-end">
      <Button type="submit" caption="Save" classname="bg-blue-900 hover:bg-blue-700 text-white font-bold m-2 p-2 rounded w-[100px]" />
      <Button type="reset" caption="Cancel" classname="bg-blue-900 hover:bg-blue-700 text-white font-bold m-2 p-2 rounded w-[100px]" />
      </div>
      </form>
  )
}

export default RegisterPage