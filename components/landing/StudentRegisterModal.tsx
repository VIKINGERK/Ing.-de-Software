'use client';

import React, { useState } from 'react';
import { UNIVERSIDADES_CHILE, CARRERAS_DISPONIBLES } from '@/lib/constants/academico';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentRegisterModal({ isOpen, onClose }: RegisterModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    rut: '',
    email: '',
    password: '',
    universidad: UNIVERSIDADES_CHILE[0],
    carrera: CARRERAS_DISPONIBLES[0],
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.rut || !formData.email || formData.password.length < 6) {
      setError('Completa todos los campos (la contraseña debe tener mínimo 6 caracteres).');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'student',
          email: formData.email,
          password: formData.password,
          profileData: {
            full_name: formData.nombre.trim(),
            rut: formData.rut.trim(),
            university: formData.universidad,
            career: formData.carrera,
          },
        }),
      });

      const result = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(result.error || 'Error al registrar estudiante.');
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1800);
    } catch {
      setLoading(false);
      setError('Error de conexión con el servidor.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white text-black rounded-[30px] p-8 w-full max-w-lg shadow-2xl relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-black font-bold text-xl cursor-pointer">✕</button>

        <h2 className="text-2xl font-black mb-1 text-[#0f4cff]">Registro de Estudiante</h2>
        <p className="text-sm text-gray-600 mb-6">Selecciona tu institución y carrera para ver prácticas compatibles.</p>

        {success ? (
          <div className="bg-[#ccff00] text-black p-6 rounded-2xl text-center font-bold">
            ¡Registro exitoso! Ya puedes iniciar sesión.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase mb-1">Nombre Completo</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nicolas Aburto" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#0f4cff]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">RUT</label>
                <input type="text" name="rut" value={formData.rut} onChange={handleChange} placeholder="21.123.456-7" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#0f4cff]" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Contraseña</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Mín. 6 caracteres" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#0f4cff]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Correo Institucional</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="estudiante@universidad.cl" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#0f4cff]" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Universidad / Institución</label>
              <select name="universidad" value={formData.universidad} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#0f4cff] bg-white">
                {UNIVERSIDADES_CHILE.map((uni) => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Carrera</label>
              <select name="carrera" value={formData.carrera} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#0f4cff] bg-white">
                {CARRERAS_DISPONIBLES.map((car) => (
                  <option key={car} value={car}>{car}</option>
                ))}
              </select>
            </div>

            {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

            <button disabled={loading} type="submit" className="w-full bg-[#0f4cff] text-white font-bold py-3.5 rounded-xl hover:bg-[#0b3bcc] transition shadow-lg mt-2 cursor-pointer">
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}