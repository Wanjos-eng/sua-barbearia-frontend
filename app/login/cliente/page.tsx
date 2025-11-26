"use client";

import { Mail, Lock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import loginIcon from '@/assets/LoginCliente/icone-logo-suabarbearia-Login.png';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';


export default function LoginClientePage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Tentando fazer login...');
      const response = await authService.loginClient({ email, senha });
      console.log('Login bem-sucedido:', response);

      // Verificar se realmente recebeu o token
      if (response.token) {
        console.log('Token recebido, redirecionando...');
        router.push('/dashboard/cliente');
      } else {
        console.error('Resposta sem token:', response);
        setError('Erro: Resposta inválida do servidor');
        setLoading(false);
      }
    } catch (err: unknown) {
      console.error('Erro no login:', err);

      // Handle ApiError with field-specific errors
      const apiError = err as import('@/types/api').ApiError;
      if (apiError.errors) {
        // Format field-specific errors
        const messages = Object.entries(apiError.errors)
          .map(([field, msgs]) => {
            const fieldName = field === 'email' ? 'Email' : field === 'senha' ? 'Senha' : field;
            return `${fieldName}: ${msgs.join(', ')}`;
          })
          .join('; ');
        setError(messages || apiError.message);
      } else if (apiError.message) {
        // Show specific API error message
        setError(apiError.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao realizar login. Verifique suas credenciais.');
      }
      setLoading(false);
    }
  };

  return (
    <>
      {/* 1. Imagem de Fundo (em tela cheia, fixa e atrás de tudo) */}
      {/* 
        [IMAGEM DE FUNDO REMOVIDA TEMPORARIAMENTE]
        O código da imagem de fundo foi comentado para evitar que a aplicação quebre,
        já que o arquivo '/fundo-barbearia.jpg' não foi encontrado.

        Para reativar, adicione a imagem de fundo à sua pasta 'public' e descomente o bloco abaixo.
      */}
      {/* <div className="fixed inset-0 z-[-1]">
        <Image
          // SUBSTITUA pelo caminho da sua imagem de fundo
          src="/fundo-barbearia.jpg" 
          alt="Fundo de uma barbearia com barbeiros trabalhando"
          fill={true}
          className="object-cover blur-sm brightness-75"
          priority
        />
      </div> */}
      <div className="fixed inset-0 z-[-1] bg-black"></div>

      {/* 2. Container de Centralização */}
      <main className="min-h-screen flex items-center justify-center p-4">

        {/* 3. O Card Preto Sólido (Corrigido para ser responsivo) */}
        <div
          className="bg-[#151515] rounded-[17px] w-full max-w-[468px] h-auto p-8 md:p-10"
        >
          <form className="flex flex-col gap-8" onSubmit={handleSubmit}>

            {/* Seção 1: Cabeçalho (Agrupados) */}
            <div className="flex flex-col items-center">
              {/* Sub-Header: Icone + "Cliente" */}
              <div className="flex flex-row items-center justify-between gap-4 w-full">
                <div className=" flex flex-row items-center justify-start gap-4">
                  <Image
                    src={loginIcon}
                    alt="Icone Barbearia"
                    width={25}
                    height={87}
                    style={{ width: 'auto', height: 'auto' }}
                  />
                  <h1
                    className="text-[#B4654A] font-bold text-3xl"
                    style={{ lineHeight: '107px' }}
                  >
                    Cliente
                  </h1>

                </div>

                <div className="text-ms text-[#DDDBCB] font-bold text-right">
                  Agende com
                  <br />
                  sua barbearia
                </div>
              </div>


            </div>

            {/* Seção 2: Inputs (Agrupados) */}
            <div className="flex flex-col gap-5">
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
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-[#5c5c5c] bg-[#151515] py-4 p-3 pl-10 text-[#DDDBCB] placeholder-[#5c5c5c] transition-all focus:border-[#B4654A] focus:outline-none focus:ring-2 focus:ring-[#B4654A]"
                  required
                />

              </div>

              {/* Campo de Senha */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#DDDBCB]"
                  aria-hidden="true" />
                <input
                  type="password"
                  placeholder="Senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full rounded-lg border border-[#5c5c5c] bg-[#151515] py-4 p-3 pl-10 text-[#DDDBCB] placeholder-[#5c5c5c] transition-all focus:border-[#B4654A] focus:outline-none focus:ring-2 focus:ring-[#B4654A]"
                  required
                />

              </div>
            </div>

            {/* Seção 3: Ações (Agrupados) */}
            <div className="mt-2 flex items-center justify-between">

              {/* Botão Cadastrar */}
              <Link
                href="/cadastro/cliente"
                className="text-ms font-medium rounded-md p-3 text-[#5c5c5c] transition-colors hover:text-[#B4654A]"
              >
                Cadastrar
              </Link>

              {/* Botão Entrar  B4654A*/}
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-[#B4654A] px-16 py-3 text-ms font-semibold text-[#151515] transition-transform hover:scale-105 hover:bg-[#B4654A] focus:outline-none focus:ring-2 focus:ring-[#B4654A] focus:ring-offset-2 focus:ring-offset-[#5c5c5c] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>

          </form>
        </div>
      </main>
    </>
  );
}
