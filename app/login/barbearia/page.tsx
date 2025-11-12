import React, { act, useState } from 'react';

import {Mail, Lock} from 'lucide-react';

// Componente ícone customizado
// Alterar para a logo do projeto
const BarberPoleIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Logo Barbearia</title>
    <path d="M12 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2" />
    <path d="M12 22a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2" />
    <path d="M10 4V2" />
    <path d="M14 4V2" />
    <path d="M10 22v-2" />
    <path d="M14 22v-2" />
    <path d="M10 6h4" />
    <path d="M10 10h4" />
    <path d="M10 14h4" />
    <path d="M10 18h4" />
    <path d="m14 6-4 4" />
    <path d="m14 14-4 4" />
  </svg>
);

// Componente principal da página de login
export default function LoginPage(){
    const [activeTab, setActiveTab] = useState<'barbearia' | 'barbeiro'>('barbearia');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Função para lidar com o envio do formulário
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aqui adicionará a lógica de autenticação
        console.log({
            role: activeTab,
            email,
            password,
        });

    };

    return(
        //Container principal da página
        <div className="flex min-h-screen w-full items-center justify-center bg-black p-4">
            {/* Card de Login */}
            <div className="w-full max-w-md rounded-2x1 bg-[#151515] p-8 shadow-2x1">
                {/* Cabeçalho com Logo e Título */}
                <div className="mb-8 flex flex-col items-center">
                    <BarberPoleIcon className="h-16 w-16 text-[#B4654A]"/>
                    <h1 className="mt-4 text-4x1 font-bold text-[#DDDBCB]">Login</h1>
                </div>

                {/* Seletor de Tabs (Barbearia / Barbeiro) */}
                <div className="mb-8 flex rounded-lg bg-gray-800 p-1">
                    <button
                        type="button"
                        onClick={() => setActiveTab('barbearia')}
                        className={`w-1/2 rounded-md py-2.5 text-sm font-medium transition-colors ${
                            activeTab === 'barbearia'
                                ? 'bg-[#B4654A] text-white'
                                : 'hover:text-gray-100 hover:bg-gray-700 text-gray-400'
                        }`}
                    >Barbearia</button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('barbeiro')}
                        className={`w-1/2 rounded-md py-2.5 text-sm font-medium transition-colors ${
                            activeTab === 'barbeiro'
                                ? 'bg-[#B4654A] text-white shadow'
                                : 'text-gray-400 hover:bg-gray-700 hover:text-gray-100'
                        }`}>
                            Barbeiro
                        </button>
                </div>

                {/* Formulário de Login */}
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">

                        {/* Campo de Email */}
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
                            aria-hidden="true"/>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                required
                                className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 pl-10 text-white placeholder-gray-500 transition-all focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>

                        {/* Campo de Senha */}
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
                            aria-hidden="true"/>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Senha"
                                required
                                className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 pl-10 text-white placeholder-gray-500 transition-all focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                    </div>

                    
                </form>
            </div>
        </div>
    );

}