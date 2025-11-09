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
import { Stats } from 'fs';

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

// 58BEC3 CIANO
// 151515 Preto Cinza | 050505 Preto | 292929 Cinza | DDDBCB Branco Bege | 5C5C5C Cinza pouco escuro
// gray-980 Preto escuro | gray-950 Preto um tom acima
// Componentes
// Componente Item da Barra Lateral
const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active }) => {
 return (<button
    className={`
      flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg
      transition-colors duration-150
      ${
        active
          ? 'bg-[#292929] text-white'
          : 'hover:bg-[#292929] hover:text-white'
      }
    `}
  >
      <Icon className="w-5 h-5 mr-3 stroke-[#58BEC3]"/>
      <span>{label}</span>
  </button>)
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
    <div className="flex flex-col w-full md:w-64 bg-[#151515] border-r border-[#292929] min-h-screen p-6">
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

//Componente Cartão de Estatísticas

const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, title, value, iconBgColor }) => (
    <div className="bg-gray-800 p-5 rounded-1g flex items-center space-x-4">
      <div className={`p-3 rounded-1g ${iconBgColor}`}>
        <Icon className="w-6 h-6 text-white"/>
      </div>
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2x1 font-bold text-white">{value}</p>
      </div>
    </div>
    
);


const barbershopDashboard: React.FC = () => {

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#050505] text-white font-sans">
      <Sidebar />
      {/*<MainContent />*/}
    </div>
  )
}

export default barbershopDashboard;