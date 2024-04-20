'use client'
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"

type NavOption = {
  label: string
  url: string
}

export default function NavBar() {
  const {data:session} = useSession()
  const options: NavOption[] = [
    {
      label: 'Carros',
      url: '/carros'
    },
    {
      label: 'Clientes',
      url: '/clientes'
    }
  ]
  
  return (
    <nav className="flex justify-between w-full h-10">
      <span >Logo</span>
      <ul className="flex">
        {options.map((op, key) => <li key={op.label}>{op.label}</li>)}
      </ul>
      {/* @ts-expect-error */}
      {session && (session?.user?.role === 'adm') ? 
        (<div>
          <span>Criar Func</span>
          <Link href="/api/auth/signout" legacyBehavior>
          <a onClick={e => {
            e.preventDefault()
            signOut()
          }}>Sair</a>
          </Link>
        </div>)
        :(<span>nada</span>)
      }
    </nav>
  )
}
