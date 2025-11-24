export interface User {
    id: number | string;
    nome: string;
    email: string;
    role?: string;
    telefone?: string;
}

export interface AuthResponse {
    token?: string;
    message?: string;
    user?: User;
}

export interface RegisterClientData {
    nome: string;
    email: string;
    senha?: string;
    confirmarSenha: string;
    telefone: string;
}

export interface LoginData {
    email: string;
    senha?: string;
}

export interface RegisterBarberShopData {
    nome: string;
    email: string;
    senha: string;
    confirmarSenha: string;
    telefone: string;
    nomeFantasia: string;
    tipoDocumento: 'CPF' | 'CNPJ';
    documento: string;
    endereco: string;
}

export interface Appointment {
    id: number;
    dataHora: string;
    status: string;
    nomeBarbearia: string;
    nomeBarbeiro: string | null;
    nomeServico: string;
    observacoes: string | null;
}

export interface UpdateProfileData {
    nome?: string;
    email?: string;
    telefone?: string;
}

export interface BarberShop {
    id: number;
    nome: string;
    nomeFantasia: string;
    endereco: string;
    telefone: string;
    email: string;
    avaliacaoMedia: number;
}

export interface Service {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    duracao: number;
    barbeariaId: number;
    ativo: boolean;
    tipoServico: 'CORTE' | 'BARBA' | 'MANICURE' | 'SOBRANCELHA' | 'COLORACAO' | 'TRATAMENTO_CAPILAR' | string;
}

export interface AvailableSlot {
    funcionarioId: number;
    funcionarioNome: string;
    perfilType: string;
    data: string;
    horarioInicio: string;
    horarioFim: string;
}

export interface Professional {
    id: number;
    barbeariaId: number;
    nome: string;
    email: string;
    telefone: string;
    perfilType: 'BARBEIRO' | 'MANICURE' | 'ESTETICISTA' | 'COLORISTA' | string;
    profissao: string;
    especialidades: string;
    ativo: boolean;
    dataCriacao: string;
    dataAtualizacao: string;
}

export interface TimeSlot {
    hour: number;
    minute: number;
    second: number;
    nano: number;
}

export interface WorkingHours {
    id: number;
    barbeariaId: number;
    funcionarioId: number;
    diaSemana: number;
    horaAbertura: TimeSlot;
    horaFechamento: TimeSlot;
    ativo: boolean;
}

export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
}

export interface CreateAppointmentData {
    servicoId: number;
    funcionarioId: number;
    barbeariaId: number;
    dataHora: string; // ISO 8601 format: "2025-11-25T14:30:00"
    observacoes?: string;
}

export interface AppointmentResponse {
    id: number;
    clienteId: number;
    barbeariaId: number;
    servicoId: number;
    funcionarioId: number;
    dataHora: string;
    status: string;
    observacoes: string | null;
    dataCriacao: string;
    dataAtualizacao: string;
}

export interface RescheduleData {
    novaDataHora: string;
}

export interface RecentAppointment {
    id: number;
    clienteId: number;
    barbeariaId: number;
    servicoId: number;
    funcionarioId: number;
    dataHora: string;
    status: string;
    observacoes: string | null;
    dataCriacao: string;
    dataAtualizacao: string;
    nomeBarbearia: string;
    nomeBarbeiro: string | null;
    nomeServico: string;
}

export interface CreateProfessionalData {
    nome: string;
    email: string;
    telefone: string;
    perfilType: 'BARBEIRO' | 'MANICURE' | 'ESTETICISTA' | 'COLORISTA';
}

export interface ProfessionalResponse {
    id: number;
    barbeariaId: number;
    nome: string;
    email: string;
    telefone: string;
    profissao: 'BARBEIRO' | 'MANICURE' | 'ESTETICISTA' | 'COLORISTA';
    ativo: boolean;
    dataCriacao: string;
    dataAtualizacao: string;
}

export interface CreateServiceData {
    nome: string;
    descricao: string;
    preco: number;
    duracao: number;
    tipoServico: 'CORTE' | 'BARBA' | 'MANICURE' | 'SOBRANCELHA' | 'COLORACAO' | 'TRATAMENTO_CAPILAR';
}

export interface ServiceResponse {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    duracao: number;
    ativo: boolean;
}

export interface BarberShopClient {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    totalAgendamentos: number;
    ultimoAgendamento: string;
}

export interface BarberShopAppointment {
    id: number;
    clienteNome: string;
    servicoNome: string;
    funcionarioNome: string;
    data: string;
    horarioInicio: string;
    horarioFim: string;
    status: string;
    valorTotal: number;
}

