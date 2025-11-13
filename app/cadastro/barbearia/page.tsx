"use client";
import React, { useState } from 'react';

import {User, Mail, Phone, Lock, MapPin} from 'lucide-react';

// Definindo os tipos para o estado do formulário
interface FormData{
    nome: string;
    email: string;
    telefone: string;
    endereco?: string; // como opcional
    senha: string;
    confirmarSenha: string;
}

// Definindo o tipo de usuário
type UserType = 'barbearia' | 'barbeiro';

// Componente principal da aplicação
export default function RegisterBarbPage(){
    // Estado para controlar o tipo de usuario
    const [UserType, setUserType] = useState<UserType>('barbearia');

    // Estado para controlar os dados do formulário
    const [formData, setFormData] = useState<FormData>({
        nome: '',
        email: '',
        telefone: '',
        endereco: '',
        senha: '',
        confirmarSenha: '',
    });

    // Hangler para atualizar o estado do formulário
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value,}));

    }

    // Estilos comuns para os inputs
    const inputBaseStyle = "w-full bg-gray-800 border border-cyan-600 rounded-lg py-3 pl-10 pr-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300";


}