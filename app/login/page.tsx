'use client'
import { useState } from "react"
import { signIn } from "next-auth/react"
import Image from "next/image"
import logo from '@/public/Mallocar_Logo.svg'
import Link from "next/link"

export default function Login() {
  const [error, setError] = useState<string>('')

  function login(formData: FormData){
    const data = {
      username: formData.get('username') as string,
      password: formData.get('password') as string
    }
    
    signIn('credentials', {
      ...data,
      callbackUrl: "/dashboard/page"
    })
  }
  return (
    <section className="flex justify-center items-center  bg-accb-green w-dvh h-lvh">
      <div className="flex flex-col items-center justify-center w-screen h-screen md:w-80 md:h-[32rem] transition-all md:transition-all rounded-md bg-gray-100 ">
        <div className="flex flex-col items-center justify-center mb-6">
          <Link className="mb-4 text-left w-full" href="/">
            <svg width="30" height="30" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.9375 23.4375H42.1875C42.6019 23.4375 42.9993 23.6021 43.2924 23.8951C43.5854 24.1882 43.75 24.5856 43.75 25C43.75 25.4144 43.5854 25.8118 43.2924 26.1049C42.9993 26.3979 42.6019 26.5625 42.1875 26.5625H10.9375C10.5231 26.5625 10.1257 26.3979 9.83265 26.1049C9.53962 25.8118 9.375 25.4144 9.375 25C9.375 24.5856 9.53962 24.1882 9.83265 23.8951C10.1257 23.6021 10.5231 23.4375 10.9375 23.4375Z" fill="#9C0E9A"/>
              <path d="M11.5844 25L24.5437 37.9563C24.8371 38.2497 25.002 38.6476 25.002 39.0625C25.002 39.4774 24.8371 39.8754 24.5437 40.1688C24.2503 40.4622 23.8524 40.627 23.4375 40.627C23.0226 40.627 22.6246 40.4622 22.3312 40.1688L8.26874 26.1063C8.12323 25.9611 8.00778 25.7887 7.92901 25.5989C7.85024 25.409 7.80969 25.2055 7.80969 25C7.80969 24.7945 7.85024 24.591 7.92901 24.4012C8.00778 24.2113 8.12323 24.0389 8.26874 23.8938L22.3312 9.83127C22.6246 9.53787 23.0226 9.37305 23.4375 9.37305C23.8524 9.37305 24.2503 9.53787 24.5437 9.83127C24.8371 10.1247 25.002 10.5226 25.002 10.9375C25.002 11.3524 24.8371 11.7504 24.5437 12.0438L11.5844 25Z" fill="#3a0039"/>
            </svg>
          </Link>
          <Image src={logo} alt="Logo for Mallocar" className="w-48 h-auto mb-4"/>
          <span className="text-accb-green font-semibold text-[#3a0039]">Log in</span>
        </div>
        <form className="flex flex-col items-center" action={login}>
          {error && <p className="text-red-600 text-center">{error}</p>}
          <div className="flex flex-col gap-2 mb-2 items-center">
            <div className="flex flex-col mb-2 text-[#3a0039]">
              <label htmlFor="username">Usuario:</label>
              <input type="text" name="username" id="username" placeholder="user123" required className="py-2 pl-2 pr-4 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-blue-500"/>
            </div>
            <div className="flex flex-col mb-2 text-[#3a0039]">
              <label htmlFor="password">Senha:</label>
              <input type="password" name="password" id="password" placeholder="****" required className="py-2 pl-2 pr-4 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-blue-500"/>
            </div>
            <button type="submit" className="w-full text-white p-2 rounded-md bg-[#3a0039]">Login</button>
          </div>
        </form>
      </div>
    </section>
  )
}
