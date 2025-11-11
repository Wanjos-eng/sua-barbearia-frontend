import React, { useState } from 'react';

import {Mail, Lock} from 'lucide-react';

// Componente ícone customizado
// Alterar para a logo do projeto
const BarberPoleIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Logo Barbearia</title>
    <path d="M12 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2" />
    <path d="M12 22a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2" />
    <path d="M10 4V2" />
    <path d="M14 4V2" />
    <path d="M10 22v-2" />
    <path d="M14 22v-2" />
    <path d="M10 6h4" />
    <path d="M10 10h4" />
    <path d="M10 14h4" />
    <path d="M10 18h4" />
    <path d="m14 6-4 4" />
    <path d="m14 14-4 4" />
  </svg>
);

// Componente principal da página de login
export default function LoginPage(){
    const [activeTab, setActiveTab] = useState<'barbearia' | 'barbeiro'>('barbearia');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Função para lidar com o envio do formulário
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aqui adicionará a lógica de autenticação
        console.log({
            role: activeTab,
            email,
            password,
        });

    };

    

}