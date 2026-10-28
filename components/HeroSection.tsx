'use client';
import { useState } from 'react';
import LoginModal from './LoginModal';

export default function HeroSection() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <section className="relative flex flex-col items-center justify-center min-h-[85vh] text-center overflow-hidden pt-10 pb-20">
        <div className="relative z-0 select-none flex flex-col items-center">
          <h1 className="text-[100px] md:text-[160px] font-black leading-[0.8] text-[#ccff00] tracking-tighter drop-shadow-[6px_6px_0_rgba(0,0,0,0.5)]">
            #PIXULINES
          </h1>
          <h2 className="text-[110px] md:text-[190px] font-black leading-[0.85] text-white tracking-tighter drop-shadow-[8px_8px_0_rgba(0,0,0,0.15)]">
            PRACTICAS
          </h2>
          <h2 className="text-[110px] md:text-[190px] font-black leading-[0.85] text-white tracking-tighter drop-shadow-[8px_8px_0_rgba(0,0,0,0.15)]">
            PROFESIONALES
          </h2>
        </div>

        {/* Sello circular giratorio que abre el Login */}
        <div 
          onClick={() => setIsLoginOpen(true)}
          className="absolute right-[12%] bottom-[5%] z-20 hidden lg:flex items-center justify-center cursor-pointer"
        >
          <div className="relative w-36 h-36 bg-[#ccff00] rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110">
            <div className="absolute w-full h-full animate-spin-slow flex items-center justify-center">
              <svg className="absolute w-full h-full p-2" viewBox="0 0 100 100">
                <path id="textPath" fill="transparent" d="M 15, 50 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
                <text className="text-[10px] font-bold tracking-[3px] fill-black uppercase">
                  <textPath href="#textPath" startOffset="0%">
                    • INGRESO • Estudiantes
                  </textPath>
                </text>
              </svg>
            </div>
            <div className="w-10 h-10 bg-black text-[#ccff00] rounded-full flex items-center justify-center z-10">
              <svg className="w-5 h-5 transform -rotate-45" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M7 17l9.2-9.2M17 17V7H7" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}