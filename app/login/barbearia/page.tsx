"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';
import { authService } from '@/services/authService';
import { ApiError } from '@/types/api';

// Componente visual de alerta de erro
const ErrorAlert = ({ message }: { message: string }) => (
    <div className="flex items-center gap-2 text-red-500 bg-red-100/10 p-2 rounded mb-4">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{message}</span>
    </div>
);

// Componente principal da página de login
export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Função para lidar com o envio do formulário
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validação cliente: email e senha são obrigatórios
        if (!email || !password) {
            setError('Preencha email e senha para entrar.');
            setLoading(false);
            return;
        }

        try {
            await authService.loginBarberShop({ email, senha: password });
            router.push('/dashboard/barbearia');
        } catch (err: unknown) {
            // Remove noisy console.error
            const apiError = err as ApiError;
            const lowerMsg = apiError.message?.toLowerCase() ?? '';
            if (lowerMsg.includes('email') && lowerMsg.includes('cadastrado')) {
                setError('Este e‑mail já está cadastrado. Por favor, faça login.');
                setTimeout(() => router.push('/login/barbearia'), 3000);
            } else if (lowerMsg.includes('senha') && lowerMsg.includes('incorreta')) {
                setError('Senha incorreta. Verifique e tente novamente.');
            } else if (apiError.errors) {
                const messages = Object.entries(apiError.errors)
                    .map(([field, msgs]) => {
                        const fieldName = field === 'email' ? 'Email' : field === 'senha' ? 'Senha' : field;
                        return `${fieldName}: ${msgs.join(', ')}`;
                    })
                    .join('; ');
                setError(messages || apiError.message);
            } else if (apiError.message) {
                setError(apiError.message);
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Credenciais inválidas');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        //Container principal da página
        <div className="flex min-h-screen w-full items-center justify-center bg-black p-4">
            {/* Card de Login */}
            <div className="bg-[#151515] rounded-[17px] w-full max-w-[468px] h-auto p-8 md:p-10">
                {/* Cabeçalho com Logo e Título */}
                <div className="flex flex-col items-center">
                    <div className="flex flex-row items-center justify-between w-full mb-12">
                            <h1
                                className="text-[#58BEC3] font-bold text-3xl leading-tight"
                            >
                                Sua
                                <br />
                                Barbearia
                            </h1>

                            <div className="text-ms text-[#DDDBCB] font-bold text-right leading-snug">
                                Gerencie a
                                <br />
                                sua barbearia

                            </div>
                    </div>
                </div>

                {/* Formulário de Login */}
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-5">
                        {error && <ErrorAlert message={error} />}

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
                                className="w-full rounded-lg border border-[#5c5c5c] bg-[#151515] py-4 p-3 pl-10 text-[#DDDBCB] placeholder-[#5c5c5c] transition-all focus:border-[#58BEC3] focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                                className="w-full rounded-lg border border-[#5c5c5c] bg-[#151515] py-4 p-3 pl-10 text-[#DDDBCB] placeholder-[#5c5c5c] transition-all focus:border-[#58BEC3] focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="mt-10 flex items-center justify-between">
                        <Link
                            href="/cadastro/barbearia"
                            className="text-ms font-medium rounded-md p-3 text-[#5c5c5c] transition-colors hover:text-[#58BEC3] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                            Cadastrar
                        </Link>

                        <button
                            type="submit" // Botão "Entrar" (tipo submit para enviar o form)
                            disabled={loading}
                            className="rounded-lg bg-[#58BEC3] px-16 py-3 text-ms font-semibold text-[#151515] transition-transform hover:scale-105 hover:bg-[#58BEC3] focus:outline-none focus:ring-2 focus:ring-[#58BEC3] focus:ring-offset-2 focus:ring-offset-[#5c5c5c] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}