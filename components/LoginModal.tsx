'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rut || !password) {
      setError('Ingresa tu RUT y contraseña.');
      return;
    }
    // Simulación de autenticación exitosa hacia /estudiante
    router.push('/estudiante');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white text-black rounded-[30px] p-8 w-full max-w-md shadow-2xl relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-black font-bold text-xl">✕</button>

        <h2 className="text-2xl font-black mb-1 text-[#0f4cff]">Acceso Estudiantes</h2>
        <p className="text-sm text-gray-600 mb-6">Ingresa con tus credenciales institucionales.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-1">RUT</label>
            <input type="text" value={rut} onChange={(e) => setRut(e.target.value)} placeholder="21.123.456-7" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0f4cff]" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase mb-1">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0f4cff]" />
          </div>
          {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}
          <button type="submit" className="w-full bg-[#ccff00] text-black font-bold py-3.5 rounded-xl hover:bg-[#b3e600] transition shadow-lg mt-2">
            Ingresar al Panel
          </button>
        </form>
      </div>
    </div>
  );
}