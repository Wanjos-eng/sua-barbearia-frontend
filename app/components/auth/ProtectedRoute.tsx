"use client";

import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: 'CLIENTE' | 'BARBEARIA';
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Se não está carregando e não está autenticado, redireciona para o login geral
    if (!isLoading && !isAuthenticated) {
      router.replace('/'); // Ou uma página de login principal, se houver
    }
    
    // Se está autenticado, mas a role não é a esperada
    if (!isLoading && isAuthenticated && user?.role !== role) {
        // Redireciona para o dashboard correto ou uma página de "acesso negado"
        if (user?.role === 'CLIENTE') {
            router.replace('/dashboard/cliente');
        } else if (user?.role === 'BARBEARIA') {
            router.replace('/dashboard/barbearia');
        } else {
            router.replace('/');
        }
    }
  }, [isLoading, isAuthenticated, user, role, router]);

  // Enquanto carrega, mostra uma tela de loading para evitar piscar o conteúdo
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <p className="text-white">Carregando...</p>
      </div>
    );
  }

  // Se está autenticado e tem a role correta, renderiza o conteúdo da página
  if (isAuthenticated && user?.role === role) {
    return <>{children}</>;
  }

  // Renderiza null enquanto o redirecionamento acontece para evitar mostrar conteúdo indevido
  return null;
}
