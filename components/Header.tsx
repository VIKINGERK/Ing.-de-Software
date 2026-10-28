'use client';
import { useState } from 'react';
import StudentRegisterModal from './StudentRegisterModal';

export default function Header() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <>
      <header className="flex justify-between items-center p-6 text-white max-w-[1400px] mx-auto w-full">
        <div className="flex bg-white rounded-full overflow-hidden font-black text-sm">
          <span className="bg-white text-black px-5 py-2.5 rounded-l-full">BASE</span>
          <span className="bg-[#ccff00] text-black px-5 py-2.5 rounded-full -ml-3 relative z-10 border-2 border-white">CLUB</span>
        </div>
        
        <nav className="hidden lg:flex gap-3">
          {['Quienes somos', 'Universidades', 'Empresas', 'Contactanos'].map((item) => (
            <a key={item} href="#" className="border border-white/20 px-6 py-2 rounded-full hover:bg-white/10 transition text-sm">
              {item}
            </a>
          ))}
        </nav>
        
        <button 
          onClick={() => setIsRegisterOpen(true)}
          className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-[#0f4cff] transition text-sm font-semibold cursor-pointer"
        >
          Únete al Club
        </button>
      </header>

      <StudentRegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
    </>
  );
}