"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Tipagem para os dados do usuário e do token
interface User {
  id: number;
  nome: string;
  email: string;
  role: string;
}

interface AuthData {
  token: string;
  user: User;
}

// Tipagem para o valor do contexto de autenticação
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (authData: AuthData) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  isLoading: boolean;
}

// Criação do contexto com um valor padrão
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook customizado para facilitar o uso do contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Props para o provedor de autenticação
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Começa como true para verificar o token inicial
  const router = useRouter();

  // Efeito para carregar o token do localStorage na inicialização
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('authUser');
      
      if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user data from localStorage", error);
      // Se houver erro, garante que o estado fique limpo
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (authData: AuthData) => {
    const { token, ...userData } = authData; // A API retorna mais dados que o user
    const userToStore = {
        id: userData.userId,
        nome: userData.nome,
        email: userData.email,
        role: userData.role,
    };
    
    localStorage.setItem('authToken', authData.token);
    localStorage.setItem('authUser', JSON.stringify(userToStore));
    setUser(userToStore);
    
    // Redireciona com base no role do usuário
    if (userToStore.role === 'CLIENTE') {
      router.push('/dashboard/cliente');
    } else if (userToStore.role === 'BARBEARIA') {
      router.push('/dashboard/barbearia');
    } else {
        router.push('/'); // Fallback
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setUser(null);
    router.push('/login/cliente'); // Redireciona para a página de login do cliente
  };

  const updateUser = (data: Partial<User>) => {
    setUser(prevUser => {
        if (!prevUser) return null;
        const newUser = { ...prevUser, ...data };
        localStorage.setItem('authUser', JSON.stringify(newUser));
        return newUser;
    });
  };

  const value = {
    isAuthenticated: !!user,
    user,
    login,
    logout,
    updateUser,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
