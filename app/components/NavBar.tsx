'use client'
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import logo from '@/public/Mallocar_Logo.svg'

type NavOption = {
  label: string
  url: string
}

export default function Navbar () {
    const url = '/'
    const [isOpen, setIsOpen] = useState(false)
    const { data: session } = useSession()

    const options: NavOption[] = [
      {
        label: 'Carros',
        url: '/dashboard/carros'
      },
      {
        label: 'Clientes',
        url: '/dashboard/clientes'
      },
      {
        label: 'Vendas',
        url: '/dashboard/vendas'
      }
    ]

    const protectedOption: NavOption = {
      label: 'Funcionarios',
      url: '/dashboard/funcionarios'
    }

    return (
        <nav className="bg-gray-100 text-white">
            <div className="h-16 pt-2 md:h-auto md:pt-0 md:max-w-6xl md:mx-auto px-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}

                    <Image src={logo} alt='Logo for Mallocar' width={100}/>
                    
                    {/* Primary Nav - hidden on mobile, flex on medium screens and above */}
                    <div className="hidden md:flex items-center space-x-1">
                      {/* @ts-expect-error */}
                      {session && (session?.user?.role === 'adm') ? 
                        (<Link className="rounded py-5 px-3 text-[#3a0039] hover:bg-[#3a0039] hover:text-gray-100" href={protectedOption.url}>{protectedOption.label}</Link>) : 
                        (<></>)
                      }
                      {options.map((op) => 
                        <Link className="rounded my-2 py-5 px-3 text-[#3a0039] hover:bg-[#3a0039] hover:text-gray-100" key={op.label} href={op.url}>{op.label}</Link>
                      )}
                      <p className='text-[#3a0039] font-semibold'>oi, {session?.user?.name?.split(' ')[0]}</p>
                      <button className='font-semibold rounded py-5 px-3 text-red-500 hover:text-gray-200 hover:bg-red-500' onClick={() => signOut({callbackUrl: url})}>Sair</button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="mobile-menu-button">
                            <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="#3a0039">
                                <path d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile Menu */}
            <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
                {options.map((op) => <Link className="block py-2 px-4 text-sm text-[#3a0039] hover:bg-[#3a0039] hover:text-gray-100" key={op.label} href={op.url}>{op.label}</Link>)}
            </div>
        </nav>
    )
}

