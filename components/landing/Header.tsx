'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import StudentRegisterModal from './StudentRegisterModal';
import CompanyRegisterModal from './CompanyRegisterModal';

interface HeaderProps {
  variant?: 'blue' | 'light';
}

export default function Header({ variant = 'blue' }: HeaderProps) {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const pathname = usePathname();

  const isPracticasActive = pathname === '/practicas';
  const isLight = variant === 'light';

  return (
    <>
      <header
        className={`flex justify-between items-center p-6 max-w-[1400px] mx-auto w-full ${
          isLight ? 'text-gray-900' : 'text-white'
        }`}
      >
        {/* Switch dinámico PRACTI / FLOW */}
        <div
          className={`flex rounded-full overflow-hidden font-black text-sm shadow-md ${
            isLight ? 'bg-white border border-gray-200' : 'bg-white'
          }`}
        >
          <Link
            href="/practicas"
            title="Ver todas las prácticas disponibles"
            className={`px-5 py-2.5 rounded-full transition-all ${
              isPracticasActive
                ? 'bg-[#ccff00] text-black relative z-10 border-2 border-white shadow-sm'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            PRACTI
          </Link>
          <Link
            href="/"
            title="Volver al inicio"
            className={`px-5 py-2.5 rounded-full -ml-3 transition-all ${
              !isPracticasActive
                ? 'bg-[#ccff00] text-black relative z-10 border-2 border-white shadow-sm'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            FLOW
          </Link>
        </div>

        <nav className="hidden lg:flex gap-3">
          <Link
            href="/practicas"
            className={`px-6 py-2 rounded-full transition text-sm font-semibold ${
              isLight
                ? isPracticasActive
                  ? 'bg-[#0f4cff] text-white'
                  : 'border border-gray-300 text-gray-800 hover:bg-gray-100'
                : 'border border-white/30 hover:bg-white/10'
            }`}
          >
            Explorar Prácticas
          </Link>
          <button
            onClick={() => setIsCompanyOpen(true)}
            className={`px-6 py-2 rounded-full transition text-sm font-semibold cursor-pointer ${
              isLight
                ? 'border border-gray-300 text-gray-800 hover:bg-[#ccff00] hover:border-[#ccff00]'
                : 'border border-white/30 hover:bg-[#ccff00] hover:text-black hover:border-[#ccff00]'
            }`}
          >
            Soy Empresa
          </button>
          <Link
            href="/admin"
            className={`px-6 py-2 rounded-full transition text-sm ${
              isLight
                ? 'border border-gray-200 text-gray-600 hover:bg-gray-100'
                : 'border border-white/20 hover:bg-white/10'
            }`}
          >
            Panel Coordinación
          </Link>
        </nav>

        <div className="flex gap-2">
          <button
            onClick={() => setIsRegisterOpen(true)}
            className={`px-6 py-2 rounded-full transition text-sm font-semibold cursor-pointer ${
              isLight
                ? 'bg-[#0f4cff] text-white hover:bg-[#0b3bcc]'
                : 'border border-white bg-white/10 hover:bg-white hover:text-[#0f4cff]'
            }`}
          >
            Registro Estudiante
          </button>
        </div>
      </header>

      <StudentRegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
      <CompanyRegisterModal isOpen={isCompanyOpen} onClose={() => setIsCompanyOpen(false)} />
    </>
  );
}