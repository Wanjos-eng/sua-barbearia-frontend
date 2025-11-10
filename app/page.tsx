import Link from 'next/link';
import Image from 'next/image';
import { User, Store } from 'lucide-react'; // Ícones para placeholder

export default function ProfileSelectionPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white p-4 font-sans">
      
      {/* Conteúdo Centralizado */}
      <main className="flex-grow flex flex-col items-center justify-center gap-12">
        {/* Header com Assets (agora parte do main) */}
        <div className="flex items-center gap-4 md:gap-8">
          {/* Logo "Sua Barbearia" */}
          <div className="w-[120px] h-[44px] md:w-[188px] md:h-[69px]">
            <Image 
              src="/logo-texto-sua-barbearia.svg"
              alt="Sua Barbearia"
              width={188}
              height={69}
              priority
            />
          </div>
          
          {/* Ícone Lateral */}
          <div className="w-[30px] h-[67px] md:w-[47px] md:h-[105px]">
            <Image 
              src="/logo-icone-barberpole.svg"
              alt="Icone Barbearia"
              width={47}
              height={105}
              priority
            />
          </div>
        </div>

        {/* Container dos Cards */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full md:w-auto">
          
          {/* Card 1: Cliente (Atualizado) */}
          <Link 
            href="/login/cliente" 
            className="group w-full md:w-auto"
            aria-label="Entrar como Cliente"
          >
            <div className="bg-[#B4654A] rounded-[20px] w-full h-auto md:w-[498px] md:h-[305px] p-8 flex flex-col md:flex-row items-center justify-center md:justify-around gap-4 transition-all duration-300 ease-in-out group-hover:scale-105">
              
              {/* Bloco 1: Texto "Agende..." */}
              <div className="w-full md:w-auto text-left">
                <p 
                  className="font-bold text-[28px] leading-[32px] md:text-[40px] md:leading-[45px] text-[#FFB59C]"
                >
                  Agende com sua barbearia
                </p>
              </div>

              {/* Bloco 2: Círculo + Nome (Empilhados) */}
              <div className="flex flex-col items-center">
                {/* Círculo */}
                <div 
                  className="bg-[#D9D9D9] w-[100px] h-[100px] md:w-[166px] md:h-[166px] rounded-full flex items-center justify-center"
                >
                  {/* Ícone de placeholder */}
                  <User className="w-16 h-16 md:w-24 md:h-24 text-gray-800" strokeWidth={1} />
                </div>
                {/* Nome */}
                <h2 
                  className="font-bold text-[24px] leading-[40px] md:text-[36px] md:leading-[90px] text-[#DDDBCB]"
                  style={{ lineHeight: 'normal' }}
                >
                  Cliente
                </h2>
              </div>
            </div>
          </Link>

          {/* Card 2: Barbearia (Atualizado) */}
          <Link 
            //href="/login/barbearia" 
            href="/barbershop/dashboard"
            className="group w-full md:w-auto"
            aria-label="Entrar como Barbearia"
          >
            <div className="bg-[#00807F] rounded-[20px] w-full h-auto md:w-[498px] md:h-[305px] p-8 flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 transition-all duration-300 ease-in-out group-hover:scale-105">
              
              {/* Bloco 1: Texto "Gerencie..." */}
              <div className="w-full md:w-auto text-center md:text-left order-2 md:order-1">
                <p 
                  className="font-bold text-[28px] leading-[32px] md:text-[40px] md:leading-[45px] text-[#6EE6E2]"
                >
                  Gerencie
                  <br className="hidden md:block" />
                  a sua
                  <br className="hidden md:block" />
                  barbearia
                </p>
              </div>

              {/* Bloco 2: Círculo + Nome (Empilhados) */}
              <div className="flex flex-col items-center order-1 md:order-2">
                {/* Círculo */}
                <div 
                  className="bg-[#D9D9D9] w-[100px] h-[100px] md:w-[166px] md:h-[166px] rounded-full flex items-center justify-center"
                >
                  {/* Ícone de placeholder */}
                  <Store className="w-16 h-16 md:w-24 md:h-24 text-gray-800" strokeWidth={1} />
                </div>
                {/* Nome */}
                <h2 
                  className="font-bold text-[24px] leading-[40px] md:text-[36px] md:leading-[90px] text-[#DDDBCB]"
                  style={{ lineHeight: 'normal' }}
                >
                  Barbearia
                </h2>
              </div>
              
            </div>
          </Link>

        </div>

        {/* Footer (agora parte do main) */}
        <p className="text-xs md:text-sm text-gray-400 tracking-widest font-medium">
          SELECIONE SUA ENTRADA
        </p>
      </main>
    </div>
  );
}