"use client";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';
import { loginCliente } from '@/app/services/api';
import loginIcon from '@/assets/LoginCliente/icone-logo-suabarbearia-Login.png';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginClientePage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = await loginCliente({ email, senha });
      login(data); 
    } catch (err: any) {
      setError(err.message || 'Email ou senha incorretos.');
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[-1] bg-black"></div>

      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-[#151515] rounded-[17px] w-full max-w-[468px] h-auto p-8 md:p-10">
          <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center">
              <h2 className="text-gray-300 font-bold text-[40px] leading-[46px] text-center">
                Agende com
                <br />
                sua barbearia
              </h2>

              <div className="flex flex-row items-center justify-start gap-4 w-full">
                <Image
                  src={loginIcon}
                  alt="Icone Barbearia"
                  width={39}
                  height={87}
                />
                <h1
                  className="text-[#B4654A] font-bold text-[40px]"
                  style={{ lineHeight: '107px' }}
                >
                  Cliente
                </h1>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="bg-transparent border border-[#B4654A] rounded-lg w-full p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B4654A]/50 disabled:opacity-50"
              />
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-transparent border border-[#B4654A] rounded-lg w-full p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B4654A]/50 disabled:opacity-50 pr-10"
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
              <p className="text-red-500 text-sm text-center -mt-4">{error}</p>
            )}

            <div className="grid grid-cols-2 gap-6">
              <Link
                href="/cadastro/cliente"
                className={`text-center bg-transparent border border-[#5C5C5C] text-[#5C5C5C] font-bold text-[20px] rounded-[7px] py-3 transition-colors hover:bg-[#5C5C5C] hover:text-white ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
              >
                Cadastrar
              </Link>
              
              <button
                type="submit"
                disabled={isLoading}
                className="text-center bg-[#B4654A] text-white font-bold text-[20px] rounded-[7px] py-3 transition-all hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-[#B4654A]/50 disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
