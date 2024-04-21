import Link from "next/link";
import Image from "next/image";
import logo from '@/public/Mallocar_Logo.svg'
import bg from '@/public/bg.png'

export default function Home() {
  return (
    <div className="flex flex-col shadow-lg justify-center items-center h-screen">
      <div className="flex justify-center text-center h-24 px-16 md:justify-between bg-gray-100 fixed top-0 left-0 right-0 z-10">

          <Image src={logo} alt="Logo for Mallocar" className="text-[#3a0039]" width={180} />  
        <div className="hidden md:block md:justify-center md:mt-2 md:py-6">
          <Link href="/login"><span className="bg-[#3a0039] hover:bg-blue-700 text-white font-light uppercase py-2 px-4 rounded">Entrar</span></Link>
        </div>
      </div>
      <div className="relative w-full h-screen">
        <Image className="w-full h-full object-cover blur-sm" src={bg} alt="Background from Mallocar" layout="fill"/>
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <h1 className="text-white text-shadow-lg text-5xl font-bold uppercase pt-8 my-24">Concessionária Mallocar</h1>
          <Link href="/login">
            <span className="bg-[#3a0039] hover:bg-gray-600 text-white font-light uppercase py-4 px-8 rounded">ACESSE O SISTEMA</span>
          </Link>
          <div className="text-white bg-black bg-opacity-50 mt-10">
            <h2 className="text-2xl uppercase pt-4">Sobre</h2>
            <p className="text-lg">O Mallocar oferece as melhores soluções para suas necessidades de transporte. Com uma ampla variedade de veículos e preços competitivos, estamos aqui para tornar sua jornada mais fácil e conveniente.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
