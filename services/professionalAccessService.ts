import axios, { AxiosInstance } from 'axios';
import type {
    ProfessionalInfo,
    ProfessionalWorkingHours,
    ProfessionalException,
    ProfessionalBlock,
    ProfessionalAppointment,
    SetWorkingHoursData,
    SetWorkingHoursBatchData,
    CreateExceptionData,
    CreateExceptionBatchData,
    CreateBlockData,
    CreateBlockBatchData
} from '@/types/professional';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sua-barbearia-g7f7ftc4f6ewbkch.centralus-01.azurewebsites.net/api';

// Create isolated axios instance WITHOUT JWT interceptors for professional public access
const professionalAxios: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * Service for professional dashboard access (token-based, no JWT)
 */
export const professionalAccessService = {
    /**
     * Get professional info and summary
     */
    getInfo: async (accessToken: string): Promise<ProfessionalInfo> => {
        try {
            const response = await professionalAxios.get<ProfessionalInfo>(`/profissional/${accessToken}`);
            return response.data;
        } catch (error) {
            console.error('Error getting professional info:', error);
            if (axios.isAxiosError(error)) {
                console.error('Response:', error.response?.data);
                console.error('Status:', error.response?.status);
                throw new Error(error.response?.data?.message || 'Erro ao carregar informações do profissional');
            }
            throw error;
        }
    },

    /**
     * Get professional appointments
     */
    getAppointments: async (
        accessToken: string,
        params?: { status?: string; dataInicio?: string; dataFim?: string }
    ): Promise<ProfessionalAppointment[]> => {
        const response = await axios.get<ProfessionalAppointment[]>(
            `${API_URL}/profissional/${accessToken}/agendamentos`,
            { params }
        );
        return response.data;
    },

    /**
     * Get working hours
     */
    getWorkingHours: async (accessToken: string): Promise<ProfessionalWorkingHours[]> => {
        const response = await axios.get<ProfessionalWorkingHours[]>(
            `${API_URL}/profissional/${accessToken}/horarios`
        );
        return response.data;
    },

    /**
     * Set working hours for a single day
     */
    setWorkingHours: async (accessToken: string, data: SetWorkingHoursData): Promise<ProfessionalWorkingHours> => {
        const response = await axios.post<ProfessionalWorkingHours>(
            `${API_URL}/profissional/${accessToken}/horarios`,
            data
        );
        return response.data;
    },

    /**
     * Set working hours for multiple days (batch)
     */
    setWorkingHoursBatch: async (accessToken: string, data: SetWorkingHoursBatchData): Promise<ProfessionalWorkingHours[]> => {
        const response = await axios.post<ProfessionalWorkingHours[]>(
            `${API_URL}/profissional/${accessToken}/horarios/lote`,
            data
        );
        return response.data;
    },

    /**
     * Get exceptions (extra availability)
     */
    getExceptions: async (
        accessToken: string,
        params?: { dataInicio?: string; dataFim?: string }
    ): Promise<ProfessionalException[]> => {
        const response = await axios.get<ProfessionalException[]>(
            `${API_URL}/profissional/${accessToken}/excecoes`,
            { params }
        );
        return response.data;
    },

    /**
     * Create exception (extra availability)
     */
    createException: async (accessToken: string, data: CreateExceptionData): Promise<ProfessionalException> => {
        const response = await axios.post<ProfessionalException>(
            `${API_URL}/profissional/${accessToken}/excecoes`,
            data
        );
        return response.data;
    },

    /**
     * Create multiple exceptions (batch)
     */
    createExceptionBatch: async (accessToken: string, data: CreateExceptionBatchData): Promise<ProfessionalException[]> => {
        const response = await axios.post<ProfessionalException[]>(
            `${API_URL}/profissional/${accessToken}/excecoes/lote`,
            data
        );
        return response.data;
    },

    /**
     * Delete exception
     */
    deleteException: async (accessToken: string, excecaoId: number): Promise<void> => {
        await axios.delete(`${API_URL}/profissional/${accessToken}/excecoes/${excecaoId}`);
    },

    /**
     * Get blocks
     */
    getBlocks: async (
        accessToken: string,
        params?: { dataInicio?: string; dataFim?: string }
    ): Promise<ProfessionalBlock[]> => {
        const response = await axios.get<ProfessionalBlock[]>(
            `${API_URL}/profissional/${accessToken}/bloqueios`,
            { params }
        );
        return response.data;
    },

    /**
     * Create block
     */
    createBlock: async (accessToken: string, data: CreateBlockData): Promise<ProfessionalBlock> => {
        const response = await axios.post<ProfessionalBlock>(
            `${API_URL}/profissional/${accessToken}/bloqueios`,
            data
        );
        return response.data;
    },

    /**
     * Create multiple blocks (batch)
     */
    createBlockBatch: async (accessToken: string, data: CreateBlockBatchData): Promise<ProfessionalBlock[]> => {
        const response = await axios.post<ProfessionalBlock[]>(
            `${API_URL}/profissional/${accessToken}/bloqueios/lote`,
            data
        );
        return response.data;
    },

    /**
     * Delete block
     */
    deleteBlock: async (accessToken: string, bloqueioId: number): Promise<void> => {
        await axios.delete(`${API_URL}/profissional/${accessToken}/bloqueios/${bloqueioId}`);
    },

    /**
     * Confirm appointment
     */
    confirmAppointment: async (accessToken: string, agendamentoId: number): Promise<void> => {
        await professionalAxios.post(`/profissional/${accessToken}/agendamentos/${agendamentoId}/confirmar`);
    },

    /**
     * Complete appointment
     */
    completeAppointment: async (accessToken: string, agendamentoId: number): Promise<void> => {
        await professionalAxios.post(`/profissional/${accessToken}/agendamentos/${agendamentoId}/concluir`);
    },

    /**
     * Cancel appointment
     */
    cancelAppointment: async (accessToken: string, agendamentoId: number): Promise<void> => {
        await professionalAxios.post(`/profissional/${accessToken}/agendamentos/${agendamentoId}/cancelar`);
    }
};
