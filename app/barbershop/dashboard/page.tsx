// app/barbershop/dashboard/page.tsx
import React from 'react';
import {
  LayoutGrid,
  Users,
  Calendar,
  DollarSign,
  User,
  TrendingUp,
  Percent,
  Clock,
  Check,
  RefreshCw
} from 'lucide-react';

// Tipos (Typescript)
interface SidebarItemProps{
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

interface StatsCardProps{
  icon: React.ElementType;
  title: string;
  value: string;
  iconBgColor: string;
}

interface Appointment{
  time: string,
  client: string;
  barber: string;
  service: string;
  price: string;
  status: 'Pendente' | 'Confirmado';
}

interface ActiveBarber {
  initials: string;
  name: string;
  total: number;
  next: number;
}

// Componentes
// Item da Barra Lateral
const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active }) => {
  <button
    className={`
      flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg
      transition-colors duration-150
      ${
        active
          ? 'bg-gray-800 text-white'
          : 'hover:bg-gray-700 hover:text-white'
      }
    `}
  >
      <Icon className="w-5 h-5 mr-3"/>
      <span>{label}</span>
  </button>
}

//export default function Dashboard
