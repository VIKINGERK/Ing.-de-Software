'use client';

import React, { useState } from 'react';

interface PracticeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PracticeFormModal({ isOpen, onClose }: PracticeFormModalProps) {
  const [formData, setFormData] = useState({
    rutEmpresa: '',
    razonSocial: '',
    correoSupervisor: '',
    tipoPractica: 'I',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState(false);

  if (!isOpen) return null;

  // Validación básica de RUT chileno (ejemplo simple de estructura XX.XXX.XXX-X o XXXXXXXX-X)
  const validarRut = (rut: string) => {
    const cleanRut = rut.replace(/^0+|[^0-9kK]/g, '').toUpperCase();
    if (cleanRut.length < 8) return false;
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Limpiar error contextual al escribir
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!formData.rutEmpresa.trim()) {
      newErrors.rutEmpresa = 'El RUT de la empresa es obligatorio.';
    } else if (!validarRut(formData.rutEmpresa)) {
      newErrors.rutEmpresa = 'Formato de RUT inválido.';
    }

    if (!formData.razonSocial.trim()) {
      newErrors.razonSocial = 'La Razón Social es obligatoria.';
    }

    if (!formData.correoSupervisor.trim()) {
      newErrors.correoSupervisor = 'El correo del supervisor es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(formData.correoSupervisor)) {
      newErrors.correoSupervisor = 'El correo electrónico no es válido.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Si es válido, despachamos el payload (aquí simularíamos la conexión a Supabase o API)
    const payload = {
      ...formData,
      fechaSolicitud: new Date().toISOString(),
    };

    console.log('Payload despachado al servicio de validación:', payload);
    setSuccessMessage(true);

    setTimeout(() => {
      setSuccessMessage(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white text-black rounded-[30px] p-8 w-full max-w-lg shadow-2xl relative animate-fadeIn">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-black font-bold text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-black mb-1 text-[#0f4cff]">Solicitud de Práctica</h2>
        <p className="text-sm text-gray-600 mb-6">Ingresa los datos para iniciar tu carta de presentación.</p>

        {successMessage ? (
          <div className="bg-[#ccff00] text-black p-6 rounded-2xl text-center font-bold">
            ¡Formulario válido! Payload despachado correctamente con éxito.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase mb-1">RUT de Empresa</label>
              <input 
                type="text" 
                name="rutEmpresa"
                placeholder="Ej: 76.123.456-K"
                value={formData.rutEmpresa}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0f4cff]"
              />
              {errors.rutEmpresa && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.rutEmpresa}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Razón Social</label>
              <input 
                type="text" 
                name="razonSocial"
                placeholder="Ej: Innovación SpA"
                value={formData.razonSocial}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0f4cff]"
              />
              {errors.razonSocial && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.razonSocial}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Correo del Supervisor</label>
              <input 
                type="email" 
                name="correoSupervisor"
                placeholder="supervisor@empresa.cl"
                value={formData.correoSupervisor}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0f4cff]"
              />
              {errors.correoSupervisor && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.correoSupervisor}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Tipo de Práctica</label>
              <select 
                name="tipoPractica"
                value={formData.tipoPractica}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0f4cff] bg-white"
              >
                <option value="I">Práctica I</option>
                <option value="II">Práctica II</option>
              </select>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#0f4cff] text-white font-bold py-3.5 rounded-xl hover:bg-[#0b3bcc] transition shadow-lg mt-2"
            >
              Enviar Solicitud
            </button>
          </form>
        )}
      </div>
    </div>
  );
}