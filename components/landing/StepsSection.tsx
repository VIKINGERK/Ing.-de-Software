'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Building2, ArrowUpRight, FileCheck2 } from 'lucide-react';
import CompanyRegisterModal from './CompanyRegisterModal';
import StudentRegisterModal from './StudentRegisterModal';

export default function StepsSection() {
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const [isStudentOpen, setIsStudentOpen] = useState(false);

  return (
    <>
      <section className="bg-[#f3f4f6] border border-white/80 rounded-t-[50px] md:rounded-t-[60px] w-full max-w-[1300px] mx-auto px-6 md:px-10 py-14 md:py-16 relative z-20 shadow-2xl -mt-10 text-gray-900">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 relative items-stretch">
          
          {/* Paso 1: Empresas */}
          <div className="group bg-[#e5e7eb] hover:bg-white rounded-[40px] p-8 flex flex-col items-center text-center border border-gray-300/60 shadow-[inset_0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
            <span className="text-[11px] font-black tracking-widest uppercase text-[#0f4cff] bg-blue-100/80 px-3.5 py-1 rounded-full mb-5">
              Paso 01 • Empresas
            </span>
            <h3 className="font-black text-2xl md:text-[26px] mb-2.5 leading-tight tracking-tight text-gray-900">
              MÁS DE<br />100 EMPRESAS
            </h3>
            <p className="text-sm text-gray-600 font-medium mb-10 max-w-[230px]">
              Postula directo y recibe respuesta en seguida sobre tu carta
            </p>

            <button
              onClick={() => setIsCompanyOpen(true)}
              className="bg-[#0f4cff] hover:bg-[#0b3bcc] rounded-full p-2 pr-3 flex items-center gap-3 text-white w-full max-w-[285px] shadow-lg mt-auto transition-transform group-hover:scale-[1.02] cursor-pointer"
            >
              <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center shrink-0 border border-white/25">
                <Building2 className="w-5 h-5 text-[#ccff00]" />
              </div>
              <div className="text-left flex-1 leading-tight">
                <p className="text-xs font-extrabold">Registra tu</p>
                <p className="text-xs font-extrabold">empresa</p>
              </div>
              <div className="bg-[#ccff00] text-black text-xs font-black px-4 py-2.5 rounded-full shadow-sm">
                +100
              </div>
            </button>
          </div>

          {/* Paso 2: Áreas y Carreras */}
          <div className="group bg-[#e5e7eb] hover:bg-white rounded-[40px] p-8 flex flex-col items-center text-center border border-gray-300/60 shadow-[inset_0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
            <span className="text-[11px] font-black tracking-widest uppercase text-[#0f4cff] bg-blue-100/80 px-3.5 py-1 rounded-full mb-5">
              Paso 02 • Carreras
            </span>
            <h3 className="font-black text-2xl md:text-[26px] mb-2.5 leading-tight tracking-tight text-gray-900">
              ESCOGE<br />TU ÁREA
            </h3>
            <p className="text-sm text-gray-600 font-medium mb-10 max-w-[240px]">
              Filtra vacantes compatibles con tu universidad y carrera
            </p>

            <Link
              href="/practicas"
              className="bg-[#0f4cff] hover:bg-[#0b3bcc] rounded-full py-4 px-7 flex items-center justify-center gap-3 text-white w-full max-w-[250px] relative shadow-lg mt-auto transition-transform group-hover:scale-[1.02]"
            >
              <span className="font-black text-xl tracking-tight">+200 Áreas</span>
              <span className="absolute -bottom-2.5 right-5 bg-[#ccff00] group-hover:rotate-12 transition-transform text-black p-2.5 rounded-full shadow-md border-2 border-white">
                <ArrowUpRight className="w-4 h-4 stroke-[3]" />
              </span>
            </Link>
          </div>

          {/* Paso 3: Postulación Express */}
          <div className="group bg-[#e5e7eb] hover:bg-white rounded-[40px] p-8 flex flex-col items-center text-center border border-gray-300/60 shadow-[inset_0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
            <span className="text-[11px] font-black tracking-widest uppercase text-[#0f4cff] bg-blue-100/80 px-3.5 py-1 rounded-full mb-5">
              Paso 03 • Postulación
            </span>
            <h3 className="font-black text-2xl md:text-[26px] mb-2.5 leading-tight tracking-tight text-gray-900">
              CARTA OFICIAL<br />EN 1 CLIC
            </h3>
            <p className="text-sm text-gray-600 font-medium mb-10 max-w-[250px]">
              Genera tu carta de presentación y postula hasta en 3 prácticas
            </p>

            <button
              onClick={() => setIsStudentOpen(true)}
              className="bg-[#ccff00] hover:bg-[#b3e600] rounded-[26px] px-6 py-4 text-black text-center w-full max-w-[265px] shadow-lg relative mt-auto transition-transform group-hover:scale-[1.02] cursor-pointer"
            >
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wide text-black/80 mb-0.5">
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Estudiantes Inscritos</span>
              </div>
              <p className="text-[32px] font-black tracking-tight leading-none">188.342</p>
              {/* Punta del globo de diálogo */}
              <div className="absolute -bottom-2.5 left-[22%] w-5 h-5 bg-[#ccff00] rotate-45 rounded-xs"></div>
            </button>
          </div>

        </div>
      </section>

      <CompanyRegisterModal isOpen={isCompanyOpen} onClose={() => setIsCompanyOpen(false)} />
      <StudentRegisterModal isOpen={isStudentOpen} onClose={() => setIsStudentOpen(false)} />
    </>
  );
}