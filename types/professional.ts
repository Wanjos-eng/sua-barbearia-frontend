// Types for Professional Dashboard API

export interface TimeSlot {
    hour: number;
    minute: number;
    second: number;
    nano: number;
}

export interface ProfessionalInfo {
    funcionarioId: number;
    nome: string;
    email: string;
    perfil: string;
    linkInfo: string;
}

export interface ProfessionalWorkingHours {
    id: number;
    barbeariaId: number;
    funcionarioId: number;
    diaSemana: number;
    horaAbertura: TimeSlot;
    horaFechamento: TimeSlot;
    ativo: boolean;
}

export interface ProfessionalException {
    id: number;
    funcionarioId: number;
    funcionarioNome: string;
    data: string;
    horaAbertura: TimeSlot;
    horaFechamento: TimeSlot;
    motivo: string;
    criadoPor: string;
    ativo: boolean;
    dataCriacao: string;
}

export interface ProfessionalBlock {
    id: number;
    funcionarioId: number;
    funcionarioNome: string;
    data: string;
    horarioInicio: TimeSlot;
    horarioFim: TimeSlot;
    motivo: string;
    criadoPor: string;
    dataCriacao: string;
}

export interface ProfessionalAppointment {
    id: number;
    dataHora: string;
    dataHoraFim?: string;
    duracao?: number;
    status: string;
    nomeBarbearia: string;
    nomeBarbeiro: string;
    nomeServico: string;
    observacoes: string;
}

// Request payloads
export interface SetWorkingHoursData {
    diaSemana: number;
    horaAbertura: string;
    horaFechamento: string;
    ativo: boolean;
}

export interface SetWorkingHoursBatchData {
    horarios: SetWorkingHoursData[];
}

export interface CreateExceptionData {
    data: string;
    horaAbertura: string;
    horaFechamento: string;
    motivo: string;
}

export interface CreateExceptionBatchData {
    excecoes: CreateExceptionData[];
}

export interface CreateBlockData {
    data: string;
    horarioInicio: string;
    horarioFim: string;
    motivo: string;
}

export interface CreateBlockBatchData {
    bloqueios: CreateBlockData[];
}
