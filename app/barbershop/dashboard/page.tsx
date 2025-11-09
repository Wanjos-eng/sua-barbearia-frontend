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
  RefreshCw,
  Layout
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
// Componente Item da Barra Lateral
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
};

//Componente Barra Lateral
const Sidebar: React.FC = () => {
  const navItems = [
    {icon: LayoutGrid, label: 'Dashboard', active: true},
    {icon: Users, label: 'Barbeiros' },
    {icon: Calendar, label: 'Agendamentos'},
    {icon: DollarSign, label: 'Gestão Financeira'},
    {icon: User, label: 'Clientes'},
  ];

  return (
    <div className="flex flex-col w-full md:w-64 bg-gray-900 border-r border-gray-700 min-h-screen p-6">
      <h1 className = "text-2x1 font-bold text-white mb-10">
        {/* Aqui recebe-se o nome da barbearia que fez o login*/}
        Nome
        <br />
        Barbearia
      </h1>

      <nav className="flex-grow">
        <ul className="space-y-2">
          {navItems.map((item) => (
          <li key={item.label}>
            <SidebarItem
              icon={item.icon}
              label={item.label}
              active={item.active}
            />
          </li>
        ))}
        </ul>
      </nav>

      <div className="mt-auto">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
            {/* Placeholder para o logo */}
            <svg className="w-6 h-6 text=white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

  )
};

//export default function Dashboard
