'use client'
import { useState } from "react"
import { signIn } from "next-auth/react"

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
    <section className="flex justify-center items-center bg-blue-300 w-dvh h-lvh">
      <div className="flex flex-col items-center justify-center w-screen h-screen ">
        <div className="flex flex-col items-center justify-center mb-6">
          <span className="text-blue-700 font-semibold mb-4">Login</span>
          <p className="text-center text-sm w-64 font-light">sistema projeto bd</p>
        </div>
        <form action={login} className="flex flex-col items-center">
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div className="flex flex-col mb-2">
            <label htmlFor="username">Usuario</label>
            <input type="text" name="username" id="username" placeholder="user123" required className="py-2 pl-2 pr-4 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-blue-500"/>
          </div>
          <div className="flex flex-col mb-2">
            <label htmlFor="password">Senha</label>
            <input type="password" name="password" id="password" placeholder="****" required className="py-2 pl-2 pr-4 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-blue-500"/>
          </div>
          <button type="submit" className="w-full text-white p-2 rounded-md bg-green-500">Login</button>
        </form>
      </div>
    </section>
  )
}
