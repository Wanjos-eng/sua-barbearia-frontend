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
  Mail,
  Edit,
  UserX,
  Phone
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
  //iconBgColor: string;
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

interface Barber{
  id: string;
  initials: string;
  name: string;
  ativo: boolean;
  email: string;
  phone: string;
  cpf: string; // ou CPF, como na imagem
  appointments: number;
  next7d: number;
  status: 'Ativo' | 'Desativo';
}

// 58BEC3 CIANO
// 151515 Preto Cinza | 050505 Preto | 292929 Cinza | DDDBCB Branco Bege | 5C5C5C Cinza pouco escuro
// gray-980 Preto escuro | gray-950 Preto um tom acima
// Componentes
// Componente Item da Barra Lateral
const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active }) => {
 return (<button
    className={`
      flex items-center w-full px-4 py-3 text-sm text-[#DDDBCB] font-medium rounded-lg
      transition-colors duration-150
      ${
        active
          ? 'bg-[#292929] text-[#DDDBCB]'
          : 'hover:bg-[#292929] hover:text-[#DDDBCB]'
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
      <h1 className = "text-2xl font-bold text-center text-[#58BEC3] mb-10 my-5">
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

const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, title, value }) => (
    <div className="bg-[#151515] p-5 rounded-lg flex items-center space-x-4">
      <div className="p-3 rounded-lg bg-[#5C5C5C]">
        <Icon className="w-6 h-6 text-[#DDDBCB]"/>
      </div>
      <div>
        <p className="text-sm text-[#5C5C5C]">{title}</p>
        <p className="text-2x1 font-bold text-[#DDDBCB]">{value}</p>
      </div>
    </div>
    
);

//Componente Item de Agendamento

const AppointmentItem: React.FC<Appointment> = ({ time, client, barber, service, price, status }) => (
  <div className="py- p-4 bg-[#0C0C0C] rounded-lg mh-4 my-3">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      {/* Informacoes Principais */}
      <div className="flex items-center space-x-4 mb-4 md:mb-0">
        <span className="text-2xl font-black text-[#DDDBCB] w-20">{time}</span>
        <div className="flex-1">
          <p className="text-lg font-semibold text-[#DDDBCB]">{client}</p>
          <p className="text-sm text-[#5C5C5C]">{barber}</p>

        </div>
        <div>
          <p className="text-lg font-semibold text-[#DDDBCB]">{service}</p>
          <p className="text-sm text-[#5C5C5C]">{price}</p>
        </div>
      </div>

      {/* Status e Ações */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-2">
          {status === 'Pendente' ? (
            <Clock className="w-5 h-5 text-[#5C5C5C]"/>
          ) : (
            <Check className="w-5 h-5 text-[#58BEC3]"/>
          )}
          <span className={`text-sm font-medium ${status === 'Pendente' ? 'text-[#5C5C5C]' : 'text-[#58BEC3]'}`}>{status}</span>
        </div>

        <div className="flex items-center space-x-2">
          {status === 'Pendente' && (
            <button className="flex items-center justify-center text-sm bg-[#58BEC3] hover:bg-[#7ADBE0] text-[#151515] px-3 py-2 rounded-md transition colors">
              <Check className="w-4 h-4 mr-1"/>
              Confirmar
            </button>
          )}
          <button className="flex items-center justify-center text-sm bg-[#5C5C5C] hover:bg-[#767676] text-white px-3 py-2 rounded-md transition-colors">
            <RefreshCw className="w-4 h-4 mr-1"/>
            Recarregar
          </button>
        </div>
      </div> 
    </div>
  </div>
);

// Componente Item de Barbeiro Ativo
const ActiveBarberItem: React.FC<ActiveBarber> = ({ initials, name, total, next }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
    <div className="flex items-center space-x-4">
      <div className="w-10 h-10 bg-[#5C5C5C] rounded-full flex items-center justify-center font-bold text-white">
        {initials}
      </div>
      <div>
        <p className="text-lg font-bold text-[#DDDBCB]">{name}</p>
        <p className="text-xs font-semibold text-[#5C5C5C]">Agendamentos:</p>
        <p className="text-xs text-[#DDDBCB]">{total}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-semibold text-[#DDDBCB]">{next}</p>
      <p className="text-xs text-[#5C5C5C]">Próx. 7d At.:</p>
    </div>
  </div>
);

// Dados Modelo (Simulação)

const statsData = [
  { icon: DollarSign, title: 'Receita', value: 'R$400,00', iconBgColor: 'bg-green-500' },
  { icon: TrendingUp, title: 'Projeção (7d)', value: 'R$520,00', iconBgColor: 'bg-blue-500' },
  { icon: Percent, title: 'Ticket Médio', value: 'R$60,00', iconBgColor: 'bg-purple-500' },
  { icon: Calendar, title: 'Agendamentos', value: '7', iconBgColor: 'bg-yellow-500' },
];

const appointmentsData: Appointment[] = [
  { time: '10:00', client: 'Carlos Pereira', barber: 'Nome Barbeiro', service: 'Corte', price: 'R$50,00', status: 'Pendente' },
  { time: '11:00', client: 'Otávio Augusto', barber: 'Nome Barbeiro', service: 'Corte', price: 'R$50,00', status: 'Confirmado' },
];

const activeBarbersData: ActiveBarber[] = [
  { initials: 'JS', name: 'João Silva', total: 100, next: 5 },
  { initials: 'JS', name: 'João Silva', total: 150, next: 5 },
  { initials: 'JS', name: 'João Silva', total: 100, next: 8 },
];

const barbeirosData: Barber[] = [
  { 
    id: '1', 
    initials: 'JS', 
    name: 'João Silva', 
    ativo: true, 
    email: 'joao.silva@barbearia.com', 
    phone: '(11) 98888-7777', 
    cpf: '123.456.789-09', 
    appointments: 150, 
    next7d: 5,
    status: 'Ativo'
  },
  { 
    id: '2', 
    initials: 'JS', 
    name: 'João Silva', 
    ativo: true, 
    email: 'joao.silva@barbearia.com', 
    phone: '(11) 98888-7777', 
    cpf: '123.456.789-09', 
    appointments: 150, 
    next7d: 5,
    status: 'Ativo'
  },
  { 
    id: '3', 
    initials: 'JS', 
    name: 'João Silva', 
    ativo: true, 
    email: 'joao.silva@barbearia.com', 
    phone: '(11) 98888-7777', 
    cpf: '123.456.789-09', 
    appointments: 150, 
    next7d: 5,
    status: 'Ativo'
  },
];

// Componente Conteúdo Principal
const DashboardContent: React.FC = () => (
  <>
    <h1 className="text-3x1 font-bold text-[#DDDBCB] mb-6">Dashboard</h1>

    {/* Grid de Estatísticas */}  
    <div className="grid grid-cols-1 sm:grid-cols-2 x1:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat) => (
        <StatsCard
        key={stat.title}
        icon={stat.icon}
        title={stat.title}
        value={stat.value}/>
        //iconBgColor={stat.iconBgColor} 
      
      ))}
    </div>

    {/* Layout Principal (Agendamentos e Barbeiros) */}
    <div className="flex flex-col lg:flex-row gap-8">

      {/* Coluna Esquerda: Próximos 7 Dias */}
      <div className="flex-1 bg-[#151515] p-6 rounded-lg">
        <div className="flex items-center space-x-3 mb-5">
          <Calendar className="w-6 h-6 text-white"/>
          <h2 className="text-x1 font-semibold text-[#DDDBCB]">Próximos 7 Dias</h2>
        </div>

        {/* Agendamentos */}
        <div className="space-y-4">
          <div>
             {/* Colocar a data vindo direto do calendário automaticamente*/}
            <p className="text-sm border-b border-[#5C5C5C] pb-3 mb-4 font-medium text-[#5C5C5C] mb-2">Dia 09/11 - Domingo</p>
            {appointmentsData.map((app, index) => (
              <AppointmentItem key={index} {...app} /> 
            ))}
          </div>
          <div>
            <p className="text-sm border-b border-[#5C5C5C] pb-3 mb-4 font-medium text-[#5C5C5C] mb-2">Dia 10/11 - Segunda</p>
            {/* Simulando mais dados */}
            <AppointmentItem 
              time="10:00" 
              client="Carlos Pereira" 
              barber="Nome Barbeiro" 
              service="Corte" 
              price="R$50,00" 
              status="Pendente" 
            />
            <AppointmentItem 
              time="11:00" 
              client="Otávio Augusto" 
              barber="Nome Barbeiro" 
              service="Corte" 
              price="R$50,00" 
              status="Confirmado" 
            />
          </div>
        </div>
      </div>

      {/* Coluna Direita: Ações e Barbeiros Ativos */}
      <div className="w-full lg:w-80">
        <button className="w-full bg-[#58BEC3] hover:bg-[#7ADBE0] text-[#151515] font-bold py-3 px-4 rounded-lg transition-colors">
          + Novo Agendamento
        </button>

        <div className="bg-[#151515] p-6 rounded-lg mt-8">
          <h3 className="text-lg font-semibold text-[#DDDBCB] mb-4">Barbeiros Ativos</h3>
          <div className="space-y-2">
            {activeBarbersData.map((barber, index) => (
              <ActiveBarberItem
              key={index}
              initials={barber.initials}
              name={barber.name}
              total={barber.total}
              next={barber.next}
              />
            ))}
          </div>
        </div>

        <button className="w-full bg-[#58BEC3] hover:bg-[#7ADBE0] text-[#151515] font-bold py-3 px-4 rounded-lg transition-colors mt-8">
          Adicionar Barbeiro
        </button>
      </div>
    </div>
  </>
)

// Componente Card do Barbeiro
const BarbeirosCard: React.FC<{barber: Barber}> = ({barber}) => (
    <div className="bg-[#151515] p-5 rounded-lg flex flex-col">

      {/* Header do Card */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 bg-[#050505] rounded-full flex items-center justify-center font-bold text-[#DDDBCB] text-2xl flex-shrink-0">
          {barber.initials}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-x1 font-semibold text-[#DDDBCB]">{barber.name}</h3>
            {barber.ativo && (
              <span className="bg-[#58BEC3] text-[#151515] text-xs font-bold px-2 py-0.5 rounded-full ">
                Ativo
              </span>
            )}
          </div>
          <p className="text-sm text-[#5C5C5C]">
            <Mail className="w-3 h-3 flex-shrink-0"/>
            <span>{barber.email}</span>
          </p>
        </div>
      </div>
    
      {/* Informações de Contato */}
      <div className="space-y-1 mb-4">
        <p className="text-sm text-[#5C5C5C] flex items-center space-x-2">
          <Phone className="w-3 h-3 flex-shrink-0"/>
          <span>{barber.phone}</span>
        </p>
        <p className="text-sm text-[#5C5C5C] flex items-center space-x-2">
          <Phone className="w-3 h-3 flex-shrink-0"/>
          <span>{barber.cpf}</span>
        </p>
      </div>

      {/* Estatísticas */}
      <div className="flex items-center justify-between text-center mb-5">
        <div>
          <p className="text-2xl font-bold text-[#DDDBCB]">{barber.appointments} </p>
          <p className="text-xs text-[#5C5C5C]">Agendamentos </p>
        </div>
        <div>
          <p className="text-2xl font-bold text-[#DDDBCB]">{barber.next7d} </p>
          <p className="text-xs text-[#5C5C5C]">Prox. 7d:</p>
        </div>
      </div>

      {/* Ações */}
      <div className="flex items=center space-x-2 mt-auto">
        <button className="flex-1 bg-[#58BEC3] hover:bg-[#7ADBE0] text-[#151515] font-semibold py-2 px-3 rounded-lg text-sm flex items-center justify-center space-x-1">
          <Calendar className="w-4 h-4"/>
          <span>Agenda</span>
        </button>

        <button className="p-2 bg-[#5C5C5C] hover:bg-[#767676] rounded-lg text-[#DDDBCB]">
          <Edit className="w-4 h-4"/>
        </button>

        <button className="p-2 bg-[#5C5C5C] hover:bg-[#767676] rounded-lg text-[#DDDBCB]">
          <UserX className="w-4 h-4"/>
        </button>
      </div>
    </div>
);

//Componente App
const App: React.FC = () => {

  // Estado para controlar a página atual
  const [currentPage, setCurrentPage] = React.useState('Dashboard');

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#050505] text-white font-sans">
      {/* A Sidebar agora recebe o estado da página e a função para alterá-lo */}
      <div>
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
      
      <main className="flex-1 p-6 md-p10 min-h-screen overflow-y-auto">
        {currentPage === 'Dashboard' && <DashboardContent />}
        {currentPage === 'Barbeiros' && <BarbeirosContent />}
         {/* Adicione outras páginas aqui, por ex:
        {currentPage === 'Agendamentos' && <AgendamentosContent />}
        */}
      </main>
    </div>
  )
}

export default App;