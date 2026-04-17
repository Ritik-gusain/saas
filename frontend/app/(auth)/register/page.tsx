"use client";
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold mb-6 text-center text-slate-900">Create your account</h2>
          {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
          <form onSubmit={handleRegister} className="space-y-5">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button type="submit" className="w-full py-2.5">Sign Up</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
