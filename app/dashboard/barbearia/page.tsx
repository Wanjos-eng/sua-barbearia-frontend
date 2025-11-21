'use client';
// app/barbershop/dashboard/page.tsx
import React, {useMemo, useState, useEffect} from 'react';
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
  Phone,
  Plus,
  Search,
  ChevronDown,
  X,
  CheckCircle,
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  Menu,
  History,
  Trash2,
  ChevronLeft,
  Scissors,
  Save
} from 'lucide-react';

// Tipos (Typescript)

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isOpen: boolean; // [MENU HAMBURGUER] 2. Propriedade para saber se o menu está visível
  onClose: () => void; // [MENU HAMBURGUER] 3. Função para fechar o menu
}
interface SidebarItemProps{
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
}

interface StatsCardProps{
  icon: React.ElementType;
  title: string;
  value: string;
  trend?: string;
  trendType?: 'up' | 'down' | 'neutral';
  //iconBgColor: string;
}

interface Appointment{
  id: string,
  date: string,
  time: string,
  client: string;
  barber: string;
  service: string;
  value: string;
  status: AppointmentStatus;
}

// Tipos de Páginas de Agendamentos
type AppointmentStatus = 'Concluído' | 'Cancelado' | 'Pendente' | 'Confirmado';

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

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  since: string;
  lastVisit?: string;
  avatarColor: string;
}

interface ServiceItem {
  id: string;
  name: string;
  price: string;
  duration: string;
}

interface Transaction {
    id: string;
    description: string;
    category: string;
    barberName?: string;
    date: string;
    amount: number;
    type: 'income' | 'expense';
    status: 'Pago' | 'Pendente';
}

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (transaction: Omit<Transaction, 'id'>) => void;
}

