"use client";
import React, { useState } from 'react';

import {User, Mail, Phone, Lock} from 'lucide-react';

// Definindo os tipos para o estado do formulário
interface FormData{
    nome: string;
    email: string;
    telefone: string;
    senha: string;
    confirmarSenha: string;
}



/**
 * Componente de ícone para o input, para evitar repetição
 */
const InputIcon = ({ children }: { children: React.ReactNode }) => (
  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#DDDBCB]">
    {children}
  </span>
);

// Componente principal da aplicação
export default function RegisterCliente(){

    // Estado para controlar os dados do formulário
    const [formData, setFormData] = useState<FormData>({
        nome: '',
        email: '',
        telefone: '',
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
        // Adicionar lógida de validação
    }

    // Estilos comuns para os inputs
    const inputBaseStyle = "w-full rounded-lg border border-[#5c5c5c] bg-[#151515] p-3 pl-10 text-[#DDDBCB] placeholder-[#5c5c5c] transition-all focus:border-[#58BEC3] focus:outline-none focus:ring-2 focus:ring-[#58BEC3] duration-300";

    return (
        // Container Principal
        <main className="min-h-screen w-full bg-black flex items-center justify-center p-4 font-sans">
            {/* Card do formulário: responsivo, largura máxima no desktop */}
            <div className="w-full max-w-md bg-[#151515] rounded-lg shadow-2x1 p-8 md:p-8">
            
                {/* Título do formulário */}
                <h1 className="text-3xl md:text-3x1 font-bold text-[#DDDBCB] text-center mb-6">
                    Registre-se
                </h1>

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
                        className="w-full bg-[#58BEC3] text-[#151515] font-semibold py-3 px-4 rounded-lg transition-colors duration-300 hover:bg-[#58BEC3] focus:outline-none focus:ring-2 focus:ring-[#58BEC3] focus:ring-offset-2 focus:ring-offset-[#5c5c5c] mt-6"
                    >
                        Registrar
                    </button>
                </form>
            </div>
        </main>
    )
}