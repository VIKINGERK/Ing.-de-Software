export default function StepsSection() {
  return (
    <section className="bg-[#e5e7eb] rounded-t-[60px] w-full max-w-[1300px] mx-auto px-6 py-16 relative z-20 shadow-2xl -mt-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative items-stretch">
        
        {/* Paso 1 */}
        <div className="bg-[#d1d5db] rounded-[40px] p-8 flex flex-col items-center text-center shadow-[inset_0_4px_10px_rgba(0,0,0,0.05)]">
          <h3 className="font-black text-2xl mb-2 leading-tight">MÁS DE<br/>100 EMPRESAS</h3>
          <p className="text-sm text-gray-700 font-medium mb-10">Recibees la Respuesta en seguida</p>
          <div className="bg-[#0f4cff] rounded-full p-2 pr-6 flex items-center gap-3 text-white w-full max-w-[280px] shadow-lg mt-auto">
            <div className="w-12 h-12 rounded-full bg-[#d69f7e] ml-1 shrink-0 border-2 border-white/20"></div>
            <div className="text-left flex-1">
              <p className="text-xs font-bold">Registra tu empresa</p>
            </div>
            <div className="bg-[#ccff00] text-black text-xs font-black px-4 py-2 rounded-full">
              +100
            </div>
          </div>
        </div>

        {/* Paso 2 */}
        <div className="bg-[#d1d5db] rounded-[40px] p-8 flex flex-col items-center text-center shadow-[inset_0_4px_10px_rgba(0,0,0,0.05)]">
          <h3 className="font-black text-2xl mb-2 leading-tight">ESCOGE<br/>TU ÁREA</h3>
          <p className="text-sm text-gray-700 font-medium mb-10">Escoge entre diferentes áreas asociadas a tu carrera</p>
          <div className="bg-[#0f4cff] rounded-[30px] p-4 flex items-center justify-center gap-4 text-white w-full max-w-[220px] relative shadow-lg mt-auto">
            <span className="font-bold text-xl">+200 Áreas</span>
            <button className="absolute -bottom-3 right-6 bg-[#ccff00] hover:bg-[#b3e600] transition text-black p-3 rounded-full shadow-md">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
            </button>
          </div>
        </div>

        {/* Paso 3 */}
        <div className="bg-[#d1d5db] rounded-[40px] p-8 flex flex-col items-center text-center shadow-[inset_0_4px_10px_rgba(0,0,0,0.05)]">
          <h3 className="font-black text-2xl mb-2 leading-tight">PARA<br/>DOCENTES Y ESTUDIANTES</h3>
          <p className="text-sm text-gray-700 font-medium mb-10">Los profesores suben su retroalimentacion y te llega en seguida</p>
          <div className="bg-[#ccff00] rounded-[25px] p-5 text-black text-center w-full max-w-[250px] shadow-lg relative mt-auto">
             <p className="text-[11px] font-bold mb-1">Estudiantes Inscritos</p>
             <p className="text-[32px] font-black tracking-tight">188.342</p>
             {/* Triángulo del globo de diálogo */}
             <div className="absolute -bottom-3 left-[20%] w-6 h-6 bg-[#ccff00] rotate-45 transform origin-top-left"></div>
          </div>
        </div>

      </div>
    </section>
  );
}