// 58BEC3 CIANO
// 151515 Preto Cinza | 050505 Preto | 292929 Cinza | DDDBCB Branco Bege | 5C5C5C Cinza pouco escuro
// gray-980 Preto escuro | gray-950 Preto um tom acima
// Componentes
// Componente Item da Barra Lateral
const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, onClick }) => {
 return (<button
    onClick={onClick}
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
const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isOpen, onClose }) => {
  const navItems = [
    {icon: LayoutGrid, label: 'Dashboard'},
    {icon: Users, label: 'Barbeiros' },
    {icon: Calendar, label: 'Agendamentos'},
    {icon: DollarSign, label: 'Gestão Financeira'},
    {icon: User, label: 'Clientes'},
  ];

  return (
    <>
    {/* Mobile Overlay*/}
    <div
      //  // [MENU HAMBURGUER] 4. Camada escura de fundo. Se isOpen for true, fica visível e clicável para fechar.
      className={`fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
        
    />
    {/* Sidebar Container */}
    <div className={`
        fixed top-0 left-0 bottom-0 w-64 bg-[#151515] border-r border-[#292929] p-6 z-30
        transform transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:inset-auto flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      `}>
        {/* [MENU HAMBURGUER] 5. Classes acima: 'translate-x-0' mostra o menu, '-translate-x-full' esconde ele fora da tela à esquerda */}
        {/* Mobile Close Button */}
        <button 
          onClick={onClose} // [MENU HAMBURGUER] 6. Botão 'X' interno para fechar explicitamente
          className="absolute top-4 right-4 md:hidden text-[#5C5C5C] hover:text-[#DDDBCB]"
        >
          <X className="w-6 h-6" />
        </button>

        <h1 className = "text-2xl font-bold text-center text-[#58BEC3] mb-10 my-5 tracking-tight">
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
              active={item.label === currentPage}
              onClick={() => {
                    setCurrentPage(item.label);
                    onClose(); // [MENU HAMBURGUER] 7. Fecha o menu automaticamente ao clicar em um link
                  }}
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
    </>
  )
};

//Componente Cartão de Estatísticas

const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, title, value, trend }) => (
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

const AppointmentItem: React.FC<Appointment> = ({ time, client, barber, service, value, status }) => (
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
          <p className="text-sm text-[#5C5C5C]">{value}</p>
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

const MOCK_SERVICES: ServiceItem[] = [
  { id: 's1', name: 'Corte de Cabelo', price: 'R$ 50,00', duration: '30' },
  { id: 's2', name: 'Barba Completa', price: 'R$ 40,00', duration: '30' },
  { id: 's3', name: 'Corte + Barba', price: 'R$ 80,00', duration: '60' },
  { id: 's4', name: 'Acabamento / Pezinho', price: 'R$ 20,00', duration: '15' },
  { id: 's5', name: 'Sobrancelha', price: 'R$ 15,00', duration: '10' },
];

const AVAILABLE_TIMES = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];


const statsData = [
  { icon: DollarSign, title: 'Receita', value: 'R$400,00', iconBgColor: 'bg-green-500' },
  { icon: TrendingUp, title: 'Projeção (7d)', value: 'R$520,00', iconBgColor: 'bg-blue-500' },
  { icon: Percent, title: 'Ticket Médio', value: 'R$60,00', iconBgColor: 'bg-purple-500' },
  { icon: Calendar, title: 'Agendamentos', value: '7', iconBgColor: 'bg-yellow-500' },
];

const initialAppointmentsData: Appointment[] = [
  { id: 'd1', date: '09/11', time: '10:00', client: 'Carlos Pereira', barber: 'João Silva', service: 'Corte', value: 'R$50,00', status: 'Pendente' },
  { id: 'd2', date: '09/11', time: '11:00', client: 'Otávio Augusto', barber: 'João Silva', service: 'Barba', value: 'R$40,00', status: 'Confirmado' },
  { id: 'd3', date: '09/11', time: '13:00', client: 'Marcos Santos', barber: 'Pedro Souza', service: 'Corte + Barba', value: 'R$80,00', status: 'Concluído' },
  { id: 'd4', date: '10/11', time: '09:00', client: 'Lucas Oliveira', barber: 'João Silva', service: 'Corte', value: 'R$50,00', status: 'Pendente' },
  { id: 'd5', date: '01/11', time: '14:00', client: 'Carlos Pereira', barber: 'Marcos Alves', service: 'Corte', value: 'R$50,00', status: 'Concluído' },
];

const appointmentsData: Appointment[] = [
  { id: 'd1', date: '09/11', time: '10:00', client: 'Carlos Pereira', barber: 'Nome Barbeiro', service: 'Corte', value: 'R$50,00', status: 'Pendente' },
  { id: 'd2', date: '09/11', time: '11:00', client: 'Otávio Augusto', barber: 'Nome Barbeiro', service: 'Corte', value: 'R$50,00', status: 'Confirmado' },
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

const initialTransactionsData: Transaction[] = [
    { id: 't1', description: 'Corte - Carlos Pereira', category: 'Serviço', date: '09/11', amount: 50.00, type: 'income', status: 'Pago' },
    { id: 't2', description: 'Barba - Otávio Augusto', category: 'Serviço', date: '09/11', amount: 40.00, type: 'income', status: 'Pago' },
    { id: 't3', description: 'Compra de Produtos', category: 'Estoque', date: '08/11', amount: 150.00, type: 'expense', status: 'Pago' },
    { id: 't4', description: 'Conta de Luz', category: 'Utilidades', date: '05/11', amount: 320.00, type: 'expense', status: 'Pendente' },
    { id: 't5', description: 'Corte - Marcos Santos', category: 'Serviço', date: '09/11', amount: 50.00, type: 'income', status: 'Pago' },
];

// Dados Iniciais de Clientes (Combinando com os nomes dos agendamentos)
const initialClientsData: Client[] = [
  { id: 'c1', name: 'Carlos Pereira', email: 'carlos.p@email.com', phone: '(11) 99999-1111', since: 'Jan 2023', lastVisit: '09/11/2024', avatarColor: 'bg-blue-500' },
  { id: 'c2', name: 'Otávio Augusto', email: 'otavio.a@email.com', phone: '(11) 99999-2222', since: 'Mar 2023', lastVisit: '09/11/2024', avatarColor: 'bg-green-500' },
  { id: 'c3', name: 'Marcos Santos', email: 'marcos.s@email.com', phone: '(11) 99999-3333', since: 'Jun 2023', lastVisit: '09/11/2024', avatarColor: 'bg-purple-500' },
  { id: 'c4', name: 'Lucas Oliveira', email: 'lucas.o@email.com', phone: '(11) 99999-4444', since: 'Set 2023', lastVisit: '10/11/2024', avatarColor: 'bg-yellow-500' },
  { id: 'c5', name: 'Fernando Dias', email: 'fernando.d@email.com', phone: '(11) 99999-5555', since: 'Nov 2023', lastVisit: '-', avatarColor: 'bg-red-500' },
];

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [barberId, setBarberId] = useState('');
  const [description, setDescription] = useState('');

  const expenseCategories = ['Pagamento Barbeiro', 'Contas (Luz/Água)', 'Estoque', 'Marketing', 'Aluguel', 'Outros'];
  const incomeCategories = ['Serviço', 'Venda de Produto', 'Outros'];
  
  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setCategory('');
      setBarberId('');
      setDescription('');
    }
  }, [isOpen]);

  useEffect(() => {
    setCategory('');
    setBarberId('');
  }, [type]);

  if (!isOpen) return null;

  const isBarberRequired = category === 'Pagamento Barbeiro';
  const isValid =
    amount !== '' &&
    parseFloat(amount) > 0 &&
    category !== '' &&
    (!isBarberRequired || barberId !== '');

    const handleSubmit = () => {
    if (!isValid) return;

    let barberName = undefined;
    if (isBarberRequired) {
      const selectedBarber = barbeirosData.find(b => b.id === barberId);
      barberName = selectedBarber ? selectedBarber.name : undefined;
    }

    onConfirm({
      type,
      amount: parseFloat(amount),
      category,
      barberName,
      description: description || (type === 'income' ? 'Nova Receita' : 'Nova Despesa'),
      date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      status: 'Pago'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-all duration-300">
      <div  className="bg-[#151515] w-full max-w-md rounded-xl border border-[#292929] shadow-2xl transform transition-all scale-100 opacity-100">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#292929]">
            <h2 className="text-lg font-bold text-[#DDDBCB]">Nova Transação</h2>
            <button onClick={onClose} className="text-[#5C5C5C] hover:text-[#DDDBCB]">
              <X className="w-5 h-5" />
            </button>
        </div>

         {/* Body */}
        <div className="p-6 space-y-5">
            {/* Type Switch */}
            <div className="flex bg-[#050505] p-1 rounded-lg">
              <button
                onClick={() => setType('income')}
                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all duration-200 ${type === 'income' ? 'bg-green-500/20 text-green-500 shadow-sm' : 'text-[#5C5C5C] hover:text-[#DDDBCB]'}`}
              >
                Receita
              </button>
              <button
                onClick={() => setType('expense')}
                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all duration-200 ${type === 'expense' ? 'bg-red-500/20 text-red-500 shadow-sm' : 'text-[#5C5C5C] hover:text-[#DDDBCB]'}`}
              >
                Despesa
              </button>
            </div>

            {/* Amount */}
          <div>
            <label className="block text-xs font-medium text-[#5C5C5C] mb-1">Valor (R$) *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C5C5C] font-bold">R$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                className="w-full bg-[#050505] border border-[#292929] rounded-lg py-2.5 pl-10 pr-4 text-[#DDDBCB] focus:outline-none focus:border-[#58BEC3] focus:ring-1 focus:ring-[#58BEC3] transition-all"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-[#5C5C5C] mb-1">Tipo de Gasto/Receita *</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#050505] border border-[#292929] rounded-lg py-2.5 px-4 text-[#DDDBCB] focus:outline-none focus:border-[#58BEC3] appearance-none transition-all"
              >
                <option value="" disabled>Selecione uma categoria</option>
                {(type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C5C5C] pointer-events-none" />
            </div>
          </div>

          {/* Barber (Conditional) */}
          {type === 'expense' && category === 'Pagamento Barbeiro' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-xs font-medium text-[#5C5C5C] mb-1">Selecione o Barbeiro *</label>
              <div className="relative">
                <select
                  value={barberId}
                  onChange={(e) => setBarberId(e.target.value)}
                  className="w-full bg-[#050505] border border-[#292929] rounded-lg py-2.5 px-4 text-[#DDDBCB] focus:outline-none focus:border-[#58BEC3] appearance-none transition-all"
                >
                  <option value="" disabled>Selecione o barbeiro</option>
                  {barbeirosData.filter(b => b.status === 'Ativo').map(barber => (
                    <option key={barber.id} value={barber.id}>{barber.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C5C5C] pointer-events-none" />
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-[#5C5C5C] mb-1">Descrição <span className="text-[#292929]">(Opcional)</span></label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes sobre a transação..."
              className="w-full bg-[#050505] border border-[#292929] rounded-lg py-2 px-4 text-[#DDDBCB] focus:outline-none focus:border-[#58BEC3] resize-none transition-all"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-5 border-t border-[#292929] gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[#5C5C5C] hover:text-[#DDDBCB] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className={`
              px-6 py-2 text-sm font-bold rounded-lg transition-all
              ${isValid
                ? 'bg-[#58BEC3] text-[#151515] hover:bg-[#7ADBE0] shadow-lg shadow-[#58BEC3]/20'
                : 'bg-[#292929] text-[#5C5C5C] cursor-not-allowed'}
            `}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal de Criação de novo Cliente no botão + Novo Agendamento
interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (appointment: any, clientData?: { name: string, isNew: boolean }) => void;
  onAddClient: (client: Client) => void;
  clients: Client[];
}

// Componente Modal Principal
const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({ isOpen, onClose, onConfirm, onAddClient, clients }) => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [localToast, setLocalToast] = useState<string | null>(null);

  const dates = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, []);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedService(null);
      setSelectedBarber(null);
      setSelectedDate(null);
      setSelectedTime(null);
      setClientSearch('');
      setSelectedClient(null);
      setIsCreatingClient(false);
      setNewClientName('');
      setNewClientEmail('');
      setNewClientPhone('');
      setLocalToast(null);
    }
  }, [isOpen]);

  const handleBack = () => {
    if(isCreatingClient) {
      setIsCreatingClient(false);
      return;
    }
    setStep(prev => prev - 1);
  };

  const filteredClients = useMemo(() => {
    if (!clientSearch) return [];
    return clients.filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase()));
  }, [clients, clientSearch]);

  const handleSaveClient = () => {
    if(!newClientName || !newClientEmail || !newClientPhone) return;

    const newClient: Client = {
       id: Math.random().toString(36).substr(2, 9),
       name: newClientName,
       email: newClientEmail,
       phone: newClientPhone,
       since: new Date().toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
       avatarColor: 'bg-indigo-500',
       lastVisit: '-'
    };

    onAddClient(newClient);
    setLocalToast('Cliente cadastrado com sucesso!');

    setTimeout(() => {
      setClientSearch(newClient.name); 
      setSelectedClient(newClient); 
      setIsCreatingClient(false); 
      setLocalToast(null);
    }, 1500);
  };

   const handleConfirmClick = () => {
    if (!selectedService || !selectedBarber || !selectedDate || !selectedTime) return;
    
    const clientName = selectedClient ? selectedClient.name : clientSearch;
    const isNewClient = !selectedClient && clientSearch.length > 0;

    if (!clientName) return;

    const dateStr = selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    
    onConfirm({
      date: dateStr,
      time: selectedTime,
      client: clientName,
      barber: selectedBarber.name,
      service: selectedService.name,
      value: selectedService.price,
      status: 'Confirmado'
    }, { name: clientName, isNew: isNewClient });
  };

  if (!isOpen) return null;
  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300" onClick={onClose}>
      <div className="bg-[#151515] w-full max-w-lg rounded-2xl border border-[#292929] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative" onClick={e => e.stopPropagation()}>
        {localToast && (
           <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
              <div className="bg-[#151515] border border-[#58BEC3] p-6 rounded-xl shadow-2xl flex flex-col items-center">
                 <div className="w-12 h-12 bg-[#58BEC3]/20 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle className="w-6 h-6 text-[#58BEC3]" />
                 </div>
                 <h4 className="text-[#DDDBCB] font-bold text-lg">Sucesso!</h4>
                 <p className="text-[#5C5C5C] text-sm">{localToast}</p>
              </div>
           </div>
        )}

        <div className="p-6 border-b border-[#292929] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {(step > 1 || isCreatingClient) && (
              <button onClick={handleBack} className="text-[#5C5C5C] hover:text-[#DDDBCB] transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h3 className="text-xl font-bold text-[#DDDBCB]">{isCreatingClient ? 'Cadastrar Cliente' : 'Novo Agendamento'}</h3>
              {!isCreatingClient && <p className="text-xs text-[#58BEC3] font-semibold uppercase tracking-wider">Etapa {step}/4</p>}
            </div>
          </div>
          <button onClick={onClose} className="text-[#5C5C5C] hover:text-[#DDDBCB]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {!isCreatingClient && step === 1 && (
            <div className="space-y-3 animate-in slide-in-from-right duration-300">
              <h4 className="text-[#DDDBCB] mb-4 font-medium">Selecione o serviço</h4>
              {MOCK_SERVICES.map(s => (
                <button 
                  key={s.id} 
                  onClick={() => { setSelectedService(s); setStep(2); }}
                  className="w-full flex justify-between items-center p-4 bg-[#0C0C0C] hover:bg-[#292929] rounded-lg border border-[#292929] hover:border-[#58BEC3]/50 group transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#151515] rounded-md text-[#5C5C5C] group-hover:text-[#58BEC3] transition-colors">
                       <Scissors className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[#DDDBCB] font-medium">{s.name}</p>
                      <p className="text-xs text-[#5C5C5C]">{s.duration} min</p>
                    </div>
                  </div>
                  <span className="text-[#58BEC3] font-bold">{s.price}</span>
                </button>
              ))}
            </div>
          )}

          {!isCreatingClient && step === 2 && (
            <div className="space-y-3 animate-in slide-in-from-right duration-300">
               <h4 className="text-[#DDDBCB] mb-4 font-medium">Selecione o profissional</h4>
               {barbeirosData.filter(b => b.status === 'Ativo').map(b => (
                 <button
                    key={b.id}
                    onClick={() => { setSelectedBarber(b); setStep(3); }}
                    className="w-full flex items-center gap-4 p-4 bg-[#0C0C0C] hover:bg-[#292929] rounded-lg border border-[#292929] hover:border-[#58BEC3]/50 transition-all text-left group"
                 >
                    <div className="w-12 h-12 rounded-full bg-[#151515] border border-[#292929] flex items-center justify-center text-[#DDDBCB] font-bold group-hover:border-[#58BEC3]">
                      {b.initials}
                    </div>
                    <div>
                      <span className="text-[#DDDBCB] font-bold text-lg block">{b.name}</span>
                      <span className="text-xs text-[#5C5C5C]">Disponível</span>
                    </div>
                 </button>
               ))}
            </div>
          )}

          {!isCreatingClient && step === 3 && (
            <div className="space-y-3 animate-in slide-in-from-right duration-300">
              <h4 className="text-[#DDDBCB] mb-4 font-medium">Data e Horário</h4>
              
              <div className="flex gap-3 overflow-x-auto pb-4 mb-6 custom-scrollbar">
                {dates.map(d => {
                  const isSelected = selectedDate?.toDateString() === d.toDateString();
                  return (<button 
                      key={d.toISOString()}
                      onClick={() => { setSelectedDate(d); setSelectedTime(null); }}
                      className={`min-w-[70px] h-20 rounded-lg flex flex-col items-center justify-center border transition-all flex-shrink-0 ${isSelected ? 'bg-[#58BEC3] border-[#58BEC3] text-[#151515]' : 'bg-[#0C0C0C] border-[#292929] text-[#5C5C5C] hover:border-[#58BEC3]/50 hover:text-[#DDDBCB]'}`}
                    >
                      {/* [CORREÇÃO] Convertendo Data para String */}
                      <span className="text-xs uppercase font-bold">{String(d.toLocaleDateString('pt-BR', {weekday: 'short'}).slice(0,3))}</span>
                      <span className="text-2xl font-bold">{String(d.getDate())}</span>
                    </button>
                    )
                })}
              </div>
            </div>
          )}

          {selectedDate ? (
                <div className="grid grid-cols-3 gap-3">
                  {AVAILABLE_TIMES.map(t => (
                    <button
                      key={t}
                      onClick={() => { setSelectedTime(t); setStep(4); }}
                      className={`py-3 rounded-md text-sm font-bold transition-all border ${selectedTime === t ? 'bg-[#DDDBCB] text-[#151515] border-[#DDDBCB]' : 'bg-[#0C0C0C] text-[#DDDBCB] border-[#292929] hover:border-[#58BEC3] hover:text-[#58BEC3]'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-[#5C5C5C] border border-dashed border-[#292929] rounded-lg">
                   <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50"/>
                   <p>Selecione uma data acima</p>
                </div>
              )}

          {!isCreatingClient && step === 4 && (
            <div className="animate-in slide-in-from-right duration-300">
              <h4 className="text-[#DDDBCB] mb-4 font-medium">Identifique o Cliente</h4>
                
                <div className="flex gap-2 mb-6">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      value={selectedClient ? selectedClient.name : clientSearch}
                      onChange={(e) => {
                          setClientSearch(e.target.value);
                          setSelectedClient(null);
                      }}
                      placeholder="Nome do cliente..."
                      className="w-full bg-[#0C0C0C] border border-[#292929] text-[#DDDBCB] px-4 py-3 pl-10 rounded-lg focus:outline-none focus:border-[#58BEC3] focus:ring-1 focus:ring-[#58BEC3]"
                    />
                    <Search className="w-5 h-5 text-[#5C5C5C] absolute left-3 top-1/2 -translate-y-1/2" />

                    {!selectedClient && clientSearch.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#151515] border border-[#292929] rounded-lg shadow-xl z-20 overflow-hidden">
                          {filteredClients.length > 0 ? filteredClients.map(c => (
                              <button 
                                key={c.id}
                                onClick={() => { setSelectedClient(c); setClientSearch(''); }}
                                className="w-full text-left px-4 py-3 hover:bg-[#292929] text-[#DDDBCB] flex items-center justify-between group"
                              >
                                <span>{c.name}</span>
                                <span className="text-xs text-[#5C5C5C] group-hover:text-[#58BEC3]">Existente</span>
                              </button>
                          )) : (
                            <div className="px-4 py-3 text-[#5C5C5C] text-sm text-center">Nenhum cliente encontrado.</div>
                          )}
                        </div>
                    )}
                  </div>

                  {/* [NOVO AGENDAMENTO] Botão + para adicionar cliente novo */}
                  <button 
                     onClick={() => setIsCreatingClient(true)}
                     className="bg-[#292929] hover:bg-[#58BEC3] hover:text-[#151515] text-[#DDDBCB] px-4 rounded-lg border border-[#292929] transition-colors flex items-center justify-center"
                     title="Novo Cliente"
                  >
                     <Plus className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-[#0C0C0C] rounded-lg p-4 border border-[#292929] space-y-3">
                   <div className="flex justify-between items-center border-b border-[#292929] pb-2">
                      <span className="text-[#5C5C5C] text-sm">Serviço</span>
                      <span className="text-[#DDDBCB] font-medium">{selectedService?.name}</span>
                   </div>
                   <div className="flex justify-between items-center border-b border-[#292929] pb-2">
                      <span className="text-[#5C5C5C] text-sm">Profissional</span>
                      <span className="text-[#DDDBCB] font-medium">{selectedBarber?.name}</span>
                   </div>
                   <div className="flex justify-between items-center border-b border-[#292929] pb-2">
                      <span className="text-[#5C5C5C] text-sm">Data/Hora</span>
                      <span className="text-[#DDDBCB] font-medium">
                        {selectedDate ? `${String(selectedDate.toLocaleDateString('pt-BR', {day:'2-digit', month:'2-digit'}))} às ${selectedTime}` : ''}
                      </span>
                   </div>
                   <div className="flex justify-between items-center pt-1">
                      <span className="text-[#5C5C5C] text-sm">Total</span>
                      <span className="text-[#58BEC3] font-bold text-lg">{selectedService?.price}</span>
                   </div>
                </div>
            </div>
          )}

          {/* [NOVO AGENDAMENTO] Formulário de Cadastro de Cliente */}
          {isCreatingClient && (
            <div className="animate-in slide-in-from-right duration-300 space-y-4">
                <div className="bg-[#0C0C0C] p-4 rounded-lg border border-[#292929] mb-4">
                  <p className="text-sm text-[#5C5C5C] mb-4">Preencha os dados abaixo para cadastrar um novo cliente.</p>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-[#DDDBCB] mb-1">Nome Completo *</label>
                      <input 
                        type="text" 
                        value={newClientName} 
                        onChange={e => setNewClientName(e.target.value)}
                        className="w-full bg-[#151515] border border-[#292929] rounded-lg py-2.5 px-4 text-[#DDDBCB] focus:border-[#58BEC3] focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#DDDBCB] mb-1">Email *</label>
                      <input 
                        type="email" 
                        value={newClientEmail} 
                        onChange={e => setNewClientEmail(e.target.value)}
                        className="w-full bg-[#151515] border border-[#292929] rounded-lg py-2.5 px-4 text-[#DDDBCB] focus:border-[#58BEC3] focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#DDDBCB] mb-1">Telefone *</label>
                      <input 
                        type="tel" 
                        value={newClientPhone} 
                        onChange={e => setNewClientPhone(e.target.value)}
                        className="w-full bg-[#151515] border border-[#292929] rounded-lg py-2.5 px-4 text-[#DDDBCB] focus:border-[#58BEC3] focus:outline-none" 
                      />
                    </div>
                </div>
              </div>

              <button 
                   onClick={handleSaveClient}
                   disabled={!newClientName || !newClientEmail || !newClientPhone}
                   className={`w-full font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${(!newClientName || !newClientEmail || !newClientPhone) ? 'bg-[#292929] text-[#5C5C5C] cursor-not-allowed' : 'bg-[#58BEC3] hover:bg-[#7ADBE0] text-[#151515]'}`}
                >
                   <Save className="w-4 h-4"/>
                   Salvar Cliente
                </button>
            </div>
          )}
        </div>

        {!isCreatingClient && step === 4 && (
           <div className="p-4 border-t border-[#292929] bg-[#151515] flex-shrink-0">
              <button 
                 onClick={handleConfirmClick}
                 disabled={!selectedClient && clientSearch.length === 0}
                 className={`w-full font-bold py-3 rounded-lg transition-all shadow-lg ${(!selectedClient && clientSearch.length === 0) ? 'bg-[#292929] text-[#5C5C5C] cursor-not-allowed' : 'bg-[#58BEC3] hover:bg-[#7ADBE0] text-[#151515] shadow-[#58BEC3]/20'}`}
              >
                 Confirmar Agendamento
              </button>
           </div>
        )}
      </div>
    </div>
  )
}

// Modal de Detalhes do Cliente (Histórico)
const ClientDetailsModal: React.FC<{client: Client | null, isOpen: boolean, onClose: () => void}> = ({ client, isOpen, onClose }) => {
  if (!isOpen || !client) return null;

  // Filtrar agendamentos deste cliente
  const history = appointmentsData.filter(app => app.client === client.name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-all duration-300 animate-in fade-in">
      <div className="bg-[#151515] w-full max-w-2xl rounded-xl border border-[#292929] shadow-2xl overflow-hidden">
        
        {/* Header com Avatar e Info */}
        <div className="bg-[#0C0C0C] p-6 border-b border-[#292929] flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 rounded-full ${client.avatarColor} flex items-center justify-center text-2xl font-bold text-white border-4 border-[#151515]`}>
               {client.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#DDDBCB]">{client.name}</h2>
              <div className="flex flex-col text-sm text-[#5C5C5C]">
                <span className="flex items-center gap-2"><Mail className="w-3 h-3"/> {client.email}</span>
                <span className="flex items-center gap-2"><Phone className="w-3 h-3"/> {client.phone}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-[#5C5C5C] hover:text-[#DDDBCB] p-2 hover:bg-[#292929] rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Conteúdo: Histórico */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-[#DDDBCB] mb-4 flex items-center">
            <History className="w-5 h-5 mr-2 text-[#58BEC3]" />
            Histórico de Agendamentos
          </h3>

          {history.length > 0 ? (
            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
              {history.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 bg-[#0C0C0C] border border-[#292929] rounded-lg hover:border-[#58BEC3]/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center bg-[#151515] p-2 rounded border border-[#292929] min-w-[60px]">
                       <span className="text-xs text-[#5C5C5C]">{app.date.split('/')[1]}</span>
                       <span className="text-lg font-bold text-[#DDDBCB]">{app.date.split('/')[0]}</span>
                    </div>
                    <div>
                      <p className="text-[#DDDBCB] font-medium">{app.service}</p>
                      <p className="text-xs text-[#5C5C5C]">Barbeiro: {app.barber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                     <p className="text-[#58BEC3] font-bold">{app.value}</p>
                     <span className={`text-xs px-2 py-0.5 rounded ${app.status === 'Concluído' ? 'bg-green-500/10 text-green-500' : app.status === 'Pendente' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-gray-500/10 text-gray-400'}`}>
                        {app.status}
                     </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="text-center py-10 text-[#5C5C5C] border border-dashed border-[#292929] rounded-lg">
                <History className="w-10 h-10 mx-auto mb-2 opacity-20" />
                <p>Nenhum histórico encontrado para este cliente.</p>
             </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="bg-[#0C0C0C] p-4 border-t border-[#292929] grid grid-cols-3 gap-4 text-center">
           <div>
              <p className="text-xs text-[#5C5C5C]">Total Visitas</p>
              <p className="text-lg font-bold text-[#DDDBCB]">{history.length}</p>
           </div>
           <div>
              <p className="text-xs text-[#5C5C5C]">Gasto Total</p>
              <p className="text-lg font-bold text-[#58BEC3]">
                R$ {history.reduce((acc, curr) => acc + parseFloat(curr.value.replace('R$', '').replace(',', '.')), 0).toFixed(2)}
              </p>
           </div>
           <div>
              <p className="text-xs text-[#5C5C5C]">Última Visita</p>
              <p className="text-lg font-bold text-[#DDDBCB]">{client.lastVisit}</p>
           </div>
        </div>
      </div>
    </div>
  )
}

const Toast: React.FC<{ message: string, onClose: () => void }> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 right-6 z-[60] bg-[#151515] border border-[#58BEC3] rounded-lg shadow-2xl p-4 flex items-center gap-3 animate-in slide-in-from-right duration-300">
      <div className="bg-[#58BEC3]/20 p-2 rounded-full">
        <CheckCircle className="w-5 h-5 text-[#58BEC3]" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-[#DDDBCB]">Sucesso!</h4>
        <p className="text-xs text-[#5C5C5C]">{message}</p>
      </div>
      <button onClick={onClose} className="ml-4 text-[#5C5C5C] hover:text-[#DDDBCB]">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Componente Conteúdo Principal
const DashboardContent: React.FC<{
  onOpenNewAppointment: () => void, 
  appointments: Appointment[],
  activeBarbers: ActiveBarber[]}> = ({ onOpenNewAppointment, appointments, activeBarbers }) => (
  <div className="animate-in fade-in duration-500">
    <h1 className="text-3xl font-bold text-[#DDDBCB] mb-6">Dashboard</h1>

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
              id="d1"
              date="19/11"
              time="10:00" 
              client="Carlos Pereira" 
              barber="Nome Barbeiro" 
              service="Corte" 
              value="R$50,00" 
              status="Pendente" 
            />
            <AppointmentItem 
              id="d1"
              date="19/11"
              time="11:00" 
              client="Otávio Augusto" 
              barber="Nome Barbeiro" 
              service="Corte" 
              value="R$50,00" 
              status="Confirmado" 
            />
          </div>
        </div>
      </div>

      {/* Coluna Direita: Ações e Barbeiros Ativos */}
      <div className="w-full lg:w-80">
        <button 
          onClick={onOpenNewAppointment}
          className="w-full bg-[#58BEC3] hover:bg-[#7ADBE0] text-[#151515] font-bold py-3 px-4 rounded-lg transition-colors mb-8 shadow-lg shadow-[#58BEC3]/10"
        >
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
  </div>
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
            <h3 className="text-xl font-semibold text-[#DDDBCB]">{barber.name}</h3>
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

// Componente Tela de Barbeiros
const BarbeirosContent: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('Ativos');
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredBarbeiros = barbeirosData
    .filter(barber => barber.status === (activeTab === 'Ativos' ? 'Ativo' : 'Desativo'))
    .filter(barber => barber.name.toLowerCase().includes(searchQuery.toLowerCase()));


  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold text-[#DDDBCB]">Barbeiros</h1>
        <button className="flex items-center justify-center space-x-2 bg-[#58BEC3] hover:bg-[#7ADBE0] text-[#151515] font-bold py-3 px-5 rounded-lg transition-colors">
          <Plus className="w-5 h-5"/>
          <span>Novo Barbeiro</span>
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col md:flex-row md:items-center justify-left gap-4 mb-6 bg-[#151515] p-2 rounded-lg">
        <div className="flex items-center bg-black p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('Ativos')}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium ${
              activeTab === 'Ativos'
                ? 'bg-[#58BEC3] text-[#151515] shadow'
                : 'hover:text-[#AAAAAA] hover:bg-[#292929] text-[#5c5c5c]'}`}
            >Ativos </button>

          <button 
            onClick={() => setActiveTab('Desativos')}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium ${
              activeTab === 'Desativos'
                ? 'bg-[#58BEC3] text-[#151515] shadow'
                : 'hover:text-[#AAAAAA] hover:bg-[#292929] text-[#5c5c5c]'}`}
          >Desativos </button>
        </div>

        <div className="relative flex-1 md:max-w-xs">
          <input
            type="text"
            placeholder="Buscar barbeiro pelo nome..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#151515] text-sm font-semibold text-[#DDDBCB] placeholder-[#5C5C5C] px-4 py-2 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-[#58BEC3]"
          />
          <Search className="w-5 h-5 text-[#DDDBCB] absolute left-3 top-1/2 -translate-y-1/2"/>
        </div>
      </div>

      {/* Grid de Barbeiros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 x1:grid-cols-4 gap-6">
        {filteredBarbeiros.map(barber => (
          <BarbeirosCard key={barber.id} barber={barber} />
        ))}
      </div>
    </>
  );


}

// Componente Tela de Agendamentos
// Componente Agendamento Status Bridge - Exibir status do agendamento para a tabela principal
const AgendamentoStatusBridge: React.FC<{status: AppointmentStatus }> = ({status}) => {
  const statusStyles: Record<AppointmentStatus, {icon: React.ElementType, color: string}> = {
    'Concluído': {icon: Check, color: '#58BEC3'},
    'Cancelado': {icon: UserX, color: '#5c5c5c'},
    'Pendente': {icon: Clock, color: '#DDDBCB'},
    'Confirmado': {icon: Check, color: '#58BEC3'}
  };

  const{icon: Icon, color} = statusStyles[status];

  return(
    <span className={`flex items-center gap-1.5 text-sm font-medium ${color}`}>
      <Icon className="w-4 h-4"/>
      {status}
    </span>
  );
};

// Componente AgendamentosContent (Página Principal de Agendamentos)
const AgendamentosContent: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('Todos');
  
  const filteredAppointments = appointmentsData
    .filter(app => statusFilter === 'Todos' || app.status === statusFilter)
    .filter(app => app.barber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   app.client.toLowerCase().includes(searchQuery.toLowerCase())
            );
  
  return(
    <>
      {/* Header */}
      <h1 className="text-3xl font-bold text-[#DDDBCB] mb-6">Agendamentos</h1>
       {/* Filtros e Busca */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-[#151515] p-2 rounded-lg">
        {/* Search Bar */}
        <div className="relative flex-1 ">
          <input
            type="text"
            placeholder="Buscar por cliente ou barbeiro..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#050505] text-sm font-semibold text-[#DDDBCB] placeholder-[#5C5C5C] px-4 py-2 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-[#58BEC3]"
          />
          <Search className="w-5 h-5 text-[#DDDBCB] absolute left-3 top-1/2 -translate-y-1/2"/>
        </div>

        {/* Status Filter */}
        <div className="relative bg-[#050505] md:max-w-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-[#58BEC3]">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm font-semibold text-[#DDDBCB] px-4 py-3 appearance-[#DDDBCB]"
            >
              <option value="Todos">Todos</option>
              <option value="Concluído">Concluído</option>
              <option value="Pendente">Pendente</option>
              <option value="Cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      {/* Tabela de Agendamentos */}
      <div className="bg-[#151515] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <div className="w-full min-w-[700px]">
            {/* Cabeçalho */}
            <thead className="bg-[#0c0c0c]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#5C5C5C] uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#5C5C5C] uppercase tracking-wider">Data/Hora</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#5C5C5C] uppercase tracking-wider">Barbeiro</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#5C5C5C] uppercase tracking-wider">Serviço</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#5C5C5C] uppercase tracking-wider">Valor</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#5C5C5C] uppercase tracking-wider">Status</th>
              </tr>
            </thead>

            {/* Corpo */}
            <tbody className="divide-y divide-[#0c0c0c]">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((app) => (
                  <tr       
                    key={app.id}
                    className="hover:bg-[#0c0c0c] transition-colors">
                    
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-ms font-medium text-[#DDDBCB]">{app.client}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-[#DDDBCB]">{app.date}</span>
                        <span className="block text-xs text-[#5c5c5c]">{app.time}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-[#DDDBCB]">{app.barber}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-[#DDDBCB]">{app.service}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-[#DDDBCB]">{app.value}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <AgendamentoStatusBridge status={app.status}/>
                      </td>
                  </tr>
                ))

                ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 px-6 text-[#5C5C5C]">
                    Nenhum agendamento encontrado.
                  </td>
                </tr>
              )}

            </tbody>
          </div>
        </div>
      </div>
    </>
  )
}

// Componente GestãoFinanceira
const FinancialContent: React.FC = () => {
    const [periodFilter, setPeriodFilter] = React.useState<'Semanal' | 'Mensal' | 'Total'>('Semanal');
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactionsData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Simulação de filtro de valores baseados no período
    const metrics = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const displayIncome = totalIncome;
    const displayExpense = totalExpense;

    return {
      revenue: displayIncome,
      expenses: displayExpense,
      profit: displayIncome - displayExpense,
      projection: displayIncome * 1.2,
      ticket: 60.00
    };
  }, [transactions, periodFilter]);

  const handleAddTransaction = (newTxData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      ...newTxData
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setIsModalOpen(false);
    setToastMessage("Transação registrada com sucesso!");
  };
  
  // Dados aleatórios estáticos para o gráfico para evitar que as barras "dancem" na renderização.
  const chartData = useMemo(() => {
    return ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'].map((day) => ({
      day,
      height: Math.floor(Math.random() * (80 - 20 + 1) + 20)
    }));
  }, []);

    return (
      <div className="animate-in fade-in duration-500">
        {/* Estilos Globais Locais */}
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #151515;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #292929;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #58BEC3;
          }
        `}</style>

        {/* Toast Popup */}
        {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
        
        {/* Modal */}
        <AddTransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleAddTransaction}
        />

        {/* Header e Filtros */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#DDDBCB]">Gestão Financeira</h1>
            <p className="text-[#5C5C5C] text-sm mt-1">Acompanhe o fluxo de caixa e projeções financeiras.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#151515] p-1 rounded-lg flex items-center border border-[#292929]">
              {(['Semanal', 'Mensal', 'Total'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setPeriodFilter(filter)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${periodFilter === filter
                      ? 'bg-[#58BEC3] text-[#151515] shadow-lg'
                      : 'text-[#5C5C5C] hover:text-[#DDDBCB] hover:bg-[#292929]'
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#58BEC3] hover:bg-[#7ADBE0] text-[#151515] font-bold py-2.5 px-4 rounded-lg transition-colors flex items-center shadow-lg shadow-[#58BEC3]/10"
            >
              <Plus className="w-5 h-5 md:mr-2" />
              <span className="hidden md:inline">Nova Transação</span>
            </button>
          </div>
        </div>

        {/* Cards Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={DollarSign}
            title="Receita Total"
            value={`R$ ${metrics.revenue.toFixed(2)}`}
            trend="+12%"
            trendType="up"
          />
          <StatsCard
            icon={TrendingUp}
            title="Projeção (7 dias)"
            value={`R$ ${metrics.projection.toFixed(2)}`}
            trend="+5%"
            trendType="up"
          />
          <StatsCard
            icon={Percent}
            title="Ticket Médio"
            value={`R$ ${metrics.ticket.toFixed(2)}`}
            trend="0%"
            trendType="neutral"
          />
          <StatsCard
            icon={Wallet}
            title="Despesas"
            value={`R$ ${metrics.expenses.toFixed(2)}`}
            trend="-2%"
            trendType="down"
          />
        </div>
        
        {/* Gráfico e Histórico */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Esquerda: Gráfico (2/3) */}
          <div className="lg:col-span-2 bg-[#151515] p-6 rounded-lg flex flex-col h-[450px] border border-[#292929]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#DDDBCB]">Fluxo de Receita</h3>
              <div className="flex items-center space-x-3 text-xs text-[#5C5C5C]">
                <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-[#58BEC3] mr-1"></div> Receita</span>
                <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-[#292929] border border-[#5C5C5C] mr-1"></div> Despesa</span>
              </div>
          </div>
         
          {/* Visualização Gráfica Customizada */}
          <div className="flex-1 flex items-end justify-between gap-4 px-2 pb-2 border-b border-[#292929] border-l border-[#292929]/50">
            {chartData.map((item) => (
              <div key={item.day} className="flex flex-col items-center justify-end flex-1 group h-full relative">
                {/* Tooltip */}
                <div className="absolute -top-10 bg-[#DDDBCB] text-[#050505] text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 whitespace-nowrap shadow-xl translate-y-2 group-hover:translate-y-0 pointer-events-none">
                  R$ {item.height * 10},00
                  <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-[#DDDBCB] rotate-45"></div>
                </div>

                {/* Bar */}
                <div
                  className="w-full max-w-[40px] bg-[#58BEC3] rounded-t-sm opacity-80 group-hover:opacity-100 transition-all duration-300 hover:shadow-[0_0_15px_rgba(88,190,195,0.3)]"
                  style={{ height: `${item.height}%` }}
                ></div>
                <span className="text-xs text-[#5C5C5C] mt-3 font-medium">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

         {/* Coluna Direita: Transações Recentes (1/3) */}
        <div className="bg-[#151515] p-6 rounded-lg flex flex-col h-[450px] border border-[#292929]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[#DDDBCB]">Transações</h3>
            <button className="text-[#58BEC3] text-xs hover:underline font-semibold transition-colors">Ver todas</button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-[#5C5C5C]">
                <p className="text-sm">Nenhuma transação encontrada.</p>
              </div>
            ) : (
              transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-[#0C0C0C] rounded-lg border border-transparent hover:border-[#292929] transition-colors group">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${transaction.type === 'income' ? 'bg-[#58BEC3]/10 text-[#58BEC3]' : 'bg-red-500/10 text-red-500'}`}>
                      {transaction.type === 'income' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-[#DDDBCB] truncate">{transaction.category}</p>
                      <p className="text-xs text-[#5C5C5C] truncate">
                        {transaction.barberName ? `Barbeiro: ${transaction.barberName}` : transaction.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className={`text-sm font-bold ${transaction.type === 'income' ? 'text-[#58BEC3]' : 'text-red-400'}`}>
                      {transaction.type === 'income' ? '+ ' : '- '}
                      R$ {transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-[#5C5C5C]">{transaction.date}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-[#292929]">
            <div className="flex justify-between items-center">
              <span className="text-[#5C5C5C] text-sm">Saldo Atual</span>
              <span className={`font-bold text-lg ${(metrics.revenue - metrics.expenses) >= 0 ? 'text-[#58BEC3]' : 'text-red-500'}`}>
                R$ {(metrics.revenue - metrics.expenses).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    );
}

// Componente Clientes
const ClientesContent: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(initialClientsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery)
  );

  const handleDeleteClient = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Previne abrir o modal
    if(confirm('Tem certeza que deseja remover este cliente?')) {
      setClients(prev => prev.filter(c => c.id !== id));
      setToastMessage("Cliente removido com sucesso.");
    }
  };
  
  return(
    <div className="animate-in fade-in duration-500">
      {/* Toast de Sucesso */}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}

      {/* Modal de Detalhes */}
      <ClientDetailsModal 
        client={selectedClient} 
        isOpen={!!selectedClient} 
        onClose={() => setSelectedClient(null)} 
      />

      {/* Header e Busca */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#DDDBCB]">Meus Clientes</h1>
          <p className="text-[#5C5C5C] text-sm mt-1">Gerencie a base de clientes e veja o histórico.</p>
        </div>

        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="Buscar por nome, email ou telefone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#151515] border border-[#292929] text-sm font-semibold text-[#DDDBCB] placeholder-[#5C5C5C] px-4 py-3 rounded-lg pl-10 focus:outline-none focus:border-[#58BEC3] focus:ring-1 focus:ring-[#58BEC3] transition-all shadow-lg"
          />
          <Search className="w-5 h-5 text-[#5C5C5C] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Lista de Clientes */}
      {filteredClients.length === 0 ? (
        <div className="bg-[#151515] p-10 rounded-lg border border-[#292929] text-center flex flex-col items-center">
           <UserX className="w-16 h-16 text-[#292929] mb-4"/>
           <p className="text-[#5C5C5C]">Nenhum cliente encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <div 
              key={client.id}
              onClick={() => setSelectedClient(client)}
              className="bg-[#151515] rounded-xl border border-[#292929] p-6 hover:border-[#58BEC3] transition-all cursor-pointer group relative overflow-hidden"
            >
              {/* Hover Effect bg */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#58BEC3]/0 to-[#58BEC3]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className={`w-12 h-12 rounded-full ${client.avatarColor} flex items-center justify-center text-lg font-bold text-white shadow-lg`}>
                  {client.name.substring(0, 2).toUpperCase()}
                </div>
                <button 
                  onClick={(e) => handleDeleteClient(e, client.id)}
                  className="text-[#292929] group-hover:text-red-500 hover:bg-red-500/10 p-2 rounded-full transition-colors"
                  title="Remover Cliente"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="relative z-10">
                <h3 className="text-lg font-bold text-[#DDDBCB] mb-1 group-hover:text-[#58BEC3] transition-colors">{client.name}</h3>
                
                <div className="space-y-2 mt-4">
                  <div className="flex items-center text-sm text-[#5C5C5C]">
                    <Mail className="w-4 h-4 mr-2 text-[#292929] group-hover:text-[#58BEC3] transition-colors" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-[#5C5C5C]">
                    <Phone className="w-4 h-4 mr-2 text-[#292929] group-hover:text-[#58BEC3] transition-colors" />
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-[#5C5C5C]">
                     <Clock className="w-4 h-4 mr-2 text-[#292929] group-hover:text-[#58BEC3] transition-colors" />
                     <span>Cliente desde {client.since}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-[#292929] flex items-center justify-between relative z-10">
                 <span className="text-xs text-[#5C5C5C]">Última visita: <span className="text-[#DDDBCB]">{client.lastVisit}</span></span>
                 <div className="flex items-center text-[#58BEC3] text-xs font-bold">
                    <History className="w-3 h-3 mr-1" />
                    Ver Histórico
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

//Componente App
const App: React.FC = () => {

  // Estado para controlar a página atual
  const [currentPage, setCurrentPage] = React.useState('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // [MENU HAMBURGUER] 8. Estado global que controla a visibilidade
  
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointmentsData);
  const [clients, setClients] = useState<Client[]>(initialClientsData);


  // Estado para controlar a visibilidade do modal
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddClient = (newClient: Client) => {
    setClients(prev => [newClient, ...prev]);
  };

  // Função para processar a criação do agendamento
  const handleCreateAppointment = (newAppointmentData: any, clientData?: { name: string, isNew: boolean }) => {
    const newAppointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      ...newAppointmentData
    };
    setAppointments(prev => [newAppointment, ...prev]);

    if (clientData && clientData.isNew) {
       const newClient: Client = {
         id: Math.random().toString(36).substr(2, 9),
         name: clientData.name,
         email: 'pendente@email.com', 
         phone: '(00) 00000-0000', 
         since: new Date().toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
         lastVisit: newAppointmentData.date,
         avatarColor: 'bg-gray-500'
       };
       setClients(prev => [newClient, ...prev]);
       setToastMessage(`Agendamento criado e cliente "${clientData.name}" cadastrado!`);
    } else {
       setToastMessage("Agendamento criado com sucesso!");
    }

    setIsNewAppointmentOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans selection:bg-[#58BEC3] selection:text-[#050505]">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}

      {/* A Sidebar agora recebe o estado da página e a função para alterá-lo */}
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isOpen={isMobileMenuOpen} // [MENU HAMBURGUER] 9. Passando o estado
        onClose={() => setIsMobileMenuOpen(false)} // [MENU HAMBURGUER] 10. Passando a função de fechar
      />

      {/* Renderização do Modal NOVO AGENDAMENTO */}
      <NewAppointmentModal 
        isOpen={isNewAppointmentOpen} 
        onClose={() => setIsNewAppointmentOpen(false)} 
        onConfirm={handleCreateAppointment}
        onAddClient={handleAddClient}
        clients={clients}
      />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 min-h-screen overflow-x-hidden">

        {/* Mobile Header Toggle */}
        {/* [MENU HAMBURGUER] 11. Cabeçalho visível APENAS em Mobile (md:hidden) */}
        <div className="md:hidden flex items-center justify-between mb-6 bg-[#151515] p-4 rounded-lg border border-[#292929]">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#58BEC3] rounded-lg flex items-center justify-center text-[#151515]">
                <User className="w-5 h-5" />
              </div>
              <span className="font-bold text-[#DDDBCB]">Barbearia</span>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(true)} // [MENU HAMBURGUER] 12. Ação de clicar no ícone para abrir o menu
              className="text-[#DDDBCB] hover:text-[#58BEC3] p-1"
            >
              <Menu className="w-6 h-6" />
          </button>
        </div>
        
        <div className="max-w-7xl mx-auto">
          {currentPage === 'Dashboard' && (
            <DashboardContent 
              onOpenNewAppointment={() => setIsNewAppointmentOpen(true)} 
              appointments={appointments}
              activeBarbers={activeBarbersData}
            />
          )}
          {currentPage === 'Barbeiros' && <BarbeirosContent />}
          {currentPage === 'Agendamentos' && <AgendamentosContent />}
          {currentPage === 'Gestão Financeira' && <FinancialContent />}
          {currentPage === 'Clientes' && <ClientesContent />}
        </div>
    </main>
  </div>
)
}

export default App;
