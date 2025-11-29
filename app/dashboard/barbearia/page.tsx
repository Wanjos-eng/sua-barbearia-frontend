'use client';
// app/barbershop/dashboard/page.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Save,
  MoreVertical,
  Link,
  Clock3,
  Shield,
  Copy,
  Star,
} from 'lucide-react';
import { professionalService } from '@/services/professionalService';
import { serviceService } from '@/services/serviceService';
import { barberShopService } from '@/services/barberShopService';
import { appointmentService } from '@/services/appointmentService';
import { financeiroService } from '@/services/financeiroService';
import { DashboardMetricas, RelatorioGeral } from '@/types/api';

// Tipos (Typescript)

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isOpen: boolean; // [MENU HAMBURGUER] 2. Propriedade para saber se o menu está visível
  onClose: () => void; // [MENU HAMBURGUER] 3. Função para fechar o menu
}
interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
}

interface StatsCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  // trend?: string;
  // trendType?: 'up' | 'down' | 'neutral';
  //iconBgColor: string;
}

interface Appointment {
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



interface Barber {
  id: string;
  initials: string;
  name: string;
  ativo: boolean;
  email: string;
  phone: string;
  cpf: string; // ou CPF, como na imagem
  profissao?: string; // Tipo de profissional
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
  onConfirm: (transaction: Omit<Transaction, 'id'> | Transaction) => void;
  initialData?: Transaction;
  isEditing?: boolean;
}

interface AddProfessionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  barbeariaId: number;
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
      ${active
        ? 'bg-[#292929] text-[#DDDBCB]'
        : 'hover:bg-[#292929] hover:text-[#DDDBCB]'
      }
    `}
  >
    <Icon className="w-5 h-5 mr-3 stroke-[#58BEC3]" />
    <span>{label}</span>
  </button>)
};

//Componente Barra Lateral
const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isOpen, onClose }) => {
  const navItems = [
    { icon: LayoutGrid, label: 'Dashboard' },
    { icon: Users, label: 'Profissionais' },
    { icon: Scissors, label: 'Serviços' },
    { icon: Calendar, label: 'Agendamentos' },
    { icon: Star, label: 'Avaliações' },
    { icon: DollarSign, label: 'Gestão Financeira' },
    { icon: User, label: 'Clientes' },
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

        <h1 className="text-2xl font-bold text-center text-[#58BEC3] mb-10 my-5 tracking-tight">
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};

//Componente Cartão de Estatísticas

const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, title, value }) => (
  <div className="bg-[#151515] p-5 rounded-lg flex items-center space-x-4">
    <div className="p-3 rounded-lg bg-[#5C5C5C]">
      <Icon className="w-6 h-6 text-[#DDDBCB]" />
    </div>
    <div>
      <p className="text-sm text-[#5C5C5C]">{title}</p>
      <p className="text-2x1 font-bold text-[#DDDBCB]">{value}</p>
    </div>
  </div>

);

//Componente Item de Agendamento



// Componente Item de Barbeiro Ativo


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


// Dados Iniciais de Clientes (Combinando com os nomes dos agendamentos)
const initialClientsData: Client[] = [
  { id: 'c1', name: 'Carlos Pereira', email: 'carlos.p@email.com', phone: '(11) 99999-1111', since: 'Jan 2023', lastVisit: '09/11/2024', avatarColor: 'bg-blue-500' },
  { id: 'c2', name: 'Otávio Augusto', email: 'otavio.a@email.com', phone: '(11) 99999-2222', since: 'Mar 2023', lastVisit: '09/11/2024', avatarColor: 'bg-green-500' },
  { id: 'c3', name: 'Marcos Santos', email: 'marcos.s@email.com', phone: '(11) 99999-3333', since: 'Jun 2023', lastVisit: '09/11/2024', avatarColor: 'bg-purple-500' },
  { id: 'c4', name: 'Lucas Oliveira', email: 'lucas.o@email.com', phone: '(11) 99999-4444', since: 'Set 2023', lastVisit: '10/11/2024', avatarColor: 'bg-yellow-500' },
  { id: 'c5', name: 'Fernando Dias', email: 'fernando.d@email.com', phone: '(11) 99999-5555', since: 'Nov 2023', lastVisit: '-', avatarColor: 'bg-red-500' },
];

// Modal de Adicionar Profissional
const AddProfessionalModal: React.FC<AddProfessionalModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [perfilType, setPerfilType] = useState<'BARBEIRO' | 'MANICURE' | 'ESTETICISTA' | 'COLORISTA' | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const professionalTypes = [
    { value: 'BARBEIRO', label: 'Barbeiro', description: 'Cortes e barba' },
    { value: 'MANICURE', label: 'Manicure', description: 'Manicure e pedicure' },
    { value: 'ESTETICISTA', label: 'Esteticista', description: 'Sobrancelhas e estética' },
    { value: 'COLORISTA', label: 'Colorista', description: 'Coloração capilar' }
  ] as const;

  useEffect(() => {
    if (isOpen) {
      setNome('');
      setEmail('');
      setTelefone('');
      setPerfilType('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isValid = nome.trim() !== '' && email.trim() !== '' && telefone.trim() !== '' && perfilType !== '';

  const handleSubmit = async () => {
    if (!isValid || !perfilType) return;

    try {
      setLoading(true);
      setError('');

      await professionalService.createProfessional({
        nome: nome.trim(),
        email: email.trim(),
        telefone: telefone.trim(),
        perfilType: perfilType as 'BARBEIRO' | 'MANICURE' | 'ESTETICISTA' | 'COLORISTA'
      });

      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error('Error creating professional:', err);
      const error = err as { message?: string };
      setError(error.message || 'Erro ao criar profissional');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-all duration-300">
      <div className="bg-[#151515] w-full max-w-md rounded-xl border border-[#292929] shadow-2xl transform transition-all scale-100 opacity-100">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#292929]">
          <h2 className="text-lg font-bold text-[#DDDBCB]">Novo Profissional</h2>
          <button onClick={onClose} className="text-[#5C5C5C] hover:text-[#DDDBCB]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* Nome */}
          <div>
            <label className="block text-xs font-medium text-[#5C5C5C] mb-1">Nome Completo *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C5C5C]" />
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: João Silva"
                className="w-full bg-[#050505] border border-[#292929] rounded-lg py-2.5 pl-10 pr-4 text-[#DDDBCB] focus:outline-none focus:border-[#58BEC3] focus:ring-1 focus:ring-[#58BEC3] transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-[#5C5C5C] mb-1">E-mail *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C5C5C]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="joao@email.com"
                className="w-full bg-[#050505] border border-[#292929] rounded-lg py-2.5 pl-10 pr-4 text-[#DDDBCB] focus:outline-none focus:border-[#58BEC3] focus:ring-1 focus:ring-[#58BEC3] transition-all"
              />
            </div>
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-xs font-medium text-[#5C5C5C] mb-1">Telefone *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C5C5C]" />
              <input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(11) 99999-9999"
                className="w-full bg-[#050505] border border-[#292929] rounded-lg py-2.5 pl-10 pr-4 text-[#DDDBCB] focus:outline-none focus:border-[#58BEC3] focus:ring-1 focus:ring-[#58BEC3] transition-all"
              />
            </div>
          </div>

          {/* Tipo de Profissional - Botões Seletores */}
          <div>
            <label className="block text-xs font-medium text-[#5C5C5C] mb-2">Tipo de Profissional *</label>
            <div className="grid grid-cols-2 gap-3">
              {professionalTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setPerfilType(type.value)}
                  className={`
                    p-3 rounded-lg border-2 transition-all text-left
                    ${perfilType === type.value
                      ? 'border-[#58BEC3] bg-[#58BEC3]/10'
                      : 'border-[#292929] bg-[#050505] hover:border-[#58BEC3]/50'
                    }
                  `}
                >
                  <div className={`font-bold text-sm mb-0.5 ${perfilType === type.value ? 'text-[#58BEC3]' : 'text-[#DDDBCB]'}`}>
                    {type.label}
                  </div>
                  <div className="text-xs text-[#5C5C5C]">{type.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-5 border-t border-[#292929] gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-[#5C5C5C] hover:text-[#DDDBCB] transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className={`
              px-6 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2
              ${isValid && !loading
                ? 'bg-[#58BEC3] text-[#151515] hover:bg-[#7ADBE0] shadow-lg shadow-[#58BEC3]/20'
                : 'bg-[#292929] text-[#5C5C5C] cursor-not-allowed'}
            `}
          >
            {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#151515]"></div>}
            {loading ? 'Criando...' : 'Criar Profissional'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal de Adicionar Serviço
const AddServiceModal: React.FC<AddServiceModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [duracao, setDuracao] = useState('');
  const [tipoServico, setTipoServico] = useState<'CORTE' | 'BARBA' | 'MANICURE' | 'SOBRANCELHA' | 'COLORACAO' | 'TRATAMENTO_CAPILAR' | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const serviceTypes = [
    { value: 'CORTE', label: 'Corte', description: 'Cortes de cabelo' },
    { value: 'BARBA', label: 'Barba', description: 'Aparar e modelar' },
    { value: 'MANICURE', label: 'Manicure', description: 'Unha e cutícula' },
    { value: 'SOBRANCELHA', label: 'Sobrancelha', description: 'Design e limpeza' },
    { value: 'COLORACAO', label: 'Coloração', description: 'Pintura capilar' },
    { value: 'TRATAMENTO_CAPILAR', label: 'Tratamento', description: 'Hidratação' }
  ] as const;

  useEffect(() => {
    if (isOpen) {
      setNome('');
      setDescricao('');
      setPreco('');
      setDuracao('');
      setTipoServico('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isValid = nome.trim() !== '' && descricao.trim() !== '' && preco !== '' && duracao !== '' && tipoServico !== '';

  const handleSubmit = async () => {
    if (!isValid || !tipoServico) return;

    try {
      setLoading(true);
      setError('');

      await serviceService.createService({
        nome: nome.trim(),
        descricao: descricao.trim(),
        preco: parseFloat(preco),
        duracao: parseInt(duracao),
        tipoServico: tipoServico as 'CORTE' | 'BARBA' | 'MANICURE' | 'SOBRANCELHA' | 'COLORACAO' | 'TRATAMENTO_CAPILAR'
      });

      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error('Error creating service:', err);
      const error = err as { message?: string };
      setError(error.message || 'Erro ao criar serviço');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-all duration-300">
      <div className="bg-[#151515] w-full max-w-2xl rounded-xl border border-[#292929] shadow-2xl transform transition-all scale-100 opacity-100">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#292929]">
          <h2 className="text-lg font-bold text-[#DDDBCB]">Novo Serviço</h2>
          <button onClick={onClose} className="text-[#5C5C5C] hover:text-[#DDDBCB]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Nome */}
            <div>
              <label className="block text-xs font-medium text-[#5C5C5C] mb-1">Nome do Serviço *</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Corte Masculino"
                className="w-full bg-[#050505] border border-[#292929] rounded-lg py-2.5 px-4 text-[#DDDBCB] focus:outline-none focus:border-[#58BEC3] focus:ring-1 focus:ring-[#58BEC3] transition-all"
              />
            </div>

            {/* Preço */}
            <div>
              <label className="block text-xs font-medium text-[#5C5C5C] mb-1">Preço (R$) *</label>
              <input
                type="number"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                placeholder="50.00"
                step="0.01"
                min="0"
                className="w-full bg-[#050505] border border-[#292929] rounded-lg py-2.5 px-4 text-[#DDDBCB] focus:outline-none focus:border-[#58BEC3] focus:ring-1 focus:ring-[#58BEC3] transition-all"
              />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-xs font-medium text-[#5C5C5C] mb-1">Descrição *</label>
            <textarea
              rows={2}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o serviço..."
              className="w-full bg-[#050505] border border-[#292929] rounded-lg py-2 px-4 text-[#DDDBCB] focus:outline-none focus:border-[#58BEC3] resize-none transition-all"
            />
          </div>

          {/* Duração */}
          <div>
            <label className="block text-xs font-medium text-[#5C5C5C] mb-1">Duração (minutos) *</label>
            <input
              type="number"
              value={duracao}
              onChange={(e) => setDuracao(e.target.value)}
              placeholder="30"
              min="1"
              className="w-full bg-[#050505] border border-[#292929] rounded-lg py-2.5 px-4 text-[#DDDBCB] focus:outline-none focus:border-[#58BEC3] focus:ring-1 focus:ring-[#58BEC3] transition-all"
            />
          </div>

          {/* Tipo de Serviço - Botões Seletores */}
          <div>
            <label className="block text-xs font-medium text-[#5C5C5C] mb-2">Tipo de Serviço *</label>
            <div className="grid grid-cols-3 gap-3">
              {serviceTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setTipoServico(type.value)}
                  className={`
                    p-3 rounded-lg border-2 transition-all text-left
                    ${tipoServico === type.value
                      ? 'border-[#58BEC3] bg-[#58BEC3]/10'
                      : 'border-[#292929] bg-[#050505] hover:border-[#58BEC3]/50'
                    }
                  `}
                >
                  <div className={`font-bold text-sm mb-0.5 ${tipoServico === type.value ? 'text-[#58BEC3]' : 'text-[#DDDBCB]'}`}>
                    {type.label}
                  </div>
                  <div className="text-xs text-[#5C5C5C]">{type.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-5 border-t border-[#292929] gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-[#5C5C5C] hover:text-[#DDDBCB] transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className={`
              px-6 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2
              ${isValid && !loading
                ? 'bg-[#58BEC3] text-[#151515] hover:bg-[#7ADBE0] shadow-lg shadow-[#58BEC3]/20'
                : 'bg-[#292929] text-[#5C5C5C] cursor-not-allowed'}
            `}
          >
            {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#151515]"></div>}
            {loading ? 'Criando...' : 'Criar Serviço'}
          </button>
        </div>
      </div>
    </div>
  );
};

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, onConfirm, initialData, isEditing }) => {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [barberId, setBarberId] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  const expenseCategories = ['Pagamento Barbeiro', 'Contas (Luz/Água)', 'Estoque', 'Marketing', 'Aluguel', 'Outros'];
  const incomeCategories = ['Serviço', 'Venda de Produto', 'Outros'];

  useEffect(() => {
    if (isOpen) {
      if (isEditing && initialData) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setType(initialData.type);
        setAmount(initialData.amount.toString());
        setCategory(initialData.category);
        setDescription(initialData.description);
        setDate(initialData.date); // Assuming date is in a compatible format or handled
        // Logic to set barberId if applicable (needs mapping from name to ID or storing ID in Transaction)
        // For now, we might not be able to pre-select the barber if we only have the name in Transaction
      } else {
        setAmount('');
        setCategory('');
        setBarberId('');
        setDescription('');
        setDate('');
        setType('expense'); // Default to expense for new
      }
    }
  }, [isOpen, isEditing, initialData]);

  useEffect(() => {
    if (!isEditing) {
      // Reset fields when type changes only if not editing
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCategory('');
      setBarberId('');
    }
  }, [type, isEditing]);

  if (!isOpen) return null;

  const isBarberRequired = category === 'Pagamento Barbeiro';
  const isValid =
    amount !== '' &&
    parseFloat(amount) > 0 &&
    category !== '' &&
    date !== '' &&
    (!isBarberRequired || barberId !== '');

  const handleSubmit = () => {
    if (!isValid) return;

    let barberName = undefined;
    if (isBarberRequired) {
      const selectedBarber = barbeirosData.find(b => b.id === barberId);
      barberName = selectedBarber ? selectedBarber.name : undefined;
    }

    const transactionData = {
      type,
      amount: parseFloat(amount),
      category,
      barberName,
      description: description || (type === 'income' ? 'Nova Receita' : 'Nova Despesa'),
      date: date || new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      status: 'Pago' as const
    };

    if (isEditing && initialData) {
      onConfirm({ ...transactionData, id: initialData.id });
    } else {
      onConfirm(transactionData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-all duration-300">
      <div className="bg-[#151515] w-full max-w-md rounded-xl border border-[#292929] shadow-2xl transform transition-all scale-100 opacity-100">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#292929]">
          <h2 className="text-lg font-bold text-[#DDDBCB]">{isEditing ? 'Editar Transação' : 'Nova Transação'}</h2>
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

          {/* Date */}
          <div>
            <label className="block text-xs font-medium text-[#5C5C5C] mb-1">Data *</label>
            <input
              type="date"
              value={date ? date.split('/').reverse().join('-') : ''} // Convert DD/MM/YYYY to YYYY-MM-DD for input
              onChange={(e) => {
                const val = e.target.value;
                if (val) {
                  const [year, month, day] = val.split('-');
                  setDate(`${day}/${month}/${year}`);
                } else {
                  setDate('');
                }
              }}
              className="w-full bg-[#050505] border border-[#292929] rounded-lg py-2.5 px-4 text-[#DDDBCB] focus:outline-none focus:border-[#58BEC3] focus:ring-1 focus:ring-[#58BEC3] transition-all"
            />
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
  onConfirm: (appointment: Omit<Appointment, 'id'>, clientData?: { name: string, isNew: boolean }) => void;
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
      // Reset state when modal opens
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
    if (isCreatingClient) {
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
    if (!newClientName || !newClientEmail || !newClientPhone) return;

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
  return (
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
                    <span className="text-xs uppercase font-bold">{String(d.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3))}</span>
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
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
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
                    {selectedDate ? `${String(selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }))} às ${selectedTime}` : ''}
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
                <Save className="w-4 h-4" />
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
const ClientDetailsModal: React.FC<{ client: Client | null, isOpen: boolean, onClose: () => void }> = ({ client, isOpen, onClose }) => {
  if (!isOpen || !client) return null;

  // Filtrar agendamentos deste cliente
  const history = initialAppointmentsData.filter(app => app.client === client.name);

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
                <span className="flex items-center gap-2"><Mail className="w-3 h-3" /> {client.email}</span>
                <span className="flex items-center gap-2"><Phone className="w-3 h-3" /> {client.phone}</span>
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

// Componente Item de Agendamento Futuro
const FutureAppointmentItem: React.FC<{
  appointment: import('@/types/api').DetailedAppointment;
  onConfirm: (id: number) => void;
  onCancel: (id: number) => void;
  onComplete: (id: number) => void;
  loadingId: number | null;
}> = ({ appointment, onConfirm, onCancel, onComplete, loadingId }) => {
  const isLoading = loadingId === appointment.id;
  const date = new Date(appointment.dataHora);
  const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="py- p-4 bg-[#0C0C0C] rounded-lg mh-4 my-3 border border-[#292929] hover:border-[#58BEC3] transition-colors">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        {/* Informacoes Principais */}
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <span className="text-2xl font-black text-[#DDDBCB] w-20">{time}</span>
          <div className="flex-1 min-w-[200px]">
            <p className="text-lg font-semibold text-[#DDDBCB]">{appointment.clienteNome}</p>
            <p className="text-sm text-[#5C5C5C]">{appointment.funcionarioNome}</p>
          </div>
          <div className="min-w-[150px]">
            <p className="text-lg font-semibold text-[#DDDBCB]">{appointment.servicoNome}</p>
            <p className="text-sm text-[#5C5C5C]">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(appointment.servicoPreco)}
            </p>
          </div>
        </div>

        {/* Status e Ações */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <AgendamentoStatusBridge status={appointment.status} />

          <div className="flex items-center space-x-2">
            {appointment.status === 'PENDENTE' && (
              <button
                onClick={() => onConfirm(appointment.id)}
                disabled={isLoading}
                className="p-2 bg-[#58BEC3]/10 text-[#58BEC3] hover:bg-[#58BEC3]/20 rounded-lg transition-colors"
                title="Confirmar"
              >
                {isLoading ? <div className="w-4 h-4 border-2 border-[#58BEC3] border-t-transparent rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
              </button>
            )}

            {appointment.status === 'CONFIRMADO' && (
              <button
                onClick={() => onComplete(appointment.id)}
                disabled={isLoading}
                className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-lg transition-colors"
                title="Concluir"
              >
                {isLoading ? <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              </button>
            )}

            {(appointment.status === 'PENDENTE' || appointment.status === 'CONFIRMADO') && (
              <button
                onClick={() => onCancel(appointment.id)}
                disabled={isLoading}
                className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                title="Cancelar"
              >
                {isLoading ? <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /> : <X className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente Item de Profissional Ativo
const ActiveProfessionalItem: React.FC<{
  professional: import('@/types/api').ProfessionalResponse;
}> = ({ professional }) => {
  const initials = professional.nome
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center justify-between py-3 border-b border-[#292929] last:border-b-0">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-[#292929] rounded-full flex items-center justify-center font-bold text-[#DDDBCB]">
          {initials}
        </div>
        <div>
          <p className="text-lg font-bold text-[#DDDBCB]">{professional.nome}</p>
          <p className="text-xs font-semibold text-[#58BEC3]">{professional.profissao}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="flex items-center gap-1 text-[#58BEC3]">
          <div className="w-2 h-2 rounded-full bg-[#58BEC3]"></div>
          <span className="text-xs">Ativo</span>
        </div>
      </div>
    </div>
  );
};

// Componente Conteúdo Principal
const DashboardContent: React.FC<{
  onOpenNewAppointment: () => void,
  onNavigateToProfessionals: () => void,
}> = ({ onOpenNewAppointment, onNavigateToProfessionals }) => {
  const [appointments, setAppointments] = React.useState<import('@/types/api').DetailedAppointment[]>([]);
  const [activeProfessionals, setActiveProfessionals] = React.useState<import('@/types/api').ProfessionalResponse[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [actionLoadingId, setActionLoadingId] = React.useState<number | null>(null);
  const [metrics, setMetrics] = React.useState<DashboardMetricas | null>(null);
  const [relatorio, setRelatorio] = React.useState<RelatorioGeral | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appointmentsData, professionalsData, metricsData, relatorioData] = await Promise.all([
        barberShopService.listFutureAppointments(),
        professionalService.listMyProfessionals(),
        financeiroService.obterMetricasDashboard(),
        financeiroService.obterRelatorioGeral('MES')
      ]);

      setAppointments(appointmentsData);

      setMetrics(metricsData);
      setRelatorio(relatorioData);

      // Filter only active professionals
      const activeProfs = professionalsData.filter(p => p.ativo);
      setActiveProfessionals(activeProfs);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleConfirm = async (id: number) => {
    try {
      setActionLoadingId(id);
      await appointmentService.confirmAppointment(id);
      await fetchData(); // Refresh all data
    } catch (error) {
      console.error('Error confirming appointment:', error);
      alert('Erro ao confirmar agendamento');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) return;

    try {
      setActionLoadingId(id);
      await appointmentService.cancelAppointment(id);
      await fetchData(); // Refresh all data
    } catch (error) {
      console.error('Error canceling appointment:', error);
      alert('Erro ao cancelar agendamento');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleComplete = async (id: number) => {
    try {
      setActionLoadingId(id);
      await appointmentService.completeAppointment(id);
      await fetchData(); // Refresh all data
    } catch (error) {
      console.error('Error completing appointment:', error);
      alert('Erro ao concluir agendamento');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-[#DDDBCB] mb-6">Dashboard</h1>

      {/* Grid de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 x1:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon={DollarSign}
          title="Receita"
          value={`R$ ${relatorio?.faturamentoTotal.toFixed(2) || '0.00'}`}
        />
        <StatsCard
          icon={TrendingUp}
          title="Projeção (7d)"
          value={`R$ ${(relatorio?.faturamentoTotal || 0) * 1.2 ? ((relatorio?.faturamentoTotal || 0) * 1.2).toFixed(2) : '0.00'}`}
        />
        <StatsCard
          icon={Percent}
          title="Ticket Médio"
          value={`R$ ${relatorio?.ticketMedio.toFixed(2) || '0.00'}`}
        />
        <StatsCard
          icon={Calendar}
          title="Agendamentos"
          value={metrics?.agendamentosMes.toString() || '0'}
        />
      </div>

      {/* Layout Principal (Agendamentos e Barbeiros) */}
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Coluna Esquerda: Agendamentos Futuros */}
        <div className="flex-1 bg-[#151515] p-6 rounded-lg">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-3">
              <Calendar className="w-6 h-6 text-white" />
              <h2 className="text-x1 font-semibold text-[#DDDBCB]">Agendamentos Futuros</h2>
            </div>
            <button
              onClick={fetchData}
              className="p-2 text-[#5C5C5C] hover:text-[#58BEC3] transition-colors"
              title="Atualizar"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Lista de Agendamentos */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#58BEC3]"></div>
              </div>
            ) : appointments.length > 0 ? (
              appointments.map((app) => (
                <FutureAppointmentItem
                  key={app.id}
                  appointment={app}
                  onConfirm={handleConfirm}
                  onCancel={handleCancel}
                  onComplete={handleComplete}
                  loadingId={actionLoadingId}
                />
              ))
            ) : (
              <div className="text-center py-8 text-[#5C5C5C]">
                <p>Nenhum agendamento futuro encontrado.</p>
              </div>
            )}
          </div>
        </div>

        {/* Coluna Direita: Ações e Profissionais Ativos */}
        <div className="w-full lg:w-80">
          <button
            onClick={onOpenNewAppointment}
            className="w-full bg-[#58BEC3] hover:bg-[#7ADBE0] text-[#151515] font-bold py-3 px-4 rounded-lg transition-colors mb-4 shadow-lg shadow-[#58BEC3]/10"
          >
            + Novo Agendamento
          </button>

          <div className="bg-[#151515] p-6 rounded-lg mt-8">
            <h3 className="text-lg font-semibold text-[#DDDBCB] mb-4">Profissionais Ativos</h3>
            <div className="space-y-2">
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#58BEC3]"></div>
                </div>
              ) : activeProfessionals.length > 0 ? (
                activeProfessionals.map((prof) => (
                  <ActiveProfessionalItem
                    key={prof.id}
                    professional={prof}
                  />
                ))
              ) : (
                <p className="text-[#5C5C5C] text-center text-sm py-4">Nenhum profissional ativo.</p>
              )}
            </div>
          </div>

          <button
            onClick={onNavigateToProfessionals}
            className="w-full bg-[#58BEC3] hover:bg-[#7ADBE0] text-[#151515] font-bold py-3 px-4 rounded-lg transition-colors mt-4"
          >
            {/* Assuming 'isEditing' would be a prop passed to DashboardContent or derived within it */}
            {/* For now, keeping the original text as 'isEditing' is not defined here */}
            Adicionar Profissional
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal de Editar Profissional
interface EditProfessionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  professional: Barber | null;
}

const EditProfessionalModal: React.FC<EditProfessionalModalProps> = ({ isOpen, onClose, onSuccess, professional }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [perfilType, setPerfilType] = useState<'BARBEIRO' | 'MANICURE' | 'ESTETICISTA' | 'COLORISTA' | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const professionalTypes = [
    { value: 'BARBEIRO', label: 'Barbeiro', description: 'Cortes e barba' },
    { value: 'MANICURE', label: 'Manicure', description: 'Manicure e pedicure' },
    { value: 'ESTETICISTA', label: 'Esteticista', description: 'Sobrancelhas e estética' },
    { value: 'COLORISTA', label: 'Colorista', description: 'Coloração capilar' }
  ] as const;

  useEffect(() => {
    if (isOpen && professional) {
      setNome(professional.name);
      setEmail(professional.email);
      setTelefone(professional.phone);
      // Map profession string to enum if possible, or default to BARBEIRO if unknown
      // The API returns 'profissao' as string, but we need to match it to our types
      // Assuming the backend returns the enum string value
      const type = professionalTypes.find(t => t.value === professional.profissao) ? professional.profissao : 'BARBEIRO';
      setPerfilType(type as 'BARBEIRO' | 'MANICURE' | 'ESTETICISTA' | 'COLORISTA');
      setError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, professional]);

  if (!isOpen || !professional) return null;

  const isValid = nome.trim() !== '' && email.trim() !== '' && telefone.trim() !== '' && perfilType !== '';

  const handleSubmit = async () => {
    if (!isValid || !perfilType) return;

    try {
      setLoading(true);
      setError('');

      await professionalService.updateProfessional(parseInt(professional.id), {
        nome: nome.trim(),
        email: email.trim(),
        telefone: telefone.trim(),
        perfilType: perfilType as 'BARBEIRO' | 'MANICURE' | 'ESTETICISTA' | 'COLORISTA'
      });

      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error('Error updating professional:', err);
      const error = err as { message?: string };
      setError(error.message || 'Erro ao atualizar profissional');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-all duration-300">
      <div className="bg-[#151515] w-full max-w-md rounded-xl border border-[#292929] shadow-2xl transform transition-all scale-100 opacity-100">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#292929]">
          <h2 className="text-lg font-bold text-[#DDDBCB]">Editar Profissional</h2>
          <button onClick={onClose} className="text-[#5C5C5C] hover:text-[#DDDBCB]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* Nome */}
          <div>
            <label className="block text-xs font-medium text-[#5C5C5C] mb-1">Nome Completo *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C5C5C]" />
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: João Silva"
                className="w-full bg-[#050505] border border-[#292929] rounded-lg py-2.5 pl-10 pr-4 text-[#DDDBCB] focus:outline-none focus:border-[#58BEC3] focus:ring-1 focus:ring-[#58BEC3] transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-[#5C5C5C] mb-1">E-mail *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C5C5C]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="joao@email.com"
                className="w-full bg-[#050505] border border-[#292929] rounded-lg py-2.5 pl-10 pr-4 text-[#DDDBCB] focus:outline-none focus:border-[#58BEC3] focus:ring-1 focus:ring-[#58BEC3] transition-all"
              />
            </div>
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-xs font-medium text-[#5C5C5C] mb-1">Telefone *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C5C5C]" />
              <input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(11) 99999-9999"
                className="w-full bg-[#050505] border border-[#292929] rounded-lg py-2.5 pl-10 pr-4 text-[#DDDBCB] focus:outline-none focus:border-[#58BEC3] focus:ring-1 focus:ring-[#58BEC3] transition-all"
              />
            </div>
          </div>

          {/* Tipo de Profissional - Botões Seletores */}
          <div>
            <label className="block text-xs font-medium text-[#5C5C5C] mb-2">Tipo de Profissional *</label>
            <div className="grid grid-cols-2 gap-3">
              {professionalTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setPerfilType(type.value)}
                  className={`
                    p-3 rounded-lg border-2 transition-all text-left
                    ${perfilType === type.value
                      ? 'border-[#58BEC3] bg-[#58BEC3]/10'
                      : 'border-[#292929] bg-[#050505] hover:border-[#58BEC3]/50'
                    }
                  `}
                >
                  <div className={`font-bold text-sm mb-0.5 ${perfilType === type.value ? 'text-[#58BEC3]' : 'text-[#DDDBCB]'}`}>
                    {type.label}
                  </div>
                  <div className="text-xs text-[#5C5C5C]">{type.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-5 border-t border-[#292929] gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-[#5C5C5C] hover:text-[#DDDBCB] transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className={`
              px-6 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2
              ${isValid && !loading
                ? 'bg-[#58BEC3] text-[#151515] hover:bg-[#7ADBE0] shadow-lg shadow-[#58BEC3]/20'
                : 'bg-[#292929] text-[#5C5C5C] cursor-not-allowed'}
            `}
          >
            {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#151515]"></div>}
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal de Gerenciar Serviços
interface ManageServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  professional: Barber | null;
  barbeariaId: number;
}

const ManageServicesModal: React.FC<ManageServicesModalProps> = ({ isOpen, onClose, professional, barbeariaId }) => {
  const [services, setServices] = useState<import('@/types/api').ServiceResponse[]>([]);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && professional) {
      loadServices();
      loadProfessionalServices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, professional]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await serviceService.listServices(barbeariaId);
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProfessionalServices = async () => {
    if (!professional) return;
    try {
      // Fetch services already associated with this professional
      const professionalServices = await professionalService.getProfessionalServices(parseInt(professional.id));
      // Pre-select these services
      const serviceIds = professionalServices.map(s => s.id);
      setSelectedServices(serviceIds);
    } catch {
      // Silently handle error if endpoint doesn't exist yet
      // User can still select services manually
      setSelectedServices([]);
    }
  };

  const toggleService = (serviceId: number) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSave = async () => {
    if (!professional) return;
    try {
      setSaving(true);
      await professionalService.linkServices(parseInt(professional.id), selectedServices);
      onClose();
    } catch (error) {
      console.error('Error linking services:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !professional) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-all duration-300">
      <div className="bg-[#151515] w-full max-w-md rounded-xl border border-[#292929] shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-[#292929]">
          <h2 className="text-lg font-bold text-[#DDDBCB]">Gerenciar Serviços</h2>
          <button onClick={onClose} className="text-[#5C5C5C] hover:text-[#DDDBCB]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <p className="text-sm text-[#5C5C5C] mb-4">Selecione os serviços que <strong>{professional.name}</strong> pode realizar:</p>

          {loading ? (
            <div className="flex justify-center py-4"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#58BEC3]"></div></div>
          ) : (
            <div className="space-y-2">
              {services.map(service => (
                <button
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${selectedServices.includes(service.id)
                    ? 'bg-[#58BEC3]/10 border-[#58BEC3] text-[#DDDBCB]'
                    : 'bg-[#050505] border-[#292929] text-[#5C5C5C] hover:border-[#58BEC3]/50'
                    }`}
                >
                  <span className="font-medium">{service.nome}</span>
                  {selectedServices.includes(service.id) && <Check className="w-4 h-4 text-[#58BEC3]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end p-5 border-t border-[#292929] gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-[#5C5C5C] hover:text-[#DDDBCB]">Cancelar</button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 text-sm font-bold bg-[#58BEC3] hover:bg-[#7ADBE0] text-[#151515] rounded-lg transition-all disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal de Gerenciar Horários
interface ManageWorkingHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  professional: Barber | null;
}

const ManageWorkingHoursModal: React.FC<ManageWorkingHoursModalProps> = ({ isOpen, onClose, professional }) => {
  const [workingHours, setWorkingHours] = useState<import('@/types/api').WorkingHours[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [horaAbertura, setHoraAbertura] = useState('09:00');
  const [horaFechamento, setHoraFechamento] = useState('18:00');
  const [ativo, setAtivo] = useState(true);

  const days = [
    { value: 'SEGUNDA', label: 'Segunda-feira' },
    { value: 'TERCA', label: 'Terça-feira' },
    { value: 'QUARTA', label: 'Quarta-feira' },
    { value: 'QUINTA', label: 'Quinta-feira' },
    { value: 'SEXTA', label: 'Sexta-feira' },
    { value: 'SABADO', label: 'Sábado' },
    { value: 'DOMINGO', label: 'Domingo' }
  ];

  useEffect(() => {
    if (isOpen && professional) {
      loadWorkingHours();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, professional]);

  const loadWorkingHours = async () => {
    if (!professional) return;
    try {
      setLoading(true);
      const data = await professionalService.getWorkingHours(parseInt(professional.id));
      setWorkingHours(data);
    } catch (error) {
      console.error('Error loading working hours:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time: unknown) => {
    if (!time) return '--:--';
    if (typeof time === 'string') {
      // Assume "HH:mm:ss" or "HH:mm"
      return time.substring(0, 5);
    }
    if (typeof time === 'object' && time !== null) {
      // Assume TimeSlot { hour, minute, ... }
      const t = time as { hour?: number; minute?: number };
      const h = t.hour?.toString().padStart(2, '0') || '00';
      const m = t.minute?.toString().padStart(2, '0') || '00';
      return `${h}:${m}`;
    }
    return '--:--';
  };

  const toggleDay = (dayValue: string) => {
    setSelectedDays(prev =>
      prev.includes(dayValue)
        ? prev.filter(d => d !== dayValue)
        : [...prev, dayValue]
    );
  };

  const toggleAllDays = () => {
    if (selectedDays.length === days.length) {
      setSelectedDays([]);
    } else {
      setSelectedDays(days.map(d => d.value));
    }
  };

  const handleSaveHours = async () => {
    if (!professional || selectedDays.length === 0) return;

    const dayMap: { [key: string]: number } = {
      'SEGUNDA': 1,
      'TERCA': 2,
      'QUARTA': 3,
      'QUINTA': 4,
      'SEXTA': 5,
      'SABADO': 6,
      'DOMINGO': 7
    };

    try {
      setSaving(true);
      // Process requests sequentially to avoid overwhelming the server or race conditions
      for (const day of selectedDays) {
        await professionalService.setWorkingHours(parseInt(professional.id), {
          diaSemana: dayMap[day],
          horaAbertura,
          horaFechamento,
          ativo
        });
      }
      await loadWorkingHours();
      setSelectedDays([]); // Clear selection after save
      alert('Horários atualizados com sucesso!');
    } catch (error) {
      console.error('Error saving working hours:', error);
      alert('Erro ao salvar alguns horários. Verifique o console.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !professional) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-all duration-300">
      <div className="bg-[#151515] w-full max-w-2xl rounded-xl border border-[#292929] shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-[#292929]">
          <h2 className="text-lg font-bold text-[#DDDBCB]">Horários de Trabalho - {professional.name}</h2>
          <button onClick={onClose} className="text-[#5C5C5C] hover:text-[#DDDBCB]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Configuração */}
          <div className="space-y-4">
            <h3 className="text-[#DDDBCB] font-medium mb-2">Configurar Dia</h3>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-medium text-[#5C5C5C]">Dias da Semana</label>
                <button
                  onClick={toggleAllDays}
                  className="text-xs text-[#58BEC3] hover:underline"
                >
                  {selectedDays.length === days.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto custom-scrollbar p-1">
                {days.map(day => (
                  <button
                    key={day.value}
                    onClick={() => toggleDay(day.value)}
                    className={`
                      flex items-center justify-between p-2 rounded-lg border text-xs transition-all
                      ${selectedDays.includes(day.value)
                        ? 'bg-[#58BEC3]/10 border-[#58BEC3] text-[#DDDBCB]'
                        : 'bg-[#050505] border-[#292929] text-[#5C5C5C] hover:border-[#58BEC3]/50'}
                    `}
                  >
                    <span>{day.label}</span>
                    {selectedDays.includes(day.value) && <Check className="w-3 h-3 text-[#58BEC3]" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#5C5C5C] mb-1">Entrada</label>
                <input
                  type="time"
                  value={horaAbertura}
                  onChange={(e) => setHoraAbertura(e.target.value)}
                  className="w-full bg-[#050505] border border-[#292929] rounded-lg py-2.5 px-4 text-[#DDDBCB] focus:outline-none focus:border-[#58BEC3]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#5C5C5C] mb-1">Saída</label>
                <input
                  type="time"
                  value={horaFechamento}
                  onChange={(e) => setHoraFechamento(e.target.value)}
                  className="w-full bg-[#050505] border border-[#292929] rounded-lg py-2.5 px-4 text-[#DDDBCB] focus:outline-none focus:border-[#58BEC3]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="ativo"
                checked={ativo}
                onChange={(e) => setAtivo(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#58BEC3] focus:ring-[#58BEC3]"
              />
              <label htmlFor="ativo" className="text-sm text-[#DDDBCB]">Dia de Trabalho Ativo</label>
            </div>

            <button
              onClick={handleSaveHours}
              disabled={saving || selectedDays.length === 0}
              className="w-full bg-[#58BEC3] hover:bg-[#7ADBE0] text-[#151515] font-bold py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Salvando...' : `Salvar (${selectedDays.length})`}
            </button>
          </div>

          {/* Lista de Horários */}
          <div className="bg-[#050505] rounded-lg p-4 border border-[#292929]">
            <h3 className="text-[#DDDBCB] font-medium mb-4">Horários Definidos</h3>
            {loading ? (
              <div className="flex justify-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#58BEC3]"></div></div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                {workingHours.length > 0 ? workingHours.map((wh, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 border-b border-[#292929] last:border-0">
                    <span className="text-sm text-[#DDDBCB] font-medium">
                      {days.find(d => d.value === wh.diaSemana.toString())?.label || wh.diaSemana}
                    </span>
                    <div className="text-xs text-[#5C5C5C]">
                      {wh.ativo ? (
                        <span className="text-[#58BEC3]">{formatTime(wh.horaAbertura)} - {formatTime(wh.horaFechamento)}</span>
                      ) : (
                        <span className="text-red-500">Folga</span>
                      )}
                    </div>
                  </div>
                )) : (
                  <p className="text-xs text-[#5C5C5C] text-center py-4">Nenhum horário definido.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal de Gerenciar Link de Acesso
interface ManageAccessLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  professional: Barber | null;
}

const ManageAccessLinkModal: React.FC<ManageAccessLinkModalProps> = ({ isOpen, onClose, professional }) => {
  const [linkData, setLinkData] = useState<import('@/types/api').AccessLinkResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [updatingExpiration, setUpdatingExpiration] = useState(false);
  const [expirationDays, setExpirationDays] = useState(30);
  const [copied, setCopied] = useState(false);
  const [fullLink, setFullLink] = useState('');

  useEffect(() => {
    if (isOpen && professional) {
      loadLinkStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, professional]);

  useEffect(() => {
    if (linkData?.linkAcesso && typeof window !== 'undefined') {
      let token = linkData.linkAcesso;

      // Handle full URL or path
      if (token.includes('/')) {
        try {
          // Extract the UUID part. The format seems to be .../api/profissional/{UUID}/dashboard
          // We can try to find a UUID pattern or split by '/'
          const parts = token.split('/');
          // Find the part that looks like a UUID (approximate check: length > 30)
          const uuidPart = parts.find(p => p.length > 30 && p.includes('-'));

          if (uuidPart) {
            token = uuidPart;
          } else {
            // Fallback: take the part before 'dashboard' if it exists
            const dashboardIndex = parts.indexOf('dashboard');
            if (dashboardIndex > 0) {
              token = parts[dashboardIndex - 1];
            } else {
              // Last resort: take the last non-empty part
              token = parts.filter(p => p).pop() || token;
            }
          }
        } catch (e) {
          console.error('Error parsing token URL:', e);
        }
      }

      // Construct the link with the current origin
      setFullLink(`${window.location.origin}/acesso/${token}`);
    } else {
      setFullLink('');
    }
  }, [linkData]);

  const loadLinkStatus = async () => {
    if (!professional) return;
    try {
      setLoading(true);
      const data = await professionalService.checkLinkStatus(parseInt(professional.id));
      setLinkData(data);
    } catch (error) {
      console.error('Error loading link status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLink = async () => {
    if (!professional) return;
    try {
      setGenerating(true);
      const data = await professionalService.generateAccessLink(parseInt(professional.id), { diasExpiracao: expirationDays });
      setLinkData(data);
    } catch (error) {
      console.error('Error generating link:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleDeactivateLink = async () => {
    if (!professional) return;
    if (!confirm('Tem certeza que deseja desativar o link de acesso? O profissional perderá o acesso imediatamente.')) return;
    try {
      setLoading(true);
      const data = await professionalService.deactivateAccessLink(parseInt(professional.id));
      setLinkData(data);
    } catch (error) {
      console.error('Error deactivating link:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateExpiration = async () => {
    if (!professional) return;
    try {
      setUpdatingExpiration(true);
      const data = await professionalService.updateLinkExpiration(parseInt(professional.id), { diasExpiracao: expirationDays });
      setLinkData(data);
      alert('Validade atualizada com sucesso!');
    } catch (error) {
      console.error('Error updating expiration:', error);
      alert('Erro ao atualizar validade.');
    } finally {
      setUpdatingExpiration(false);
    }
  };

  const handleCopyLink = () => {
    if (fullLink) {
      navigator.clipboard.writeText(fullLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen || !professional) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-all duration-300">
      <div className="bg-[#151515] w-full max-w-md rounded-xl border border-[#292929] shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-[#292929]">
          <h2 className="text-lg font-bold text-[#DDDBCB]">Acesso do Profissional</h2>
          <button onClick={onClose} className="text-[#5C5C5C] hover:text-[#DDDBCB]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#292929] rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-8 h-8 text-[#58BEC3]" />
            </div>
            <h3 className="text-[#DDDBCB] font-bold text-lg">{professional.name}</h3>
            <p className="text-sm text-[#5C5C5C]">Gerencie o acesso deste profissional ao sistema.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-4"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#58BEC3]"></div></div>
          ) : (
            <>
              {linkData?.tokenAtivo ? (
                <div className="bg-[#050505] p-4 rounded-lg border border-[#292929] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#58BEC3] uppercase tracking-wider flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-[#58BEC3] animate-pulse"></div>
                      Acesso Ativo
                    </span>
                    <button onClick={handleDeactivateLink} className="text-xs text-red-500 hover:text-red-400 font-medium">
                      Revogar Acesso
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#5C5C5C] mb-1">Link de Acesso</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={fullLink}
                        className="w-full bg-[#151515] border border-[#292929] rounded-lg py-2 px-3 text-[#DDDBCB] text-sm focus:outline-none"
                      />
                      <button
                        onClick={handleCopyLink}
                        className="p-2 bg-[#292929] hover:bg-[#3d3d3d] rounded-lg text-[#DDDBCB] transition-colors"
                        title="Copiar Link"
                      >
                        {copied ? <Check className="w-4 h-4 text-[#58BEC3]" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-[#5C5C5C] flex justify-between">
                    <span>Expira em: {new Date(linkData.tokenExpiraEm).toLocaleDateString('pt-BR')}</span>

                  </div>

                  <div className="pt-4 border-t border-[#292929]">
                    <label className="block text-xs font-medium text-[#5C5C5C] mb-2">Atualizar Validade</label>
                    <div className="flex gap-2">
                      <select
                        value={expirationDays}
                        onChange={(e) => setExpirationDays(parseInt(e.target.value))}
                        className="flex-1 bg-[#151515] border border-[#292929] rounded-lg py-2 px-3 text-[#DDDBCB] text-sm focus:outline-none focus:border-[#58BEC3]"
                      >
                        <option value={7}>7 dias</option>
                        <option value={15}>15 dias</option>
                        <option value={30}>30 dias</option>
                        <option value={90}>90 dias</option>
                        <option value={365}>1 ano</option>
                      </select>
                      <button
                        onClick={handleUpdateExpiration}
                        disabled={updatingExpiration}
                        className="px-4 py-2 bg-[#292929] hover:bg-[#58BEC3] hover:text-[#151515] text-[#DDDBCB] rounded-lg text-sm font-bold transition-all disabled:opacity-50"
                      >
                        {updatingExpiration ? '...' : 'Atualizar'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-[#292929]/30 p-4 rounded-lg border border-[#292929] text-center">
                    <p className="text-sm text-[#DDDBCB] mb-2">Este profissional não possui acesso ativo.</p>
                    <p className="text-xs text-[#5C5C5C]">Gere um link para permitir que ele acesse a agenda.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#5C5C5C] mb-1">Validade do Link (dias)</label>
                    <select
                      value={expirationDays}
                      onChange={(e) => setExpirationDays(parseInt(e.target.value))}
                      className="w-full bg-[#050505] border border-[#292929] rounded-lg py-2.5 px-4 text-[#DDDBCB] focus:outline-none focus:border-[#58BEC3]"
                    >
                      <option value={7}>7 dias</option>
                      <option value={15}>15 dias</option>
                      <option value={30}>30 dias</option>
                      <option value={90}>90 dias</option>
                      <option value={365}>1 ano</option>
                    </select>
                  </div>

                  <button
                    onClick={handleGenerateLink}
                    disabled={generating}
                    className="w-full bg-[#58BEC3] hover:bg-[#7ADBE0] text-[#151515] font-bold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {generating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#151515]"></div>
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Link className="w-4 h-4" />
                        Gerar Link de Acesso
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfissionaisCard: React.FC<{ barber: Barber; onUpdate?: () => void }> = ({ barber, onUpdate }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);
  const [isHoursModalOpen, setIsHoursModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Get barbeariaId from localStorage
  const getBarbeariaId = (): number => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          return user.id || 0;
        } catch (e: unknown) {
          console.error('Error parsing user:', e);
        }
      }
    }
    return 0;
  };

  const barbeariaId = getBarbeariaId();

  const handleDeactivate = async () => {
    if (!confirm(`Tem certeza que deseja desativar o profissional ${barber.name}?`)) return;
    try {
      await professionalService.deleteProfessional(parseInt(barber.id));
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error deactivating professional:', error);
      alert('Erro ao desativar profissional.');
    }
  };

  return (
    <>
      <div className="bg-[#151515] p-5 rounded-lg flex flex-col relative group">
        {/* Menu de Opções (Dropdown) */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1 text-[#5C5C5C] hover:text-[#DDDBCB] rounded-lg hover:bg-[#292929] transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {isMenuOpen && (
            <>
              <div className="fixed inset-0 z-0" onClick={() => setIsMenuOpen(false)}></div>
              <div className="absolute right-0 mt-2 w-48 bg-[#151515] border border-[#292929] rounded-lg shadow-xl z-20 overflow-hidden">
                <button
                  onClick={() => { setIsEditModalOpen(true); setIsMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 text-sm text-[#DDDBCB] hover:bg-[#292929] flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" /> Editar Dados
                </button>
                <button
                  onClick={() => { setIsServicesModalOpen(true); setIsMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 text-sm text-[#DDDBCB] hover:bg-[#292929] flex items-center gap-2"
                >
                  <Scissors className="w-4 h-4" /> Serviços
                </button>
                <button
                  onClick={() => { setIsHoursModalOpen(true); setIsMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 text-sm text-[#DDDBCB] hover:bg-[#292929] flex items-center gap-2"
                >
                  <Clock3 className="w-4 h-4" /> Horários
                </button>
                <button
                  onClick={() => { setIsLinkModalOpen(true); setIsMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 text-sm text-[#DDDBCB] hover:bg-[#292929] flex items-center gap-2"
                >
                  <Link className="w-4 h-4" /> Acesso
                </button>
                <div className="h-px bg-[#292929] my-1"></div>
                <button
                  onClick={() => { handleDeactivate(); setIsMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-[#292929] flex items-center gap-2"
                >
                  <UserX className="w-4 h-4" /> Desativar
                </button>
              </div>
            </>
          )}
        </div>

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
              <Mail className="w-3 h-3 flex-shrink-0" />
              <span>{barber.email}</span>
            </p>
          </div>
        </div>

        {/* Informações de Contato */}
        <div className="space-y-1 mb-4">
          <p className="text-sm text-[#5C5C5C] flex items-center space-x-2">
            <Phone className="w-3 h-3 flex-shrink-0" />
            <span>{barber.phone}</span>
          </p>
          <p className="text-sm text-[#5C5C5C] flex items-center space-x-2">
            <User className="w-3 h-3 flex-shrink-0" />
            <span>{barber.profissao || 'Profissional'}</span>
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

        {/* Ações Rápidas (Botões inferiores) */}
        <div className="flex items-center space-x-2 mt-auto">
          <button className="flex-1 bg-[#58BEC3] hover:bg-[#7ADBE0] text-[#151515] font-semibold py-2 px-3 rounded-lg text-sm flex items-center justify-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>Agenda</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <EditProfessionalModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => {
          if (onUpdate) onUpdate();
        }}
        professional={barber}
      />

      <ManageServicesModal
        isOpen={isServicesModalOpen}
        onClose={() => setIsServicesModalOpen(false)}
        professional={barber}
        barbeariaId={barbeariaId}
      />

      <ManageWorkingHoursModal
        isOpen={isHoursModalOpen}
        onClose={() => setIsHoursModalOpen(false)}
        professional={barber}
      />

      <ManageAccessLinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        professional={barber}
      />
    </>
  );
};

// Componente Tela de Serviços
const ServicosContent: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [services, setServices] = React.useState<import('@/types/api').ServiceResponse[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [selectedService, setSelectedService] = React.useState<import('@/types/api').ServiceResponse | null>(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  // Get barbeariaId from authenticated user
  const getBarbeariaId = (): number => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          // For BARBEARIA role, the id IS the barbeariaId
          return user.id || 0;
        } catch (e: unknown) {
          console.error('Error parsing user from localStorage:', e);
        }
      }
    }
    return 0;
  };

  const barbeariaId = getBarbeariaId();

  const fetchServices = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await serviceService.listServices(barbeariaId);
      setServices(data);
    } catch (err: unknown) {
      console.error('Error fetching services:', err);
      const error = err as { message?: string };
      setError(error.message || 'Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  }, [barbeariaId]);

  React.useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleServiceCreated = () => {
    fetchServices();
  };

  const handleEditClick = (service: import('@/types/api').ServiceResponse) => {
    setSelectedService(service);
    setIsEditModalOpen(true);
  };

  const handleServiceEdited = () => {
    setIsEditModalOpen(false);
    setSelectedService(null);
    fetchServices();
  };

  const handleDeleteClick = (service: import('@/types/api').ServiceResponse) => {
    setSelectedService(service);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedService) return;

    try {
      setDeleteLoading(true);
      await serviceService.deleteService(selectedService.id);
      setIsDeleteModalOpen(false);
      setSelectedService(null);
      fetchServices();
    } catch (err: unknown) {
      console.error('Error deleting service:', err);
      const error = err as { message?: string };
      setError(error.message || 'Erro ao desativar serviço');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredServices = services.filter(service =>
    service.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold text-[#DDDBCB]">Serviços</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center space-x-2 bg-[#58BEC3] hover:bg-[#7ADBE0] text-[#151515] font-bold py-3 px-5 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Serviço</span>
        </button>
      </div>

      {/* Busca */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Buscar serviço pelo nome..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#151515] text-sm font-semibold text-[#DDDBCB] placeholder-[#5C5C5C] px-4 py-2 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-[#58BEC3]"
          />
          <Search className="w-5 h-5 text-[#DDDBCB] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#58BEC3] mb-4"></div>
          <p className="text-[#5C5C5C]">Carregando serviços...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500">
          {error}
        </div>
      )}

      {/* Grid de Serviços */}
      {!loading && !error && (
        <>
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map(service => (
                <div key={service.id} className="bg-[#151515] p-5 rounded-lg flex flex-col">
                  <h3 className="text-lg font-bold text-[#DDDBCB] mb-3">{service.nome}</h3>

                  <p className="text-sm text-[#5C5C5C] mb-4 flex-grow">{service.descricao}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-[#292929]">
                    <div>
                      <p className="text-xs text-[#5C5C5C]">Preço</p>
                      <p className="text-xl font-bold text-[#58BEC3]">R$ {service.preco.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#5C5C5C]">Duração</p>
                      <p className="text-xl font-bold text-[#DDDBCB]">{service.duracao} min</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={() => handleEditClick(service)}
                      className="flex-1 bg-[#58BEC3] hover:bg-[#7ADBE0] text-[#151515] font-semibold py-2 px-3 rounded-lg text-sm flex items-center justify-center space-x-1"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(service)}
                      className="p-2 bg-[#5C5C5C] hover:bg-[#767676] rounded-lg text-[#DDDBCB]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-[#151515] p-6 rounded-full mb-4">
                <Scissors className="w-12 h-12 text-[#5C5C5C]" />
              </div>
              <p className="text-[#DDDBCB] font-semibold mb-2">Nenhum serviço encontrado</p>
              <p className="text-[#5C5C5C] text-sm">
                {searchQuery ? 'Tente ajustar sua busca' : 'Adicione seu primeiro serviço'}
              </p>
            </div>
          )}
        </>
      )}

      {/* Modal de Adicionar Serviço */}
      <AddServiceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleServiceCreated}
        barbeariaId={barbeariaId}
      />

      {/* Modal de Editar Serviço */}
      {selectedService && (
        <EditServiceModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleServiceEdited}
          service={selectedService}
        />
      )}

      {/* Modal de Confirmar Exclusão */}
      {selectedService && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-all duration-300 ${isDeleteModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="bg-[#151515] w-full max-w-md rounded-xl border border-[#292929] shadow-2xl">
            <div className="flex items-center  justify-between p-5 border-b border-[#292929]">
              <h2 className="text-lg font-bold text-[#DDDBCB]">Desativar Serviço</h2>
              <button onClick={() => setIsDeleteModalOpen(false)} className="text-[#5C5C5C] hover:text-[#DDDBCB]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-[#DDDBCB] mb-2">Tem certeza que deseja desativar o serviço:</p>
              <p className="text-[#58BEC3] font-bold mb-4">{selectedService.nome}</p>
              <div className="bg-[#58BEC3]/10 border border-[#58BEC3]/20 rounded-lg p-3 text-[#58BEC3] text-sm">
                <p className="font-semibold mb-1">ℹ️ Esta é uma exclusão segura (soft delete)</p>
                <p className="text-xs">O histórico de agendamentos será preservado e o serviço não aparecerá mais nas listagens ativas.</p>
              </div>
            </div>

            <div className="flex items-center justify-end p-5 border-t border-[#292929] gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={deleteLoading}
                className="px-4 py-2 text-sm font-medium text-[#5C5C5C] hover:text-[#DDDBCB] disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="px-6 py-2 text-sm font-bold bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {deleteLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                {deleteLoading ? 'Desativando...' : 'Desativar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Modal de Editar Serviço
interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  service: import('@/types/api').ServiceResponse;
}

const EditServiceModal: React.FC<EditServiceModalProps> = ({ isOpen, onClose, onSuccess, service }) => {
  const [nome, setNome] = useState(service.nome);
  const [descricao, setDescricao] = useState(service.descricao);
  const [preco, setPreco] = useState(service.preco.toString());
  const [duracao, setDuracao] = useState(service.duracao.toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset form when modal opens with new service
  useEffect(() => {
    if (isOpen) {
      setNome(service.nome);
      setDescricao(service.descricao);
      setPreco(service.preco.toString());
      setDuracao(service.duracao.toString());
      setError('');
    }
  }, [isOpen, service]);

  if (!isOpen) return null;

  const isValid = nome.trim() !== '' && descricao.trim() !== '' && preco !== '' && duracao !== '';

  const handleSubmit = async () => {
    if (!isValid) return;

    try {
      setLoading(true);
      setError('');

      await serviceService.updateService(service.id, {
        nome: nome.trim(),
        descricao: descricao.trim(),
        preco: parseFloat(preco),
        duracao: parseInt(duracao),
        tipoServico: service.tipoServico || '' // Backend requires this even though it's immutable
      });

      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error('Error updating service:', err);
      const error = err as { message?: string };
      setError(error.message || 'Erro ao atualizar serviço');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-all duration-300">
      <div className="bg-[#151515] w-full max-w-2xl rounded-xl border border-[#292929] shadow-2xl transform transition-all scale-100 opacity-100">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#292929]">
          <h2 className="text-lg font-bold text-[#DDDBCB]">Editar Serviço</h2>
          <button onClick={onClose} className="text-[#5C5C5C] hover:text-[#DDDBCB]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Nome */}
            <div>
              <label className="block text-xs font-medium text-[#5C5C5C] mb-1">Nome do Serviço *</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Corte Masculino"
                className="w-full bg-[#050505] border border-[#292929] rounded-lg py-2.5 px-4 text-[#DDDBCB] focus:outline-none focus:border-[#58BEC3] focus:ring-1 focus:ring-[#58BEC3] transition-all"
              />
            </div>

            {/* Preço */}
            <div>
              <label className="block text-xs font-medium text-[#5C5C5C] mb-1">Preço (R$) *</label>
              <input
                type="number"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                placeholder="50.00"
                step="0.01"
                min="0"
                className="w-full bg-[#050505] border border-[#292929] rounded-lg py-2.5 px-4 text-[#DDDBCB] focus:outline-none focus:border-[#58BEC3] focus:ring-1 focus:ring-[#58BEC3] transition-all"
              />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-xs font-medium text-[#5C5C5C] mb-1">Descrição *</label>
            <textarea
              rows={2}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o serviço..."
              className="w-full bg-[#050505] border border-[#292929] rounded-lg py-2 px-4 text-[#DDDBCB] focus:outline-none focus:border-[#58BEC3] resize-none transition-all"
            />
          </div>

          {/* Duração */}
          <div>
            <label className="block text-xs font-medium text-[#5C5C5C] mb-1">Duração (minutos) *</label>
            <input
              type="number"
              value={duracao}
              onChange={(e) => setDuracao(e.target.value)}
              placeholder="30"
              min="1"
              className="w-full bg-[#050505] border border-[#292929] rounded-lg py-2.5 px-4 text-[#DDDBCB] focus:outline-none focus:border-[#58BEC3] focus:ring-1 focus:ring-[#58BEC3] transition-all"
            />
          </div>

          {/* Info about immutable field */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-blue-400 text-sm">
            <p className="font-semibold mb-1">ℹ️ Tipo de Serviço não pode ser alterado</p>
            <p className="text-xs">O tipo de serviço é definido na criação e não pode ser modificado posteriormente.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-5 border-t border-[#292929] gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-[#5C5C5C] hover:text-[#DDDBCB] transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className={`
              px-6 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2
              ${isValid && !loading
                ? 'bg-[#58BEC3] text-[#151515] hover:bg-[#7ADBE0] shadow-lg shadow-[#58BEC3]/20'
                : 'bg-[#292929] text-[#5C5C5C] cursor-not-allowed'}
            `}
          >
            {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#151515]"></div>}
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente Tela de Avaliações
const AvaliacoesContent: React.FC = () => {
  const [reviews, setReviews] = React.useState<import('@/types/api').Review[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  // Get barbeariaId from authenticated user
  const getBarbeariaId = (): number => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          return user.id || 0;
        } catch (e: unknown) {
          console.error('Error parsing user from localStorage:', e);
        }
      }
    }
    return 0;
  };

  const barbeariaId = getBarbeariaId();

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await barberShopService.getReviews(barbeariaId);
      setReviews(data);
    } catch (err: unknown) {
      console.error('Error loading reviews:', err);
      const error = err as { message?: string };
      setError(error.message || 'Erro ao carregar avaliações');
    } finally {
      setLoading(false);
    }
  }, [barbeariaId]);

  React.useEffect(() => {
    if (barbeariaId) {
      loadReviews();
    }
  }, [barbeariaId, loadReviews]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`text-lg ${index < rating ? 'text-yellow-400' : 'text-gray-600'}`}>
        ★
      </span>
    ));
  };

  return (
    <>
      {/* Header */}
      <h1 className="text-3xl font-bold text-[#DDDBCB] mb-6">Avaliações</h1>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#58BEC3] mb-4"></div>
          <p className="text-[#5C5C5C]">Carregando avaliações...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500 mb-6">
          {error}
        </div>
      )}

      {/* Reviews List */}
      {!loading && !error && (
        <>
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-[#151515] border border-[#292929] rounded-lg p-6">
                  {/* Header da avaliação */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-[#DDDBCB] font-bold text-lg">{review.clienteNome}</h3>
                      <p className="text-[#5C5C5C] text-sm">
                        {new Date(review.dataCriacao).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(Math.round(review.notaGeral))}
                      <span className="ml-2 text-[#58BEC3] font-bold text-xl">{review.notaGeral.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Comentário */}
                  {review.comentario && (
                    <p className="text-[#DDDBCB] mb-4 italic bg-[#050505] p-4 rounded-lg border border-[#292929]">
                      &quot;{review.comentario}&quot;
                    </p>
                  )}

                  {/* Notas detalhadas */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#292929]">
                    <div className="bg-[#050505] p-3 rounded-lg">
                      <p className="text-[#5C5C5C] text-xs mb-2 text-center">Serviço</p>
                      <div className="flex items-center justify-center gap-1">
                        {renderStars(review.notaServico)}
                      </div>
                    </div>
                    <div className="bg-[#050505] p-3 rounded-lg">
                      <p className="text-[#5C5C5C] text-xs mb-2 text-center">Ambiente</p>
                      <div className="flex items-center justify-center gap-1">
                        {renderStars(review.notaAmbiente)}
                      </div>
                    </div>
                    <div className="bg-[#050505] p-3 rounded-lg">
                      <p className="text-[#5C5C5C] text-xs mb-2 text-center">Limpeza</p>
                      <div className="flex items-center justify-center gap-1">
                        {renderStars(review.notaLimpeza)}
                      </div>
                    </div>
                    <div className="bg-[#050505] p-3 rounded-lg">
                      <p className="text-[#5C5C5C] text-xs mb-2 text-center">Atendimento</p>
                      <div className="flex items-center justify-center gap-1">
                        {renderStars(review.notaAtendimento)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-[#151515] rounded-lg">
              <div className="bg-[#050505] p-6 rounded-full mb-4">
                <Star className="w-12 h-12 text-[#5C5C5C]" />
              </div>
              <p className="text-[#DDDBCB] font-semibold mb-2 text-xl">Nenhuma avaliação ainda</p>
              <p className="text-[#5C5C5C]">
                As avaliações dos clientes aparecerão aqui
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
};

// Componente Tela de Profissionais
const ProfissionaisContent: React.FC<{
  shouldOpenAddModal?: boolean;
  onModalOpened?: () => void;
}> = ({ shouldOpenAddModal, onModalOpened }) => {
  const [activeTab, setActiveTab] = React.useState('Ativos');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [professionals, setProfessionals] = React.useState<import('@/types/api').ProfessionalResponse[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  // Carregar profissionais ao montar o componente
  const fetchProfessionals = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await professionalService.listMyProfessionals();
      setProfessionals(data);
    } catch (err: unknown) {
      console.error('Error fetching professionals:', err);
      const error = err as { message?: string };
      setError(error.message || 'Erro ao carregar profissionais');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchProfessionals();
  }, [fetchProfessionals]);

  // Auto-open modal effect
  React.useEffect(() => {
    if (shouldOpenAddModal) {
      setIsAddModalOpen(true);
      if (onModalOpened) {
        onModalOpened();
      }
    }
  }, [shouldOpenAddModal, onModalOpened]);

  // Handler para quando um profissional é criado com sucesso
  const handleProfessionalCreated = () => {
    fetchProfessionals(); // Recarrega a lista
  };

  // Mapear profissionaisresponse para o formato Barber usado nos componentes
  const mappedProfessionals = professionals.map((prof) => ({
    id: prof.id.toString(),
    initials: prof.nome.charAt(0).toUpperCase() + (prof.nome.split(' ')[1]?.charAt(0).toUpperCase() || ''),
    name: prof.nome,
    ativo: prof.ativo,
    email: prof.email,
    phone: prof.telefone,
    cpf: '', // Não disponível na API
    profissao: prof.profissao, // Tipo de profissional
    appointments: 0, // Não disponível na API
    next7d: 0, // Não disponível na API
    status: prof.ativo ? 'Ativo' as const : 'Desativo' as const
  }));

  const filteredProfessionals = mappedProfessionals
    .filter(prof => prof.status === (activeTab === 'Ativos' ? 'Ativo' : 'Desativo'))
    .filter(prof => prof.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold text-[#DDDBCB]">Profissionais</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center space-x-2 bg-[#58BEC3] hover:bg-[#7ADBE0] text-[#151515] font-bold py-3 px-5 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Profissional</span>
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col md:flex-row md:items-center justify-left gap-4 mb-6 bg-[#151515] p-2 rounded-lg">
        <div className="flex items-center bg-black p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('Ativos')}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium ${activeTab === 'Ativos'
              ? 'bg-[#58BEC3] text-[#151515] shadow'
              : 'hover:text-[#AAAAAA] hover:bg-[#292929] text-[#5c5c5c]'}`}
          >Ativos </button>

          <button
            onClick={() => setActiveTab('Desativos')}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium ${activeTab === 'Desativos'
              ? 'bg-[#58BEC3] text-[#151515] shadow'
              : 'hover:text-[#AAAAAA] hover:bg-[#292929] text-[#5c5c5c]'}`}
          >Desativos </button>
        </div>

        <div className="relative flex-1 md:max-w-xs">
          <input
            type="text"
            placeholder="Buscar profissional pelo nome..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#151515] text-sm font-semibold text-[#DDDBCB] placeholder-[#5C5C5C] px-4 py-2 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-[#58BEC3]"
          />
          <Search className="w-5 h-5 text-[#DDDBCB] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#58BEC3] mb-4"></div>
          <p className="text-[#5C5C5C]">Carregando profissionais...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500">
          {error}
        </div>
      )}

      {/* Grid de Profissionais */}
      {!loading && !error && (
        <>
          {filteredProfessionals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 x1:grid-cols-4 gap-6">
              {filteredProfessionals.map(prof => (
                <ProfissionaisCard key={prof.id} barber={prof} onUpdate={fetchProfessionals} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-[#151515] p-6 rounded-full mb-4">
                <Users className="w-12 h-12 text-[#5C5C5C]" />
              </div>
              <p className="text-[#DDDBCB] font-semibold mb-2">Nenhum profissional encontrado</p>
              <p className="text-[#5C5C5C] text-sm">
                {searchQuery ? 'Tente ajustar sua busca' : 'Adicione seu primeiro profissional'}
              </p>
            </div>
          )}
        </>
      )}

      {/* Modal de Adicionar Profissional */}
      <AddProfessionalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleProfessionalCreated}
      />
    </>
  );
}

// Componente Tela de Agendamentos
// Componente Agendamento Status Bridge - Exibir status do agendamento para a tabela principal
const AgendamentoStatusBridge: React.FC<{ status: string }> = ({ status }) => {
  // Map API status to display format
  const statusMap: Record<string, AppointmentStatus> = {
    'PENDENTE': 'Pendente',
    'CONFIRMADO': 'Confirmado',
    'CONCLUIDO': 'Concluído',
    'CANCELADO': 'Cancelado',
    // Legacy formats
    'Pendente': 'Pendente',
    'Confirmado': 'Confirmado',
    'Concluído': 'Concluído',
    'Cancelado': 'Cancelado'
  };

  const displayStatus = statusMap[status] || 'Pendente';

  const statusStyles: Record<AppointmentStatus, { icon: React.ElementType, color: string }> = {
    'Concluído': { icon: Check, color: '#58BEC3' },
    'Cancelado': { icon: UserX, color: '#5c5c5c' },
    'Pendente': { icon: Clock, color: '#DDDBCB' },
    'Confirmado': { icon: Check, color: '#58BEC3' }
  };

  const { icon: Icon, color } = statusStyles[displayStatus];

  return (
    <span className={`flex items-center gap-1.5 text-sm font-medium ${color}`}>
      <Icon className="w-4 h-4" />
      {displayStatus}
    </span>
  );
};

// Componente Agendamentos
const AgendamentosContent: React.FC = () => {
  const [appointments, setAppointments] = useState<import('@/types/api').DetailedAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [viewMode, setViewMode] = useState<'todos' | 'futuros'>('futuros');

  // Fetch appointments from API
  React.useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError('');

        // Use different endpoints based on view mode
        const data = viewMode === 'todos'
          ? await barberShopService.listAllAppointments()
          : await barberShopService.listFutureAppointments();

        setAppointments(data);
      } catch (err: unknown) {
        console.error('Error fetching appointments:', err);
        const error = err as { message?: string };
        setError(error.message || 'Erro ao carregar agendamentos');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [viewMode]);

  const filteredAppointments = appointments
    .filter(app => statusFilter === 'Todos' || app.status === statusFilter)
    .filter(app => app.funcionarioNome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.clienteNome.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <>
      {/* Header */}
      <h1 className="text-3xl font-bold text-[#DDDBCB] mb-6">Agendamentos</h1>
      {/* Filtros e Busca */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-[#151515] p-2 rounded-lg">
        {/* View Mode Toggle */}
        <div className="flex bg-[#050505] p-1 rounded-lg">
          <button
            onClick={() => setViewMode('futuros')}
            className={`px-4 py-2 text-sm font-bold rounded-md transition-all duration-200 ${viewMode === 'futuros' ? 'bg-[#58BEC3] text-[#151515]' : 'text-[#5C5C5C] hover:text-[#DDDBCB]'
              }`}
          >
            Futuros
          </button>
          <button
            onClick={() => setViewMode('todos')}
            className={`px-4 py-2 text-sm font-bold rounded-md transition-all duration-200 ${viewMode === 'todos' ? 'bg-[#58BEC3] text-[#151515]' : 'text-[#5C5C5C] hover:text-[#DDDBCB]'
              }`}
          >
            Todos
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 ">
          <input
            type="text"
            placeholder="Buscar por cliente ou profissional..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#050505] text-sm font-semibold text-[#DDDBCB] placeholder-[#5C5C5C] px-4 py-2 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-[#58BEC3]"
          />
          <Search className="w-5 h-5 text-[#DDDBCB] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Status Filter */}
        <div className="relative bg-[#050505] md:max-w-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-[#58BEC3]">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm font-semibold text-[#DDDBCB] px-4 py-3 appearance-[#DDDBCB]"
          >
            <option value="Todos">Todos</option>
            <option value="CONCLUIDO">Concluído</option>
            <option value="PENDENTE">Pendente</option>
            <option value="CANCELADO">Cancelado</option>
            <option value="CONFIRMADO">Confirmado</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#58BEC3] mb-4"></div>
          <p className="text-[#5C5C5C]">Carregando agendamentos...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500 mb-6">
          {error}
        </div>
      )}

      {/* Tabela de Agendamentos */}
      {!loading && !error && (
        <div className="bg-[#151515] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              {/* Cabeçalho */}
              <thead className="bg-[#0c0c0c]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#5C5C5C] uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#5C5C5C] uppercase tracking-wider">Data/Hora</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#5C5C5C] uppercase tracking-wider">Profissional</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#5C5C5C] uppercase tracking-wider">Serviço</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#5C5C5C] uppercase tracking-wider">Telefone</th>
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
                        <span className="text-ms font-medium text-[#DDDBCB]">{app.clienteNome}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-[#DDDBCB]">
                          {new Date(app.dataHora).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </span>
                        <span className="block text-xs text-[#5c5c5c]">
                          {new Date(app.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-[#DDDBCB]">{app.funcionarioNome}</span>
                        <span className="block text-xs text-[#5c5c5c]">{app.funcionarioProfissao}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-[#DDDBCB]">{app.servicoNome}</span>
                        <span className="block text-xs text-[#5c5c5c]">{app.servicoDuracao}min</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-[#DDDBCB]">{app.clienteTelefone}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-[#DDDBCB]">R$ {app.servicoPreco.toFixed(2).replace('.', ',')}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <AgendamentoStatusBridge status={app.status} />
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
            </table>
          </div>
        </div>
      )}
    </>
  );
};

// Componente GestãoFinanceira
const FinancialContent: React.FC = () => {
  const [periodFilter, setPeriodFilter] = React.useState<'Semanal' | 'Mensal' | 'Total'>('Semanal');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetricas | null>(null);
  const [relatorioGeral, setRelatorioGeral] = useState<RelatorioGeral | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const [receitas, despesas, metricas, relatorio] = await Promise.all([
        financeiroService.listarReceitas(),
        financeiroService.listarDespesas(),
        financeiroService.obterMetricasDashboard(),
        financeiroService.obterRelatorioGeral('MES') // Default to MES, can be dynamic based on periodFilter
      ]);

      console.log('Dashboard Metrics:', metricas);
      console.log('Relatorio Geral:', relatorio);
      setDashboardMetrics(metricas);
      setRelatorioGeral(relatorio);

      const mappedReceitas: Transaction[] = receitas.map(r => {
        const [year, month, day] = r.dataTransacao.split('T')[0].split('-');
        return {
          id: r.id.toString(),
          description: r.descricao,
          category: r.categoria,
          date: `${day}/${month}/${year}`,
          amount: r.valor,
          type: 'income',
          status: 'Pago'
        };
      });

      const mappedDespesas: Transaction[] = despesas.map(d => {
        const [year, month, day] = d.dataTransacao.split('T')[0].split('-');
        return {
          id: d.id.toString(),
          description: d.descricao,
          category: d.categoria,
          date: `${day}/${month}/${year}`,
          amount: d.valor,
          type: 'expense',
          status: 'Pago'
        };
      });

      // Sort by date descending (simple string comparison for DD/MM is not ideal, but sufficient for display if consistent)
      // Better to parse date for sorting
      const sortedTransactions = [...mappedReceitas, ...mappedDespesas].sort((a, b) => {
        const [dayA, monthA] = a.date.split('/');
        const [dayB, monthB] = b.date.split('/');
        const dateA = new Date(new Date().getFullYear(), parseInt(monthA) - 1, parseInt(dayA));
        const dateB = new Date(new Date().getFullYear(), parseInt(monthB) - 1, parseInt(dayB));
        return dateB.getTime() - dateA.getTime();
      });

      setTransactions(sortedTransactions);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      setToastMessage('Erro ao carregar transações.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [periodFilter]);

  // Simulação de filtro de valores baseados no período
  // Use API metrics if available, otherwise fallback to 0
  const metrics = useMemo(() => {
    // Calculate expenses from the transactions list since it's not in RelatorioGeral
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);

    if (relatorioGeral) {
      return {
        revenue: relatorioGeral.faturamentoTotal || 0,
        expenses: totalExpenses,
        profit: (relatorioGeral.faturamentoTotal || 0) - totalExpenses,
        projection: (relatorioGeral.faturamentoTotal || 0) * 1.2, // Mock projection
        ticket: relatorioGeral.ticketMedio || 0
      };
    }

    return {
      revenue: 0,
      expenses: totalExpenses,
      profit: -totalExpenses,
      projection: 0,
      ticket: 0
    };
  }, [relatorioGeral, transactions]);

  const handleAddTransaction = async (newTxData: Omit<Transaction, 'id'> | Transaction) => {
    try {
      // Convert date from DD/MM to YYYY-MM-DD for API
      // Convert date from DD/MM/YYYY to YYYY-MM-DD for API
      const parts = newTxData.date.split('/');
      let formattedDate;
      if (parts.length === 3) {
        const [day, month, year] = parts;
        formattedDate = `${year}-${month}-${day}`;
      } else {
        // Fallback if date format is unexpected (e.g. DD/MM)
        const [day, month] = parts;
        const year = new Date().getFullYear();
        formattedDate = `${year}-${month}-${day}`;
      }

      const categoryMapping: Record<string, string> = {
        // Despesas
        'Pagamento Barbeiro': 'COMISSAO', // Tentative
        'Contas (Luz/Água)': 'CONTAS', // Tentative
        'Estoque': 'ESTOQUE', // Tentative
        'Marketing': 'MARKETING', // Tentative
        'Aluguel': 'ALUGUEL', // Confirmed
        'Outros': 'OUTROS', // Tentative
        // Receitas
        'Serviço': 'SERVICO', // Tentative
        'Venda de Produto': 'VENDA_PRODUTO', // Confirmed
      };

      // If the category is not in the mapping, default to 'OUTROS'
      // Also, if the user selected 'Pagamento Barbeiro' and it fails, we might want to try 'OUTROS'
      // But for now, let's stick to the mapping.
      const backendCategory = categoryMapping[newTxData.category] || 'OUTROS';

      // Append barber name to description if available and not already in description
      let finalDescription = newTxData.description;
      if (newTxData.barberName && !finalDescription.includes(newTxData.barberName)) {
        finalDescription = `${finalDescription} - ${newTxData.barberName}`;
      }

      console.log('Sending transaction payload:', {
        type: newTxData.type,
        valor: newTxData.amount,
        categoria: backendCategory,
        descricao: finalDescription,
        dataTransacao: formattedDate,
        id: 'id' in newTxData ? newTxData.id : undefined
      });

      if ('id' in newTxData && newTxData.id) {
        // Edit
        if (newTxData.type === 'income') {
          await financeiroService.editarReceita(parseInt(newTxData.id), {
            valor: newTxData.amount,
            categoria: backendCategory,
            descricao: finalDescription,
            dataTransacao: formattedDate
          });
        } else {
          await financeiroService.editarDespesa(parseInt(newTxData.id), {
            valor: newTxData.amount,
            categoria: backendCategory,
            descricao: finalDescription,
            dataTransacao: formattedDate
          });
        }
        setToastMessage("Transação atualizada com sucesso!");
      } else {
        // Create
        if (newTxData.type === 'income') {
          await financeiroService.adicionarReceita({
            valor: newTxData.amount,
            categoria: backendCategory,
            descricao: finalDescription,
            dataTransacao: formattedDate
          });
        } else {
          await financeiroService.adicionarDespesa({
            valor: newTxData.amount,
            categoria: backendCategory,
            descricao: finalDescription,
            dataTransacao: formattedDate
          });
        }
        setToastMessage("Transação registrada com sucesso!");
      }

      fetchTransactions();
      setIsModalOpen(false);
      setEditingTransaction(undefined);
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      setToastMessage('Erro ao salvar transação.');
    }
  };

  const handleEditClick = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (transaction: Transaction) => {
    if (!confirm('Tem certeza que deseja remover esta transação?')) return;

    try {
      if (transaction.type === 'income') {
        await financeiroService.removerReceita(parseInt(transaction.id));
      } else {
        await financeiroService.removerDespesa(parseInt(transaction.id));
      }
      setToastMessage("Transação removida com sucesso!");
      fetchTransactions();
    } catch (error) {
      console.error('Erro ao remover transação:', error);
      setToastMessage('Erro ao remover transação.');
    }
  };

  // Dados aleatórios estáticos para o gráfico para evitar que as barras "dancem" na renderização.
  // Calculate chart data from transactions
  const chartData = useMemo(() => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      return d;
    });

    return last7Days.map(date => {
      const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }); // DD/MM

      // Filter transactions for this day
      const dayTransactions = transactions.filter(t => {
        // t.date is DD/MM/YYYY
        return t.date.startsWith(dateStr) && t.type === 'income';
      });

      const totalAmount = dayTransactions.reduce((acc, curr) => acc + curr.amount, 0);
      console.log(`Date: ${dateStr}, Total: ${totalAmount}, Transactions: ${dayTransactions.length}`);

      // Normalize height for chart (max height 100%)
      // Find max value across all days to scale relative to it
      // For now, let's just use a simple scaling or cap at 100 if we don't calculate max first.
      // But to do it right, we need the max value of the week.
      return {
        day: days[date.getDay()],
        height: totalAmount, // We will scale this in the render or just use raw value if we change the render logic
        value: totalAmount
      };
    });
  }, [transactions]);

  // Find max value to scale chart bars
  const maxChartValue = Math.max(...chartData.map(d => d.value), 1); // Avoid division by zero

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
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(undefined);
        }}
        onConfirm={handleAddTransaction}
        initialData={editingTransaction}
        isEditing={!!editingTransaction}
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
            onClick={() => {
              setEditingTransaction(undefined);
              setIsModalOpen(true);
            }}
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
        />
        <StatsCard
          icon={TrendingUp}
          title="Projeção (7 dias)"
          value={`R$ ${metrics.projection.toFixed(2)}`}
        />
        <StatsCard
          icon={Percent}
          title="Ticket Médio"
          value={`R$ ${metrics.ticket.toFixed(2)}`}
        />
        <StatsCard
          icon={Calendar}
          title="Agendamentos"
          value={dashboardMetrics?.agendamentosMes?.toString() || '0'}
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
                  R$ {item.value.toFixed(2)}
                  <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-[#DDDBCB] rotate-45"></div>
                </div>

                {/* Bar */}
                <div
                  className="w-full max-w-[40px] bg-[#58BEC3] rounded-t-sm opacity-80 group-hover:opacity-100 transition-all duration-300 hover:shadow-[0_0_15px_rgba(88,190,195,0.3)]"
                  style={{ height: `${(item.value / maxChartValue) * 100}%` }}
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
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#58BEC3] mb-2"></div>
                <p className="text-[#5C5C5C] text-sm">Carregando transações...</p>
              </div>
            ) : transactions.length === 0 ? (
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
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                    <button onClick={() => handleEditClick(transaction)} className="text-[#5C5C5C] hover:text-[#DDDBCB]">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteClick(transaction)} className="text-[#5C5C5C] hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
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
// Componente Clientes
const ClientesContent: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch clients from API
  React.useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const data = await barberShopService.listMyClients();

        // Map API data to Client interface
        const mappedClients: Client[] = data.map(c => ({
          id: c.id.toString(),
          name: c.nome,
          email: c.email,
          phone: c.telefone,
          since: '2024', // Placeholder as API doesn't provide this yet
          lastVisit: c.ultimoAgendamento ? new Date(c.ultimoAgendamento).toLocaleDateString('pt-BR') : '-',
          avatarColor: 'bg-[#58BEC3]' // Default color
        }));

        setClients(mappedClients);
      } catch (err: unknown) {
        console.error('Error fetching clients:', err);
        const error = err as { message?: string };
        setError(error.message || 'Erro ao carregar clientes');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery)
  );

  const handleDeleteClient = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Tem certeza que deseja remover este cliente?')) {
      setClients(prev => prev.filter(c => c.id !== id));
      setToastMessage("Cliente removido com sucesso.");
    }
  };

  return (
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

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#58BEC3] mb-4"></div>
          <p className="text-[#5C5C5C]">Carregando clientes...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500 mb-6">
          {error}
        </div>
      )}

      {/* Lista de Clientes */}
      {!loading && !error && (
        <>
          {filteredClients.length === 0 ? (
            <div className="bg-[#151515] p-10 rounded-lg border border-[#292929] text-center flex flex-col items-center">
              <UserX className="w-16 h-16 text-[#292929] mb-4" />
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
        </>
      )}
    </div>
  );
};

//Componente App
const App: React.FC = () => {

  // Estado para controlar a página atual
  const [currentPage, setCurrentPage] = React.useState('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // [MENU HAMBURGUER] 8. Estado global que controla a visibilidade

  const [, setAppointments] = useState<Appointment[]>(initialAppointmentsData);
  const [clients, setClients] = useState<Client[]>(initialClientsData);


  // Estado para controlar a visibilidade do modal
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [shouldOpenAddProfessionalModal, setShouldOpenAddProfessionalModal] = useState(false);

  const handleNavigateToProfessionals = () => {
    setCurrentPage('Profissionais');
    setShouldOpenAddProfessionalModal(true);
  };
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddClient = (newClient: Client) => {
    setClients(prev => [newClient, ...prev]);
  };

  // Função para processar a criação do agendamento
  const handleCreateAppointment = (newAppointmentData: Omit<Appointment, 'id'>, clientData?: { name: string, isNew: boolean }) => {
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
              onNavigateToProfessionals={handleNavigateToProfessionals}
            />
          )}
          {currentPage === 'Profissionais' && (
            <ProfissionaisContent
              shouldOpenAddModal={shouldOpenAddProfessionalModal}
              onModalOpened={() => setShouldOpenAddProfessionalModal(false)}
            />
          )}
          {currentPage === 'Serviços' && <ServicosContent />}
          {currentPage === 'Agendamentos' && <AgendamentosContent />}
          {currentPage === 'Avaliações' && <AvaliacoesContent />}
          {currentPage === 'Gestão Financeira' && <FinancialContent />}
          {currentPage === 'Clientes' && <ClientesContent />}
        </div>
      </main>
    </div>
  )
}

export default App;
