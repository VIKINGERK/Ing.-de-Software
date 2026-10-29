'use client';

import React, { useState } from 'react';

interface Solicitud {
  id: string;
  rutEmpresa: string;
  razonSocial: string;
  correoSupervisor: string;
  tipoPractica: string;
  fecha: string;
  estado: string;
}

export default function StudentPanel() {
  const [openSection, setOpenSection] = useState<string | null>('aprobados');

  const [formData, setFormData] = useState({
    rutEmpresa: '',
    razonSocial: '',
    correoSupervisor: '',
    tipoPractica: 'I',
  });

  const [cartaGenerada, setCartaGenerada] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Estado para la consulta en vivo (Persistencia en base de datos)
  const [solicitudesHistorial, setSolicitudesHistorial] = useState<Solicitud[]>([
    {
      id: 'REQ-9842',
      rutEmpresa: '76.543.210-K',
      razonSocial: 'Innovación Tecnológica SpA',
      correoSupervisor: 'supervisor@innovacion.cl',
      tipoPractica: 'I',
      fecha: '2026-10-28 14:30',
      estado: 'Aprobada / Emitida'
    }
  ]);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleCartaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const practicaDisponible: string = 'I'; 

    if (formData.tipoPractica === 'II' && practicaDisponible !== 'II') {
      setErrorMessage(
        'Causal A-03 Denegada: El estudiante registra condición irregular o no cumple con los requisitos curriculares previos para postular a Práctica II. Debe tener aprobada la Práctica I.'
      );
      setCartaGenerada(false);
      return;
    }

    // Si es válido, guardamos en la "base de datos" (consulta en vivo)
    const nuevaSolicitud: Solicitud = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      rutEmpresa: formData.rutEmpresa,
      razonSocial: formData.razonSocial,
      correoSupervisor: formData.correoSupervisor,
      tipoPractica: formData.tipoPractica,
      fecha: new Date().toISOString().replace('T', ' ').substring(0, 16),
      estado: 'Aprobada / Persistida'
    };

    setSolicitudesHistorial([nuevaSolicitud, ...solicitudesHistorial]);
    setCartaGenerada(true);
  };

  const handleDownloadPdf = async () => {
    setLoadingPdf(true);
    const element = document.getElementById('carta-pdf-content');

    if (element) {
      const html2pdf = (await import('html2pdf.js')).default;
      const options = {
        margin: 10,
        filename: `Carta_Presentacion_${formData.rutEmpresa || 'Practica'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().from(element).set(options as any).save().then(() => {
        setLoadingPdf(false);
      }).catch(() => {
        setLoadingPdf(false);
      });
    } else {
      setLoadingPdf(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0f4cff] text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* 1. BLOQUE DE PERFIL DEL ESTUDIANTE */}
        <div className="bg-white/15 backdrop-blur-xl border border-white/25 p-6 md:p-8 rounded-[35px] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-[#ccff00] text-black font-black text-3xl flex items-center justify-center shadow-inner">
              BC
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black"> Mateo Benitez Morales</h1>
              <p className="text-white/80 text-sm">Ingeniería Civil en Computación • Universidad Católica del Maule</p>
              <div className="flex flex-wrap gap-4 mt-2 text-xs font-semibold text-white/70">
                <span>RUT: 20.456.789-K</span>
                <span>•</span>
                <span>b.camela@alumnos.ucm.cl</span>
              </div>
            </div>
          </div>
          <div className="bg-white/20 px-5 py-3 rounded-2xl text-center border border-white/30">
            <p className="text-xs text-white/70 uppercase font-bold">Estado Matrícula</p>
            <p className="text-[#ccff00] font-black text-lg">Activa (Validada)</p>
          </div>
        </div>

        {/* 2. MÉTRICAS RÁPIDAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white text-black p-6 rounded-[30px] shadow-lg">
            <p className="text-xs font-bold text-gray-500 uppercase">Promedio Ponderado</p>
            <p className="text-4xl font-black text-[#0f4cff] mt-1">6.2</p>
            <p className="text-xs text-emerald-600 font-semibold mt-2">↑ Excelente rendimiento</p>
          </div>
          <div className="bg-white text-black p-6 rounded-[30px] shadow-lg">
            <p className="text-xs font-bold text-gray-500 uppercase">Créditos Aprobados</p>
            <p className="text-4xl font-black text-[#0f4cff] mt-1">240 / 300</p>
            <div className="w-full bg-gray-200 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-[#ccff00] h-full w-[80%]"></div>
            </div>
          </div>
          <div className="bg-white text-black p-6 rounded-[30px] shadow-lg">
            <p className="text-xs font-bold text-gray-500 uppercase">Habilitación Vigente</p>
            <p className="text-2xl font-black text-[#0f4cff] mt-1">Disponible: Práctica I</p>
            <p className="text-xs text-amber-600 font-semibold mt-2">Práctica II requiere Práctica I</p>
          </div>
        </div>

        {/* 3. BLOQUES DESPLEGABLES (ACCORDIANS) PARA RAMOS Y GRÁFICOS */}
        <div className="bg-white/15 backdrop-blur-xl border border-white/25 rounded-[35px] p-6 md:p-8 space-y-4 shadow-2xl">
          <h2 className="text-xl font-bold mb-4 text-[#ccff00]">Historial Académico y Rendimiento</h2>

          {/* Desplegable 1: Ramos Aprobados */}
          <div className="border border-white/20 rounded-2xl overflow-hidden">
            <button 
              onClick={() => toggleSection('aprobados')}
              className="w-full flex justify-between items-center p-4 bg-white/5 hover:bg-white/10 transition text-left font-bold cursor-pointer"
            >
              <span>✅ Ramos Aprobados (32 asignaturas)</span>
              <span>{openSection === 'aprobados' ? '▲' : '▼'}</span>
            </button>
            {openSection === 'aprobados' && (
              <div className="p-4 bg-white/5 space-y-2 text-sm border-t border-white/10">
                <div className="flex justify-between py-1 border-b border-white/5"><span>Algoritmos y Estructura de Datos</span><span className="font-bold text-[#ccff00]">Nota: 6.5</span></div>
                <div className="flex justify-between py-1 border-b border-white/5"><span>Arquitectura de Computadores</span><span className="font-bold text-[#ccff00]">Nota: 6.0</span></div>
                <div className="flex justify-between py-1 border-b border-white/5"><span>Bases de Datos Avanzadas</span><span className="font-bold text-[#ccff00]">Nota: 6.8</span></div>
                <div className="flex justify-between py-1"><span>Ingeniería de Software I</span><span className="font-bold text-[#ccff00]">Nota: 6.3</span></div>
              </div>
            )}
          </div>

          {/* Desplegable 2: Ramos por Aprobar */}
          <div className="border border-white/20 rounded-2xl overflow-hidden">
            <button 
              onClick={() => toggleSection('porAprobar')}
              className="w-full flex justify-between items-center p-4 bg-white/5 hover:bg-white/10 transition text-left font-bold cursor-pointer"
            >
              <span>📚 Ramos por Aprobar (8 asignaturas)</span>
              <span>{openSection === 'porAprobar' ? '▲' : '▼'}</span>
            </button>
            {openSection === 'porAprobar' && (
              <div className="p-4 bg-white/5 space-y-2 text-sm border-t border-white/10">
                <div className="flex justify-between py-1 border-b border-white/5"><span>Práctica Profesional I</span><span className="text-[#ccff00] font-semibold">Disponible para cursar</span></div>
                <div className="flex justify-between py-1 border-b border-white/5"><span>Práctica Profesional II</span><span className="text-gray-300">Bloqueada (Requiere Práctica I)</span></div>
                <div className="flex justify-between py-1"><span>Memoria de Título / Titulación</span><span className="text-gray-300">Pendiente</span></div>
              </div>
            )}
          </div>

          {/* Desplegable 3: Gráfico de Estadísticas por Semestre */}
          <div className="border border-white/20 rounded-2xl overflow-hidden">
            <button 
              onClick={() => toggleSection('estadisticas')}
              className="w-full flex justify-between items-center p-4 bg-white/5 hover:bg-white/10 transition text-left font-bold cursor-pointer"
            >
              <span>📊 Estadísticas de Rendimiento (Promedios Semestrales)</span>
              <span>{openSection === 'estadisticas' ? '▲' : '▼'}</span>
            </button>
            {openSection === 'estadisticas' && (
              <div className="p-6 bg-white/5 border-t border-white/15">
                <p className="text-xs text-white/70 mb-6">Comparativa de notas promedio obtenidas por semestre académico:</p>
                <div className="flex items-end justify-between h-48 gap-4 pt-6 px-4 border-b border-white/20">
                  <div className="flex flex-col items-center gap-2 flex-1"><span className="text-xs font-bold text-[#ccff00]">5.8</span><div className="w-full bg-[#ccff00]/80 rounded-t-lg h-[58%]"></div><span className="text-[11px] text-white/70">Sem 1</span></div>
                  <div className="flex flex-col items-center gap-2 flex-1"><span className="text-xs font-bold text-[#ccff00]">6.0</span><div className="w-full bg-[#ccff00]/80 rounded-t-lg h-[60%]"></div><span className="text-[11px] text-white/70">Sem 2</span></div>
                  <div className="flex flex-col items-center gap-2 flex-1"><span className="text-xs font-bold text-[#ccff00]">6.1</span><div className="w-full bg-[#ccff00]/80 rounded-t-lg h-[61%]"></div><span className="text-[11px] text-white/70">Sem 3</span></div>
                  <div className="flex flex-col items-center gap-2 flex-1"><span className="text-xs font-bold text-[#ccff00]">6.4</span><div className="w-full bg-[#ccff00]/80 rounded-t-lg h-[64%]"></div><span className="text-[11px] text-white/70">Sem 4</span></div>
                  <div className="flex flex-col items-center gap-2 flex-1"><span className="text-xs font-bold text-[#ccff00]">6.2</span><div className="w-full bg-[#ccff00]/80 rounded-t-lg h-[62%]"></div><span className="text-[11px] text-white/70">Sem 5</span></div>
                  <div className="flex flex-col items-center gap-2 flex-1"><span className="text-xs font-bold text-[#ccff00]">6.5</span><div className="w-full bg-[#ccff00]/80 rounded-t-lg h-[65%]"></div><span className="text-[11px] text-white/70">Sem 6</span></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. HISTORIAL Y CONSULTA EN VIVO (Persistencia en Base de Datos) */}
        <div className="bg-white/15 backdrop-blur-xl border border-white/25 rounded-[35px] p-6 md:p-8 space-y-4 shadow-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#ccff00]">Historial y Consulta en Vivo (Almacenamiento Persistente)</h2>
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full">Total Registros: {solicitudesHistorial.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/20 text-white/70">
                  <th className="pb-3">ID Solicitud</th>
                  <th className="pb-3">RUT Empresa</th>
                  <th className="pb-3">Razón Social</th>
                  <th className="pb-3">Tipo</th>
                  <th className="pb-3">Fecha</th>
                  <th className="pb-3">Estado BD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {solicitudesHistorial.map((sol) => (
                  <tr key={sol.id} className="hover:bg-white/5 transition">
                    <td className="py-3 font-mono text-[#ccff00]">{sol.id}</td>
                    <td className="py-3">{sol.rutEmpresa}</td>
                    <td className="py-3">{sol.razonSocial}</td>
                    <td className="py-3">Práctica {sol.tipoPractica}</td>
                    <td className="py-3 text-white/70 text-xs">{sol.fecha}</td>
                    <td className="py-3"><span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full text-xs font-semibold border border-emerald-500/40">{sol.estado}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. BLOQUE DE GENERACIÓN DE CARTA Y VALIDACIÓN REGLA A-03 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/15 backdrop-blur-xl border border-white/25 p-6 md:p-8 rounded-[35px] shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-[#ccff00]">Gestión de Carta de Práctica</h2>
            
            {errorMessage && (
              <div className="mb-4 bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-2xl text-sm font-semibold">
                ⚠️ {errorMessage}
              </div>
            )}

            <form onSubmit={handleCartaSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">RUT Empresa</label>
                <input 
                  type="text" 
                  value={formData.rutEmpresa}
                  onChange={(e) => setFormData({...formData, rutEmpresa: e.target.value})}
                  placeholder="76.123.456-K" 
                  className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-2.5 text-white placeholder-white/40 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Razón Social</label>
                <input 
                  type="text" 
                  value={formData.razonSocial}
                  onChange={(e) => setFormData({...formData, razonSocial: e.target.value})}
                  placeholder="Empresa SpA" 
                  className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-2.5 text-white placeholder-white/40 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Correo Supervisor</label>
                <input 
                  type="email" 
                  value={formData.correoSupervisor}
                  onChange={(e) => setFormData({...formData, correoSupervisor: e.target.value})}
                  placeholder="supervisor@empresa.cl" 
                  className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-2.5 text-white placeholder-white/40 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Tipo de Práctica (Evaluación de Regla)</label>
                <select 
                  value={formData.tipoPractica}
                  onChange={(e) => setFormData({...formData, tipoPractica: e.target.value})}
                  className="w-full bg-blue-900 border border-white/30 rounded-xl px-4 py-2.5 text-white focus:outline-none"
                >
                  <option value="I">Práctica I (Disponible)</option>
                  <option value="II">Práctica II (Prueba de rechazo / Bloqueada)</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-[#ccff00] text-black font-bold py-3.5 rounded-xl hover:bg-[#b3e600] transition shadow-lg cursor-pointer">
                Validar, Persistir y Generar Carta
              </button>
            </form>
          </div>

          {/* Vista previa de la carta generada */}
          <div className="bg-white text-black p-6 md:p-8 rounded-[35px] shadow-2xl flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-4 text-[#0f4cff]">Documento Oficial</h2>
              
              <div id="carta-pdf-content" style={{ backgroundColor: '#ffffff', color: '#000000', padding: '16px' }}>
                {cartaGenerada ? (
                  <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', padding: '16px', borderRadius: '12px' }} className="space-y-3 text-sm">
                    <p><strong>Estimado/a Supervisor/a ({formData.correoSupervisor}):</strong></p>
                    <p>Por medio de la presente, la Universidad Católica del Maule certifica que nuestro estudiante <strong>Mateo Benitez Morales</strong> (RUT: 20.456.789-K) cumple con matrícula activa y se encuentra habilitado para cursar la <strong>Práctica {formData.tipoPractica}</strong> en vuestra institución <strong>{formData.razonSocial}</strong> (RUT: {formData.rutEmpresa}).</p>
                    <p>Quedamos a su entera disposición para coordinar la cobertura de seguro escolar requerida.</p>
                    <p style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb', fontSize: '11px', color: '#6b7280' }}>Documento oficial generado digitalmente bajo la pasarela de validación curricular.</p>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm italic py-10 text-center">Completa el formulario y haz clic en validar para persistir la solicitud en la base de datos y generar tu carta.</p>
                )}
              </div>
            </div>

            {cartaGenerada && (
              <button 
                onClick={handleDownloadPdf} 
                disabled={loadingPdf}
                className="mt-6 w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                {loadingPdf ? 'Generando PDF...' : 'Descargar Carta PDF Oficial'}
              </button>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}