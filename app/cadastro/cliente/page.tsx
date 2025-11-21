"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { registerCliente } from '@/app/services/api';

// Definindo os tipos para o estado do formulário
interface FormData {
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
export default function RegisterCliente() {
  const router = useRouter();
  
  // Estado para controlar os dados do formulário
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
  });
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handler para atualizar o estado do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // handler para submeter o formulário
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validação básica
    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem.');
      setIsLoading(false);
      return;
    }

    try {
      // O endpoint espera 'senha' e não 'confirmarSenha', então removemos
      await registerCliente(formData);
      // Redireciona para a página de login após o sucesso
      router.push('/login/cliente');
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  };

  // Estilos comuns para os inputs
  const inputBaseStyle = "w-full rounded-lg border border-[#5c5c5c] bg-[#151515] p-3 pl-10 text-[#DDDBCB] placeholder-[#5c5c5c] transition-all focus:border-[#B4654A] focus:outline-none focus:ring-2 focus:ring-[#B4654A] duration-300";

  return (
    // Container Principal
    <main className="min-h-screen w-full bg-black flex items-center justify-center p-4 font-sans">
      {/* Card do formulário: responsivo, largura máxima no desktop */}
      <div className="w-full max-w-md bg-[#151515] rounded-lg shadow-2x1 p-8 md:p-8">
        
        {/* Título do formulário */}
        <h1 className="text-3xl md:text-3xl font-bold text-[#DDDBCB] text-center mb-6">
          Registre-se
        </h1>

        {/* Formulário */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Campo Nome */}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
          
          {/* Campo Senha */}
          <div className="relative">
            <InputIcon><Lock size={18} /></InputIcon>
            <input
              type={showPassword ? 'text' : 'password'}
              name="senha"
              placeholder="Senha"
              value={formData.senha}
              onChange={handleInputChange}
              className={inputBaseStyle + " pr-10"}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          {/* Campo Confirmar Senha */}
          <div className="relative">
            <InputIcon><Lock size={18} /></InputIcon>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmarSenha"
              placeholder="Confirmar senha"
              value={formData.confirmarSenha}
              onChange={handleInputChange}
              className={inputBaseStyle + " pr-10"}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* Botão de Registro */}
          <button
            type="submit"
            className="w-full bg-[#B4654A] text-[#151515] font-semibold py-3 px-4 rounded-lg transition-colors duration-300 hover:bg-[#a3593f] focus:outline-none focus:ring-2 focus:ring-[#B4654A] focus:ring-offset-2 focus:ring-offset-[#151515] mt-6 disabled:bg-gray-500 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>
      </div>
    </main>
  );
}