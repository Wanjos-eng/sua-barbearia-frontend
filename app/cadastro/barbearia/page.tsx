"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, MapPin, Building, FileText } from 'lucide-react';
import { authService } from '@/services/authService';
import { ApiError } from '@/types/api';

// Definindo os tipos para o estado do formulário
interface FormData {
    nome: string;
    email: string;
    telefone: string;
    nomeFantasia: string;
    tipoDocumento: 'CPF' | 'CNPJ';
    documento: string;
    endereco: string;
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
export default function RegisterBarbPage() {
    const router = useRouter();
    // Estado para controlar os dados do formulário
    const [formData, setFormData] = useState<FormData>({
        nome: '',
        email: '',
        telefone: '',
        nomeFantasia: '',
        tipoDocumento: 'CPF',
        documento: '',
        endereco: '',
        senha: '',
        confirmarSenha: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Component to display error messages in a styled alert
    const ErrorAlert = ({ message }: { message: string }) => (
        <div className="flex items-center gap-2 text-red-500 bg-red-100/10 p-2 rounded mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{message}</span>
        </div>
    );

    // Handler para atualizar o estado do formulário
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value, }));
    }

    // handler para submeter o formulário
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simple client-side validation for required fields
        if (!formData.nome || !formData.email || !formData.telefone || !formData.nomeFantasia ||
            !formData.tipoDocumento || !formData.documento || !formData.endereco ||
            !formData.senha || !formData.confirmarSenha) {
            setError('Preencha todos os campos obrigatórios.');
            setLoading(false);
            return;
        }

        // Validate password match
        if (formData.senha !== formData.confirmarSenha) {
            setError('As senhas não coincidem');
            setLoading(false);
            return;
        }

        // Build payload (backend expects confirmarSenha)
        const payload = {
            nome: formData.nome,
            email: formData.email,
            senha: formData.senha,
            confirmarSenha: formData.confirmarSenha,
            telefone: formData.telefone,
            nomeFantasia: formData.nomeFantasia,
            tipoDocumento: formData.tipoDocumento,
            documento: formData.documento,
            endereco: formData.endereco,
        };

        try {
            await authService.registerBarberShop(payload);
            router.push('/login/barbearia');
        } catch (err: unknown) {
            const apiError = err as ApiError;
            const lowerMsg = apiError.message?.toLowerCase() ?? '';
            // Detect duplicate email
            if (lowerMsg.includes('email') && lowerMsg.includes('cadastrado')) {
                const friendlyMsg = 'Este e‑mail já está cadastrado. Por favor, faça login.';
                setError(friendlyMsg);
                setTimeout(() => router.push('/login/barbearia'), 3000);
            }
            // Detect duplicate CNPJ
            else if (lowerMsg.includes('cnpj') && lowerMsg.includes('cadastrado')) {
                const friendlyMsg = 'Este CNPJ já está cadastrado. Por favor, faça login.';
                setError(friendlyMsg);
                setTimeout(() => router.push('/login/barbearia'), 3000);
            }
            else if (apiError.errors) {
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
                setError('Erro ao realizar cadastro');
            }
        } finally {
            setLoading(false);
        }
    };

    // Estilos comuns para os inputs
    const inputBaseStyle = "w-full rounded-lg border border-[#5c5c5c] bg-[#151515] p-3 pl-10 text-[#DDDBCB] placeholder-[#5c5c5c] transition-all focus:border-[#58BEC3] focus:outline-none focus:ring-2 focus:ring-[#58BEC3] duration-300";

    return (
        // Container Principal
        <main className="min-h-screen w-full bg-black flex items-center justify-center p-4 font-sans">
            {/* Card do formulário: responsivo, largura máxima no desktop */}
            <div className="w-full max-w-md bg-[#151515] rounded-lg shadow-2x1 p-8 md:p-8">

                {/* Título do formulário */}
                <h1 className="text-3xl md:text-3x1 font-bold text-[#DDDBCB] text-center mb-6">
                    Registre sua Barbearia
                </h1>


                {/* Formulário */}
                {error && <ErrorAlert message={error} />}
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

                    {/* Campo Nome Fantasia */}
                    <div className="relative">
                        <InputIcon><Building size={18} /></InputIcon>
                        <input
                            type="text"
                            name="nomeFantasia"
                            placeholder="Nome Fantasia"
                            value={formData.nomeFantasia}
                            onChange={handleInputChange}
                            className={inputBaseStyle}
                            required
                        />
                    </div>

                    {/* Seletor Tipo de Documento (CPF / CNPJ) - Sliding Toggle */}
                    <div className="flex mb-4">
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, tipoDocumento: 'CPF' }))}
                            className={`flex-1 py-2 rounded-l-md border border-[#5c5c5c] ${formData.tipoDocumento === 'CPF' ? 'bg-[#58BEC3] text-[#151515]' : 'bg-[#151515] text-[#DDDBCB]'} transition-colors`}
                        >
                            CPF
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, tipoDocumento: 'CNPJ' }))}
                            className={`flex-1 py-2 rounded-r-md border border-[#5c5c5c] ${formData.tipoDocumento === 'CNPJ' ? 'bg-[#58BEC3] text-[#151515]' : 'bg-[#151515] text-[#DDDBCB]'} transition-colors`}
                        >
                            CNPJ
                        </button>
                    </div>

                    {/* Campo Documento (CPF ou CNPJ) */}
                    <div className="relative">
                        <InputIcon><FileText size={18} /></InputIcon>
                        <input
                            type="text"
                            name="documento"
                            placeholder={formData.tipoDocumento === 'CPF' ? 'CPF' : 'CNPJ'}
                            value={formData.documento}
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


                    {/* Campo Endereço */}
                    <div className="relative">
                        <InputIcon><MapPin size={18} /></InputIcon>
                        <input
                            type="text"
                            name="endereco"
                            placeholder="Endereço"
                            value={formData.endereco}
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

                    {/* Error Display */}
                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-100/10 p-2 rounded">
                            {error}
                        </div>
                    )}

                    {/* Botão de Registro */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#58BEC3] text-[#151515] font-semibold py-3 px-4 rounded-lg transition-colors duration-300 hover:bg-[#58BEC3] focus:outline-none focus:ring-2 focus:ring-[#58BEC3] focus:ring-offset-2 focus:ring-offset-[#5c5c5c] mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Registrando...' : 'Registrar'}
                    </button>
                </form>
            </div>
        </main>
    )
}