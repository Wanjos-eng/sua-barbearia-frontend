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
    nomeFantasia?: string;
    endereco?: string;
    telefone?: string;
    email?: string;
    avaliacaoMedia?: number;
    ativo?: boolean;
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

export interface UpdateServiceData {
    nome: string;
    descricao: string;
    preco: number;
    duracao: number;
    tipoServico: string; // Backend requires this even though it's immutable
}

export interface ServiceResponse {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    duracao: number;
    tipoServico?: string;
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


export interface UpdateProfessionalData {
    nome: string;
    email: string;
    telefone: string;
    perfilType?: 'BARBEIRO' | 'MANICURE' | 'ESTETICISTA' | 'COLORISTA';
    profissao?: 'BARBEIRO' | 'MANICURE' | 'ESTETICISTA' | 'COLORISTA';
}

export interface WorkingHoursData {
    diaSemana: string | number;
    horaAbertura: string;
    horaFechamento: string;
    ativo: boolean;
}

export interface AccessLinkResponse {
    funcionarioId: number;
    nome: string;
    linkAcesso: string;
    tokenAtivo: boolean;
    tokenGeradoEm: string;
    tokenExpiraEm: string;
}

export interface LinkExpirationData {
    diasExpiracao: number;
}

// Review/Rating types
export interface CreateReviewData {
    barbeariaId: number;
    agendamentoId: number;
    notaServico: number;
    notaAmbiente: number;
    notaLimpeza: number;
    notaAtendimento: number;
    comentario: string;
}

export interface Review {
    id: number;
    barbeariaId: number;
    agendamentoId: number;
    clienteNome: string;
    notaServico: number;
    notaAmbiente: number;
    notaLimpeza: number;
    notaAtendimento: number;
    notaGeral: number;
    comentario: string;
    dataCriacao: string;
}

export interface ReviewStats {
    barbeariaId: number;
    mediaGeral: number;
    mediaServico: number;
    mediaAmbiente: number;
    mediaLimpeza: number;
    mediaAtendimento: number;
    totalAvaliacoes: number;
    avaliacoes1Estrela: number;
    avaliacoes2Estrelas: number;
    avaliacoes3Estrelas: number;
    avaliacoes4Estrelas: number;
    avaliacoes5Estrelas: number;
}

// Available dates and times
export interface TimeSlot {
    hour: number;
    minute: number;
    second: number;
    nano: number;
}

export interface AvailableTimeSlot {
    funcionarioId: number;
    funcionarioNome: string;
    profissao: string;
    data: string;
    horarioInicio: string | TimeSlot;
    horarioFim: string | TimeSlot;
}

// Recent appointments
export interface RecentAppointment {
    id: number;
    dataHora: string;
    status: string;
    nomeBarbearia: string;
    nomeBarbeiro: string | null;
    nomeServico: string;
    observacoes: string | null;
}

export interface DetailedAppointment {
    id: number;
    dataHora: string;
    status: 'PENDENTE' | 'CONFIRMADO' | 'CANCELADO' | 'CONCLUIDO' | string;
    observacoes: string | null;
    clienteId: number;
    clienteNome: string;
    clienteTelefone: string;
    servicoId: number;
    servicoNome: string;
    servicoTipo: string;
    servicoPreco: number;
    servicoDuracao: number;
    funcionarioId: number;
    funcionarioNome: string;
    funcionarioProfissao: string;
    dataCriacao: string;
    dataAtualizacao: string;
}

export interface RescheduleRequest {
    novaDataHora: string;
}

export interface RepeatAppointmentRequest {
    novaDataHora: string;
}

