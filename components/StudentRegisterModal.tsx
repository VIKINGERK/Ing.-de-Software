'use client';

import React, { useState } from 'react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentRegisterModal({ isOpen, onClose }: RegisterModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    rut: '',
    email: '',
    universidad: 'Universidad Católica del Maule (UCM)',
    carrera: 'Ingeniería Civil en Computación',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.rut || !formData.email) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white text-black rounded-[30px] p-8 w-full max-w-lg shadow-2xl relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-black font-bold text-xl">✕</button>

        <h2 className="text-2xl font-black mb-1 text-[#0f4cff]">Registro de Estudiante</h2>
        <p className="text-sm text-gray-600 mb-6">Regístrate para gestionar tus prácticas profesionales.</p>

        {success ? (
          <div className="bg-[#ccff00] text-black p-6 rounded-2xl text-center font-bold">
            ¡Registro exitoso! Ya puedes iniciar sesión.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase mb-1">Nombre Completo</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nicolas Aburto" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0f4cff]" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-1">RUT</label>
              <input type="text" name="rut" value={formData.rut} onChange={handleChange} placeholder="21.123.456-7" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0f4cff]" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-1">Correo Institucional</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="estudiante@ucm.cl" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0f4cff]" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-1">Universidad</label>
              <select name="universidad" value={formData.universidad} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0f4cff] bg-white">
                <option value="Universidad Católica del Maule (UCM)">Universidad Católica del Maule (UCM)</option>
                <option value="Universidad de Talca">Universidad de Talca</option>
                <option value="Universidad Técnica Federico Santa María">Universidad Técnica Federico Santa María</option>
              </select>
            </div>
            {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}
            <button type="submit" className="w-full bg-[#0f4cff] text-white font-bold py-3.5 rounded-xl hover:bg-[#0b3bcc] transition shadow-lg mt-2">
              Registrarse
            </button>
          </form>
        )}
      </div>
    </div>
  );
}