'use client';
// Importando icons 
import React from 'react';
import {
    Scissors,
    Calendar,
    Clock,
    User,
    Star,
    Phone,
    Info,
    X,
    Check,
    CheckCircle,
    Loader2,
    ChevronLeft,
    Edit,
    LogOut,
    Mail,
    Lock
} from 'lucide-react';

// --- INTERFACES ---

interface Appointment {
  id: string;
  barberShopName: string;
  service: string;
  price: string;
  date: string;
  time: string;
  barberName: string;
  status: 'pending' | 'confirmed';
}

interface BarberShop {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  initial: string; // Para o avatar circular
}

interface Service {
  id: string;
  name: string;
  price: string;
  duration: number;
}

interface Barber {
  id: string;
  name: string;
  avatarUrl: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
}

// --- MOCK DATA ---

const MOCK_BARBER_SHOPS: BarberShop[] = [
  { id: 'b1', name: 'Barbearia 1', address: 'Rua das Flores, 123', phone: '(11) 98888-7777', rating: 4.9, initial: 'A' },
  { id: 'b2', name: 'Barbearia 2', address: 'Av. Principal, 456', phone: '(11) 99999-8888', rating: 4.8, initial: 'B' },
  { id: 'b3', name: 'Barbearia 3', address: 'Beco da Barba, 007', phone: '(11) 97777-6666', rating: 4.7, initial: 'C' },
  { id: 'b4', name: 'Barbearia 4', address: 'Praça Central, 10', phone: '(11) 96666-5555', rating: 4.9, initial: 'D' },
];

const MOCK_UPCOMING: Appointment[] = [
  { id: 'a1', barberShopName: 'Barbearia 1', service: 'Corte', price: 'R$50,00', date: '20/11', time: '10:00', barberName: 'Roberto', status: 'pending' },
  { id: 'a2', barberShopName: 'Barbearia 2', service: 'Corte', price: 'R$50,00', date: '20/11', time: '11:00', barberName: 'Miguel', status: 'confirmed' },
];

const MOCK_HISTORY: Appointment[] = [
  { id: 'h1', barberShopName: 'Barbearia 1', service: 'Corte e Barba', price: 'R$90,00', date: '15/11', time: '10:00', barberName: 'Roberto', status: 'confirmed' },
  { id: 'h2', barberShopName: 'Barbearia 1', service: 'Corte e Barba', price: 'R$90,00', date: '15/11', time: '10:00', barberName: 'Roberto', status: 'confirmed' },
  { id: 'h3', barberShopName: 'Barbearia 1', service: 'Corte e Barba', price: 'R$90,00', date: '15/11', time: '10:00', barberName: 'Roberto', status: 'confirmed' },
  { id: 'h4', barberShopName: 'Barbearia 1', service: 'Corte e Barba', price: 'R$90,00', date: '15/11', time: '10:00', barberName: 'Roberto', status: 'confirmed' },
];

const MOCK_SERVICES: Service[] = [
  { id: 's1', name: 'Corte Degradê', price: 'R$ 50,00', duration: 45 },
  { id: 's2', name: 'Barba Terapia', price: 'R$ 40,00', duration: 30 },
];

const MOCK_BARBERS: Barber[] = [
  { id: 'bar1', name: 'Roberto', avatarUrl: 'https://placehold.co/100x100/d97757/18181b?text=R' },
  { id: 'bar2', name: 'Miguel', avatarUrl: 'https://placehold.co/100x100/d97757/18181b?text=M' },
];