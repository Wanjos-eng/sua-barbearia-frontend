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

//Componente Item de Agendamento

const AppointmentItem: React.FC<Appointment> = ({ time, client, barber, service, price, status }) => (
  <div className="py-5 border-b border-gray-700 last:border-b-0">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      {/* Informacoes Principais */}
      <div className="flex items-center space-x-4 mb-4 md:mb-0">
        <span className="text-x1 font-semibold text-white w-20">{time}</span>
        <div className="flex-1">
          <p className="text-lg font-semibold text-white">{client}</p>
          <p className="text-sm text-gray-400">{barber}</p>

        </div>
        <div>
          <p className="text-lg font-semibold text-white">{service}</p>
          <p className="text-sm text-gray-400">{price}</p>
        </div>
      </div>

      {/* Status e Ações */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-2">
          {status === 'Pendente' ? (
            <Clock className="w-5 h-5 text-yellow-400"/>
          ) : (
            <Check className="w-5 h-5 text-green-400"/>
          )}
          <span className={`text-sm font-medium ${status === 'Pendente' ? 'text-yellow-400' : 'text-green-400'}`}>{status}</span>
        </div>

        <div className="flex items-center space-x-2">
          {status === 'Pendente' && (
            <button className="flex items-center justify-center text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md transition colors">
              <Check className="w-4 h-4 mr-1"/>
              Confirmar
            </button>
          )}
          <button className="flex items-center justify-center text-sm bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-md transition-colors">
            <RefreshCw className="w-4 h-4 mr-1"/>
            Recarregar
          </button>
        </div>
      </div> 
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