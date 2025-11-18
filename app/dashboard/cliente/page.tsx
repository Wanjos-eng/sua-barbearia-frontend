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