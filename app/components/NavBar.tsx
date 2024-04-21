'use client'
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

type NavOption = {
  label: string
  url: string
}

export default function Navbar () {
    const url = process.env.NEXTAUTH_URL
    const [isOpen, setIsOpen] = useState(false)
    const { data: session } = useSession()

    const options: NavOption[] = [
      {
        label: 'Carros',
        url: '/carros'
      },
      {
        label: 'Clientes',
        url: '/clientes'
      },
      {
        label: 'Outra',
        url: '/outra'
      }
    ]

    const protectedOption: NavOption = {
      label: 'Funcionarios',
      url: '/dashboard/funcionarios'
    }

    return (
        <nav className="bg-gray-800 text-white">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center py-5 px-2">
                        <a href="#" className="text-gray-200 hover:text-gray-100 font-bold">Brand</a>
                    </div>
                    
                    {/* Primary Nav - hidden on mobile, flex on medium screens and above */}
                    <div className="hidden md:flex items-center space-x-1">
                      {/* @ts-expect-error */}
                      {session && (session?.user?.role === 'adm') ? 
                        (<Link className="py-5 px-3 text-gray-200 hover:bg-gray-600 hover:text-gray-100" href={protectedOption.url}>{protectedOption.label}</Link>) : 
                        (<></>)
                      }
                      {options.map((op) => 
                        <Link className="py-5 px-3 text-gray-200 hover:bg-gray-600 hover:text-gray-100" key={op.label} href={op.url}>{op.label}</Link>
                      )}
                      <button className='py-5 px-3 text-red-200 hover:text-gray-200 hover:bg-red-500' onClick={() => signOut({callbackUrl: url})}>Sair</button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="mobile-menu-button">
                            <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile Menu */}
            <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
                {options.map((op) => <Link className="block py-2 px-4 text-sm text-gray-200 hover:bg-gray-600 hover:text-gray-100" key={op.label} href={op.url}>{op.label}</Link>)}
            </div>
        </nav>
    )
}

