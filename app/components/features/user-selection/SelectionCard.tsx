
'use client';

import { BarberPoleIcon } from '@/app/components/icons/BarberPoleIcon';

type Props = {
  title: string;
  subtitle: string;
  variant: 'client' | 'barbershop';
  onClick: () => void;
  textAlign?: 'left' | 'right';
};

export const SelectionCard = ({ title, subtitle, variant, onClick, textAlign = 'left' }: Props) => {
  const bgClass = variant === 'client' ? 'bg-barber-client' : 'bg-barber-shop';
  const flexDirection = textAlign === 'left' ? 'flex-row' : 'flex-row-reverse';

  return (
    <button
      onClick={onClick}
      type="button"
      className={`
        ${bgClass}
        w-full h-full
        rounded-2xl
        flex ${flexDirection} justify-between items-center
        p-6 md:p-8
        cursor-pointer
        transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-barber-primary/20
      `}
      aria-label={subtitle}
    >
      <div className={`w-full max-w-[216px] text-${textAlign}`}>
          <span className="text-figma-title font-bold whitespace-pre-line text-black">
            {title}
          </span>
      </div>

      <div className="flex flex-col items-center justify-center w-[171px]">
          <div className="w-28 h-28 bg-barber-circle rounded-full my-6 flex items-center justify-center">
            <BarberPoleIcon className="w-16 h-16 text-barber-primary" />
          </div>

          <span className="text-barber-primary text-2xl font-bold">
            {subtitle}
          </span>
      </div>
    </button>
  );
};
