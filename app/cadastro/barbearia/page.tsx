"use client";
import React, { useState } from 'react';

import {User, Mail, Phone, Lock, MapPin} from 'lucide-react';

// Definindo os tipos para o estado do formulário
interface FormData{
    nome: string;
    email: string;
    telefone: string;
    endereco?: string; // como opcional
    senha: string;
    confirmarSenha: string;
}

// Definindo o tipo de usuário
type UserType = 'barbearia' | 'barbeiro';

/**
 * Componente de ícone para o input, para evitar repetição
 */
const InputIcon = ({ children }: { children: React.ReactNode }) => (
  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
    {children}
  </span>
);

// Componente principal da aplicação
export default function RegisterBarbPage(){
    // Estado para controlar o tipo de usuario
    const [userType, setUserType] = useState<UserType>('barbearia');

    // Estado para controlar os dados do formulário
    const [formData, setFormData] = useState<FormData>({
        nome: '',
        email: '',
        telefone: '',
        endereco: '',
        senha: '',
        confirmarSenha: '',
    });

    // Hangler para atualizar o estado do formulário
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value,}));

    }

    // handler para submeter o formulário
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Aqui adiciona-se a lógica de envio
        console.log('Dados do formulário: ', formData);
        console.log('Tipo de usuário: ', userType);
        // Adicionar lógida de validação
    }

    // Estilos comuns para os inputs
    const inputBaseStyle = "w-full bg-gray-800 border border-cyan-600 rounded-lg py-3 pl-10 pr-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300";

    return (
        // Container Principal
        <main className="min-h-screen w-full bg-black flex items-center justify-center p-4 font-sans">
            {/* Card do formulário: responsivo, largura máxima no desktop */}
            <div className="w-full max-w-md bg-gray-900 rounded-2x1 shadow-2x1 shadow-cyan-900/20 p-6 md:p-8">
            
                {/* Título do formulário */}
                <h1 className="text-2x1 md:text-3x1 font-bold text-[#DDDBCB] text-center mb-6">
                    Registre-se
                </h1>

                {/* Seletor de Tipo de Usuário (Tabs) */}
                <div className="flex bg-gray-800 rounded-lg p-1 mb-6">
                    <button
                        type="button"
                        onClick={() => setUserType('barbearia')}
                        className={`w-1/2 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-300
                            ${userType === 'barbearia'
                                ? 'bg-cyan-500 text-gray-900 shadow-md'
                                : 'text-gray-400 hover:text-white'
                            }
                        `}
                    >
                        Barbearia
                    </button>
                    <button
                        type="button"
                        onClick={() => setUserType('barbeiro')}
                        className={`w-1/2 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-300
                            ${userType === 'barbeiro'
                                ? 'bg-cyan-500 text-gray-900 shadow-md'
                                : 'text-gray-400 hover:text-white'
                            }
                        `}
                    >
                        Barbeiro
                    </button>
                </div>

                {/* Formulário */}
                <form className="space-y-4" onSubmit={handleSubmit}>

                    {/*Campo Nome*/}
                    <div className="relative">
                        <InputIcon><User size={18} /></InputIcon>
                        <input
                            type="text"
                            name="nome"
                            placeholder="Nome"
                            value={formData.nome}
                            onChange={handleInputChange}
                            className={inputBaseStyle}
                            required 
                        />
                    </div>

                    {/* Campo Email */}
                    <div className="relative">
                        <InputIcon><Mail size={18} /></InputIcon>
                        <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={inputBaseStyle}
                        required
                        />
                    </div>
                    
                    {/* Campo Telefone */}
                    <div className="relative">
                        <InputIcon><Phone size={18} /></InputIcon>
                        <input
                        type="tel"
                        name="telefone"
                        placeholder="Telefone"
                        value={formData.telefone}
                        onChange={handleInputChange}
                        className={inputBaseStyle}
                        required
                        />
                    </div>
                    
                    {/* Campo Endereço (Condicional) */}
                    {userType === 'barbearia' && (
                        <div className="relative">
                        <InputIcon><MapPin size={18} /></InputIcon>
                        <input
                            type="text"
                            name="endereco"
                            placeholder="Endereço"
                            value={formData.endereco}
                            onChange={handleInputChange}
                            className={inputBaseStyle}
                            required // Só é obrigatório se for barbearia
                        />
                        </div>
                    )}

                    {/* Campo Senha */}
                    <div className="relative">
                        <InputIcon><Lock size={18} /></InputIcon>
                        <input
                        type="password"
                        name="senha"
                        placeholder="Senha"
                        value={formData.senha}
                        onChange={handleInputChange}
                        className={inputBaseStyle}
                        required
                        />
                    </div>
                    
                    {/* Campo Confirmar Senha */}
                    <div className="relative">
                        <InputIcon><Lock size={18} /></InputIcon>
                        <input
                        type="password"
                        name="confirmarSenha"
                        placeholder="Confirmar senha"
                        value={formData.confirmarSenha}
                        onChange={handleInputChange}
                        className={inputBaseStyle}
                        required
                        />
                    </div>

                    {/* Botão de Registro */}
                    <button
                        type="submit"
                        className="w-full bg-cyan-500 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors duration-300 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 mt-6"
                    >
                        Registrar
                    </button>
                </form>
            </div>
        </main>
    )
}