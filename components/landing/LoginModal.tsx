'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const supabase = createClient();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Ingresa tu correo o RUT y contraseña.');
      return;
    }

    setLoading(true);
    setError('');

    let emailToUse = identifier.trim();

    if (!emailToUse.includes('@')) {
      const { data: profileByRut } = await supabase
        .from('profiles')
        .select('email')
        .eq('rut', emailToUse)
        .single();

      if (!profileByRut?.email) {
        setError('No se encontró una cuenta asociada a ese RUT.');
        setLoading(false);
        return;
      }
      emailToUse = profileByRut.email;
    }

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: emailToUse,
      password,
    });

    if (authError || !data.user) {
      setError('Credenciales incorrectas o usuario no encontrado.');
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    setLoading(false);
    if (profile?.role === 'company') {
      router.push('/empresa');
    } else if (profile?.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/estudiante');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white text-black rounded-[30px] p-8 w-full max-w-md shadow-2xl relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-black font-bold text-xl cursor-pointer">✕</button>

        <h2 className="text-2xl font-black mb-1 text-[#0f4cff]">Iniciar Sesión</h2>
        <p className="text-sm text-gray-600 mb-6">Accede como Estudiante, Empresa o Coordinación.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-1">Correo o RUT</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="correo@ucm.cl o 21.123.456-7"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0f4cff]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0f4cff]"
            />
          </div>
          {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}
          <button disabled={loading} type="submit" className="w-full bg-[#ccff00] text-black font-bold py-3.5 rounded-xl hover:bg-[#b3e600] transition shadow-lg mt-2 cursor-pointer">
            {loading ? 'Ingresando...' : 'Ingresar al Portal'}
          </button>
        </form>
      </div>
    </div>
  );
}