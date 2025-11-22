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
    tipoServico: string;
}

export interface AvailableSlot {
    funcionarioId: number;
    funcionarioNome: string;
    perfilType: string;
    data: string;
    horarioInicio: string;
    horarioFim: string;
}

export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
}
