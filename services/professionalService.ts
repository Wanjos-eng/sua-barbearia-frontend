import api from './api';
import { CreateProfessionalData, ProfessionalResponse, ApiError, UpdateProfessionalData, WorkingHoursData, WorkingHours, AccessLinkResponse, LinkExpirationData } from '@/types/api';
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
    },

    /**
     * Update professional data
     * @param id Professional ID
     * @param data Data to update
     */
    updateProfessional: async (id: number, data: UpdateProfessionalData): Promise<ProfessionalResponse> => {
        try {
            const response = await api.put<ProfessionalResponse>(`/barbearias/meus-funcionarios/${id}`, data);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    },

    /**
     * Deactivate a professional (soft delete)
     * @param id Professional ID
     */
    deleteProfessional: async (id: number): Promise<void> => {
        try {
            await api.delete(`/barbearias/meus-funcionarios/${id}`);
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    },

    /**
     * Link services to a professional
     * @param id Professional ID
     * @param serviceIds Array of service IDs
     */
    linkServices: async (id: number, serviceIds: number[]): Promise<void> => {
        try {
            await api.post(`/barbearias/funcionarios/${id}/servicos`, serviceIds);
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    },

    /**
     * Set working hours for a professional
     * @param id Professional ID
     * @param data Working hours data
     */
    setWorkingHours: async (id: number, data: WorkingHoursData): Promise<WorkingHours> => {
        try {
            const response = await api.post<WorkingHours>(`/horarios/funcionario/${id}`, data);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    },

    /**
     * Get working hours for a professional
     * @param id Professional ID
     */
    getWorkingHours: async (id: number): Promise<WorkingHours[]> => {
        try {
            const response = await api.get<WorkingHours[]>(`/horarios/funcionario/${id}`);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    },

    /**
     * Generate access link for a professional
     * @param id Professional ID
     * @param data Optional expiration data
     */
    generateAccessLink: async (id: number, data?: LinkExpirationData): Promise<AccessLinkResponse> => {
        try {
            await api.post(`/barbearias/funcionarios/${id}/link-acesso`, data);
            const status = await professionalService.checkLinkStatus(id);
            return status;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    },

    /**
     * Deactivate access link
     * @param id Professional ID
     */
    deactivateAccessLink: async (id: number): Promise<AccessLinkResponse> => {
        try {
            const response = await api.post<AccessLinkResponse>(`/barbearias/funcionarios/${id}/desativar`);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    },

    /**
     * Check access link status
     * @param id Professional ID
     */
    checkLinkStatus: async (id: number): Promise<AccessLinkResponse> => {
        try {
            const response = await api.get<AccessLinkResponse>(`/barbearias/funcionarios/${id}`);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    },

    /**
     * Update access link expiration
     * @param id Professional ID
     * @param data Expiration data
     */
    updateLinkExpiration: async (id: number, data: LinkExpirationData): Promise<AccessLinkResponse> => {
        try {
            const response = await api.put<AccessLinkResponse>(`/barbearias/funcionarios/${id}/expiracao`, data);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    }
};
