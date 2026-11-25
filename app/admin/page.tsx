'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function AdminPage() {
  const supabase = createClient();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchCompanies = async () => {
    setLoading(true);
    setErrorMsg('');
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setErrorMsg(error.message);
    }
    setCompanies(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase.from('companies').update({ status }).eq('id', id);
    if (error) {
      alert('Error al actualizar estado: ' + error.message);
      return;
    }
    fetchCompanies();
  };

  return (
    <main className="min-h-screen bg-[#0f4cff] text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white/15 backdrop-blur-xl border border-white/25 p-6 rounded-[30px]">
          <div>
            <h1 className="text-2xl font-black text-[#ccff00]">Panel de Coordinación</h1>
            <p className="text-sm text-white/80">Validación y aprobación de empresas colaboradoras</p>
          </div>
          <Link href="/" className="bg-white text-black font-bold px-5 py-2.5 rounded-full text-sm hover:bg-[#ccff00] transition">
            Volver al Inicio
          </Link>
        </div>

        <div className="bg-white text-black rounded-[30px] p-6 md:p-8 shadow-2xl">
          <h2 className="text-xl font-black mb-4 text-[#0f4cff]">Solicitudes de Empresas ({companies.length})</h2>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-semibold mb-4">
              Error Supabase: {errorMsg}
            </div>
          )}

          {loading ? (
            <p className="text-gray-500 py-8 text-center">Cargando empresas...</p>
          ) : companies.length === 0 ? (
            <p className="text-gray-500 py-8 text-center">No hay empresas registradas aún.</p>
          ) : (
            <div className="space-y-4">
              {companies.map((comp) => (
                <div key={comp.id} className="border border-gray-200 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-black text-lg">{comp.razon_social}</h3>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        comp.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        comp.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {comp.status === 'approved' ? 'Aprobada' : comp.status === 'rejected' ? 'Rechazada' : 'Pendiente'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      RUT: {comp.rut_empresa} • Contacto: {comp.correo_contacto} {comp.telefono && `• Tel: ${comp.telefono}`}
                    </p>
                    {comp.descripcion && <p className="text-sm text-gray-700 mt-2">{comp.descripcion}</p>}
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => updateStatus(comp.id, 'approved')}
                      className="bg-[#ccff00] hover:bg-[#b3e600] text-black font-bold px-4 py-2 rounded-xl text-sm cursor-pointer"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => updateStatus(comp.id, 'rejected')}
                      className="bg-red-100 hover:bg-red-200 text-red-700 font-bold px-4 py-2 rounded-xl text-sm cursor-pointer"
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}