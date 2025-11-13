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