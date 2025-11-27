import api from './api';
import { CreateServiceData, ServiceResponse, ApiError } from '@/types/api';
import axios from 'axios';

export const serviceService = {
    /**
     * Create a new service for the authenticated barber shop
     * @param data Service data including name, description, price, duration, and type
     * @returns The created service response
     */
    createService: async (data: CreateServiceData): Promise<ServiceResponse> => {
        try {
            const response = await api.post<ServiceResponse>('/barbearias/servicos', data);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 400) {
                    throw { message: 'Dados inválidos' } as ApiError;
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
     * List all active services from a specific barber shop
     * @param barbeariaId Barber shop ID
     * @returns Array of services
     */
    listServices: async (barbeariaId: number): Promise<ServiceResponse[]> => {
        try {
            const response = await api.get<ServiceResponse[]>(`/barbearias/${barbeariaId}/servicos`);
            if (response.status === 204 || !response.data) {
                return [];
            }
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 404) {
                    return []; // Barbearia não encontrada, retorna vazio
                }
                if (error.response.status === 400) {
                    throw { message: 'Barbearia está inativa' } as ApiError;
                }
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    },

    /**
     * Update an existing service for the authenticated barber shop
     * Note: tipoServico is IMMUTABLE and cannot be changed after creation
     * @param id Service ID to update
     * @param data Service data excluding tipoServico
     * @returns The updated service response
     */
    updateService: async (id: number, data: import('@/types/api').UpdateServiceData): Promise<ServiceResponse> => {
        try {
            const response = await api.put<ServiceResponse>(`/barbearias/servicos/${id}`, data);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 400) {
                    throw { message: error.response.data?.message || 'Dados inválidos ou tentativa de alterar tipoServico' } as ApiError;
                }
                if (error.response.status === 401) {
                    throw { message: 'Token JWT ausente ou inválido' } as ApiError;
                }
                if (error.response.status === 404) {
                    throw { message: 'Serviço não encontrado ou não pertence à barbearia' } as ApiError;
                }
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    },

    /**
     * Delete (deactivate) a service for the authenticated barber shop
     * This is a soft delete that preserves appointment history
     * @param id Service ID to deactivate
     * @returns Success message
     */
    deleteService: async (id: number): Promise<string> => {
        try {
            const response = await api.delete<string>(`/barbearias/servicos/${id}`);
            return response.data || 'Serviço desativado com sucesso. O histórico de agendamentos foi preservado.';
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 401) {
                    throw { message: 'Token JWT ausente ou inválido' } as ApiError;
                }
                if (error.response.status === 404) {
                    throw { message: 'Serviço não encontrado ou não pertence à barbearia' } as ApiError;
                }
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    }
};
