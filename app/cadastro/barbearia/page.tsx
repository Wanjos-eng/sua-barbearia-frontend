"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, MapPin, FileText, Building, Eye, EyeOff } from 'lucide-react';
import { registerBarbearia } from '@/app/services/api';
import { RegistroBarbeariaData } from '@/app/services/api';

const InputIcon = ({ children }: { children: React.ReactNode }) => (
  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#DDDBCB]">
    {children}
  </span>
);

export default function RegisterBarbPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<RegistroBarbeariaData>({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: '', // Agora faz parte do formData
        telefone: '',
        nomeFantasia: '',
        tipoDocumento: 'CNPJ', // Default to CNPJ
        documento: '',
        endereco: '',
    });
    // Removemos o estado 'confirmarSenha' separado
    // const [confirmarSenha, setConfirmarSenha] = useState(''); 
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    
    const handleTipoDocumentoChange = (tipo: 'CPF' | 'CNPJ') => {
        setFormData(prev => ({ ...prev, tipoDocumento: tipo, documento: '' })); // Reset document on change
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (formData.senha !== formData.confirmarSenha) { // Comparar com formData.confirmarSenha
            setError('As senhas não coincidem.');
            setIsLoading(false);
            return;
        }

        try {
            await registerBarbearia(formData); // Enviar formData completo
            router.push('/login/barbearia');
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro desconhecido ao registrar a barbearia.');
        } finally {
            setIsLoading(false);
        }
    };

    const inputBaseStyle = "w-full rounded-lg border border-[#5c5c5c] bg-[#151515] p-3 pl-10 text-[#DDDBCB] placeholder-[#5c5c5c] transition-all focus:border-[#58BEC3] focus:outline-none focus:ring-2 focus:ring-[#58BEC3] duration-300 disabled:opacity-50";

    return (
        <main className="min-h-screen w-full bg-black flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-lg bg-[#151515] rounded-lg shadow-2xl p-8 my-8">
                <h1 className="text-3xl md:text-3xl font-bold text-[#DDDBCB] text-center mb-6">
                    Cadastro de Barbearia
                </h1>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <InputIcon><User size={18} /></InputIcon>
                            <input type="text" name="nome" placeholder="Nome do Responsável" value={formData.nome} onChange={handleInputChange} className={inputBaseStyle} required disabled={isLoading} />
                        </div>
                        <div className="relative">
                            <InputIcon><Building size={18} /></InputIcon>
                            <input type="text" name="nomeFantasia" placeholder="Nome Fantasia da Barbearia" value={formData.nomeFantasia} onChange={handleInputChange} className={inputBaseStyle} required disabled={isLoading} />
                        </div>
                         <div className="relative">
                            <InputIcon><Mail size={18} /></InputIcon>
                            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className={inputBaseStyle} required disabled={isLoading} />
                        </div>
                        <div className="relative">
                            <InputIcon><Phone size={18} /></InputIcon>
                            <input type="tel" name="telefone" placeholder="Telefone" value={formData.telefone} onChange={handleInputChange} className={inputBaseStyle} required disabled={isLoading} />
                        </div>
                    </div>
                    
                    <div>
                        <div className="mb-2 flex rounded-lg bg-black p-1">
                            <button type="button" onClick={() => handleTipoDocumentoChange('CNPJ')} className={`w-1/2 rounded-md py-2 text-sm font-medium transition-colors ${formData.tipoDocumento === 'CNPJ' ? 'bg-[#58BEC3] text-[#151515]' : 'text-[#5c5c5c] hover:bg-[#292929]'}`}>CNPJ</button>
                            <button type="button" onClick={() => handleTipoDocumentoChange('CPF')} className={`w-1/2 rounded-md py-2 text-sm font-medium transition-colors ${formData.tipoDocumento === 'CPF' ? 'bg-[#58BEC3] text-[#151515]' : 'text-[#5c5c5c] hover:bg-[#292929]'}`}>CPF</button>
                        </div>
                        <div className="relative">
                            <InputIcon><FileText size={18} /></InputIcon>
                            <input type="text" name="documento" placeholder={formData.tipoDocumento} value={formData.documento} onChange={handleInputChange} className={inputBaseStyle} required disabled={isLoading} />
                        </div>
                    </div>

                    <div className="relative">
                        <InputIcon><MapPin size={18} /></InputIcon>
                        <input type="text" name="endereco" placeholder="Endereço Completo (Rua, N°, Bairro, Cidade/UF)" value={formData.endereco} onChange={handleInputChange} className={inputBaseStyle} required disabled={isLoading} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <InputIcon><Lock size={18} /></InputIcon>
                            <input type={showPassword ? "text" : "password"} name="senha" placeholder="Senha" value={formData.senha} onChange={handleInputChange} className={inputBaseStyle + " pr-10"} required disabled={isLoading} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <div className="relative">
                            <InputIcon><Lock size={18} /></InputIcon>
                            <input type={showConfirmPassword ? "text" : "password"} name="confirmarSenha" placeholder="Confirmar senha" value={formData.confirmarSenha} onChange={handleInputChange} className={inputBaseStyle + " pr-10"} required disabled={isLoading} />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && (<p className="text-red-500 text-sm text-center">{error}</p>)}

                    <button type="submit" className="w-full bg-[#58BEC3] text-[#151515] font-semibold py-3 px-4 rounded-lg transition-colors duration-300 hover:bg-[#4aa0a5] focus:outline-none focus:ring-2 focus:ring-[#58BEC3] focus:ring-offset-2 focus:ring-offset-[#151515] mt-6 disabled:bg-gray-500 disabled:cursor-not-allowed" disabled={isLoading}>
                        {isLoading ? 'Registrando...' : 'Registrar Barbearia'}
                    </button>
                </form>
            </div>
        </main>
    )
}