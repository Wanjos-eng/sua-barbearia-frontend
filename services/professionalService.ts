import api from './api';
import { CreateProfessionalData, ProfessionalResponse, ApiError } from '@/types/api';
import axios from 'axios';

export const professionalService = {
    /**
     * Create a new professional for the authenticated barber shop
     * @param data Professional data including name, email, phone and profile type
     * @returns The created professional response
     */
    createProfessional: async (data: CreateProfessionalData): Promise<ProfessionalResponse> => {
        try {
            const response = await api.post<ProfessionalResponse>('/barbearias/meus-funcionarios', data);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 400) {
                    throw { message: 'Dados inválidos ou email já cadastrado' } as ApiError;
                }
                if (error.response.status === 401) {
                    throw { message: 'Token JWT ausente ou inválido' } as ApiError;
                }
                if (error.response.status === 403) {
                    throw { message: 'Usuário não possui permissão' } as ApiError;
                }
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    },

    /**
     * List all active professionals from the authenticated barber shop
     * @returns Array of professionals
     */
    listMyProfessionals: async (): Promise<ProfessionalResponse[]> => {
        try {
            const response = await api.get<ProfessionalResponse[]>('/barbearias/meus-funcionarios');
            if (response.status === 204 || !response.data) {
                return [];
            }
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 401) {
                    throw { message: 'Token JWT ausente ou inválido' } as ApiError;
                }
                if (error.response.status === 403) {
                    throw { message: 'Usuário não possui permissão' } as ApiError;
                }
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    }
};
