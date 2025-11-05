'use client';

import { useRouter } from 'next/navigation';
import { BarberPoleIcon } from '@/app/components/icons/BarberPoleIcon';
import { SelectionCard } from './SelectionCard';

export const UserSelectionScreen = () => {
  const router = useRouter();

  const handleClientClick = () => {
    router.push('/client/dashboard');
  };

  const handleBarbershopClick = () => {
    router.push('/barbershop/dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen p-6 md:p-8">
      {/* === HEADER === */}
      <header className="flex justify-between items-start max-w-[1029px] mx-auto w-full mb-16 md:mb-24">
        <h1 className="text-4xl md:text-5xl font-bold whitespace-pre-line text-barber-primary leading-tight">
          {'Sua\nBarbearia'}
        </h1>
        <BarberPoleIcon className="w-[47px] h-[105px] text-barber-primary" />
      </header>

      {/* === CORPO (CENTRALIZADO) === */}
         <main className="flex-grow flex flex-col justify-center items-center">
           <div className="flex flex-col lg:flex-row gap-8 md:gap-10 w-full max-w-[1029px] lg:h-[305px]">
             <div className="w-full h-full">
              <SelectionCard
                title={'Agende\ncom sua\nbarbearia'}
                subtitle="Cliente"
                variant="client"
                onClick={handleClientClick}
                textAlign="left"
              />
             </div>

             <div className="w-full h-full">
              <SelectionCard
                title={'Gerencie\na sua\nbarbearia'}
                subtitle="Barbearia"
                variant="barbershop"
                onClick={handleBarbershopClick}
                textAlign="right"
              />
             </div>
           </div>
         </main>

      {/* === FOOTER === */}
      <footer className="text-center py-8 mt-16 md:mt-24">
        <p className="text-sm uppercase text-barber-primary/80 tracking-widest">
          SELECIONE SUA ENTRADA
        </p>
      </footer>
    </div>
  );
};
