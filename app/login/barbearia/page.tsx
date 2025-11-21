"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { loginBarbearia } from '@/app/services/api';

// Componente principal da página de login
export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Função para lidar com o envio do formulário
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const data = await loginBarbearia({ email, senha: password });
            login(data); // O contexto gerencia o estado e o redirecionamento
        } catch (err: any) {
            setError(err.message || "Email ou senha incorretos.");
            setIsLoading(false);
        }
    };

    return(
        <div className="flex min-h-screen w-full items-center justify-center bg-black p-4">
            <div className="w-full max-w-md rounded-lg bg-[#151515] p-8 shadow-2xl">
                <div className="mb-8 flex flex-col items-center">
                    <h1 className="mt-4 text-3xl font-bold text-[#DDDBCB]">Login da Barbearia</h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#DDDBCB]" aria-hidden="true" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                required
                                disabled={isLoading}
                                className="w-full rounded-lg border border-[#5c5c5c] bg-[#151515] p-3 pl-10 text-[#DDDBCB] placeholder-[#5c5c5c] transition-all focus:border-[#58BEC3] focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#DDDBCB]" aria-hidden="true" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Senha"
                                required
                                disabled={isLoading}
                                className="w-full rounded-lg border border-[#5c5c5c] bg-[#151515] p-3 pl-10 text-[#DDDBCB] placeholder-[#5c5c5c] transition-all focus:border-[#58BEC3] focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p className="mt-4 text-center text-sm text-red-500">{error}</p>
                    )}

                    <div className="mt-10 flex items-center justify-between">
                        <Link
                            href="/cadastro/barbearia"
                            className={`text-sm font-medium rounded-md p-3 text-[#5c5c5c] transition-colors hover:text-[#58BEC3] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            Cadastrar
                        </Link>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="rounded-lg bg-[#58BEC3] px-8 py-3 text-sm font-semibold text-[#151515] transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#58BEC3] focus:ring-offset-2 focus:ring-offset-[#151515] disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}