'use server'

import { signIn } from "next-auth/react"
import { redirect } from "next/navigation"

export default async function loginAction(error: string, formData: FormData): Promise<string> {
 
  const data = {
    username: formData.get('username') as string,
    password: formData.get('password') as string
  }
  try {
    signIn('credentials', {
      ...data,
    })  

    redirect('/dashboard/page')
  } catch (error) {
    return 'Falha ao validar: ' + error
  }  
}