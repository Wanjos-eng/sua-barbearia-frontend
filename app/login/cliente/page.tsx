import Image from 'next/image';
import Link from 'next/link';
import loginIcon from '@/assets/LoginCliente/icone-logo-suabarbearia-Login.png';

export default function LoginClientePage() {
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
          <form className="flex flex-col gap-8">
            
            {/* Seção 1: Cabeçalho (Agrupados) */}
            <div className="flex flex-col items-center">
              
              {/* Header: "Agende com sua barbearia" */}
              <h2 
                className="text-gray-300 font-bold text-[40px] leading-[46px] text-center"
              >
                Agende com
                <br />
                sua barbearia
              </h2>

              {/* Sub-Header: Icone + "Cliente" */}
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

            {/* Seção 2: Inputs (Agrupados) */}
            <div className="flex flex-col gap-5">
              <input
                type="email"
                placeholder="Email"
                className="bg-transparent border border-[#B4654A] rounded-lg w-full p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B4654A]/50"
              />
              <input
                type="password"
                placeholder="Senha"
                className="bg-transparent border border-[#B4654A] rounded-lg w-full p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B4654A]/50"
              />
            </div>

            {/* Seção 3: Ações (Agrupados) */}
            <div className="grid grid-cols-2 gap-6">
              
              {/* Botão Cadastrar */}
              <Link
                href="/cadastro/cliente"
                className="text-center bg-transparent border border-[#5C5C5C] text-[#5C5C5C] font-bold text-[20px] rounded-[7px] py-3 transition-colors hover:bg-[#5C5C5C] hover:text-white"
              >
                Cadastrar
              </Link>
              
              {/* Botão Entrar */}
              <button
                type="submit"
                className="text-center bg-[#B4654A] text-white font-bold text-[20px] rounded-[7px] py-3 transition-all hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-[#B4654A]/50"
              >
                Entrar
              </button>
            </div>

          </form>
        </div>
      </main>
    </>
  );
}
