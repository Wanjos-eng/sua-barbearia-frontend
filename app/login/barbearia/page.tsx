"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock } from 'lucide-react';
import { authService } from '@/services/authService';

// Componente principal da página de login
export default function LoginPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'barbearia' | 'barbeiro'>('barbearia');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Função para lidar com o envio do formulário
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (activeTab === 'barbearia') {
                // Assuming endpoint for barbearia login
                await authService.loginBarberShop({ email, senha: password });
                router.push('/dashboard/barbearia');
            } else {
                // Assuming endpoint for barbeiro login
                await authService.loginBarber({ email, senha: password });
                router.push('/dashboard/barbeiro');
            }
        } catch (err: any) {
            if (err instanceof Error) {
                setError(err.message);
            } else if (typeof err === 'object' && err !== null && 'message' in err) {
                setError((err as { message: string }).message);
            } else {
                setError('Erro ao realizar login');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        //Container principal da página
        <div className="flex min-h-screen w-full items-center justify-center bg-black p-4">
            {/* Card de Login */}
            <div className="w-full max-w-md rounded-lg bg-[#151515] p-8 shadow-2x1">
                {/* Cabeçalho com Logo e Título */}
                <div className="mb-8 flex flex-col items-center">
                    {/*<BarberPoleIcon className="h-16 w-16 text-[#B4654A]"/>*/}
                    <h1 className="mt-4 text-3xl font-bold text-[#DDDBCB]">Login</h1>
                </div>

                {/* Seletor de Tabs (Barbearia / Barbeiro) */}
                <div className="mb-6 flex rounded-lg bg-black p-1">
                    <button
                        type="button"
                        onClick={() => setActiveTab('barbearia')}
                        className={`w-1/2 rounded-md py-2.5 text-sm font-medium transition-colors ${activeTab === 'barbearia'
                                ? 'bg-[#58BEC3] text-[#151515]'
                                : 'hover:text-[#AAAAAA] hover:bg-[#292929] text-[#5c5c5c]'
                            }`}
                    >Barbearia</button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('barbeiro')}
                        className={`w-1/2 rounded-md py-2.5 text-sm font-medium transition-colors ${activeTab === 'barbeiro'
                                ? 'bg-[#58BEC3] text-[#151515] shadow'
                                : 'hover:text-[#AAAAAA] hover:bg-[#292929] text-[#5c5c5c]'
                            }`}>
                        Barbeiro
                    </button>
                </div>

                {/* Formulário de Login */}
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {error && (
                            <div className="text-red-500 text-sm text-center bg-red-100/10 p-2 rounded">
                                {error}
                            </div>
                        )}

                        {/* Campo de Email */}
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#DDDBCB]"
                                aria-hidden="true" />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                required
                                className="w-full rounded-lg border border-[#5c5c5c] bg-[#151515] p-3 pl-10 text-[#DDDBCB] placeholder-[#5c5c5c] transition-all focus:border-[#58BEC3] focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>

                        {/* Campo de Senha */}
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#DDDBCB]"
                                aria-hidden="true" />
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Senha"
                                required
                                className="w-full rounded-lg border border-[#5c5c5c] bg-[#151515] p-3 pl-10 text-[#DDDBCB] placeholder-[#5c5c5c] transition-all focus:border-[#58BEC3] focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="mt-10 flex items-center justify-between">
                        <button
                            type="button" // Botão de "Cadastrar" (tipo button para não enviar o form)
                            className="text-sm font-medium rounded-md p-3 text-[#5c5c5c] transition-colors hover:text-[#58BEC3] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                            Cadastrar
                        </button>

                        <button
                            type="submit" // Botão "Entrar" (tipo submit para enviar o form)
                            disabled={loading}
                            className="rounded-lg bg-[#58BEC3] px-8 py-3 text-sm font-semibold text-[#151515] transition-transform hover:scale-105 hover:bg-[#58BEC3] focus:outline-none focus:ring-2 focus:ring-[#58BEC3] focus:ring-offset-2 focus:ring-offset-[#5c5c5c] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}