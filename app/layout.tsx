import { Inter } from 'next/font/google';
import { Providers } from './providers'; // Importando o novo componente
import './globals.css';

// Configura a fonte Inter
const inter = Inter({
  subsets: ['latin'],
  weight: ['700'], // Adiciona o peso 700 (Bold) que você especificou
  variable: '--font-inter', // Opcional, mas útil
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      {/* Adiciona a classe da fonte ao body */}
      <body className={`${inter.className} bg-black text-white`}>
        {/* Envolve os children com o Providers */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}