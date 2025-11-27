
import api from './api';
import { BarberShop, Service, Professional, WorkingHours, ApiError } from '@/types/api';
import axios from 'axios';

export const barberShopService = {

    listServices: async (barberShopId: number): Promise<Service[]> => {
        try {
            const response = await api.get<Service[]>(`/barbearias/${barberShopId}/servicos`);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 404) {
                    return [];
                }
                if (error.response.status === 500) {
                    // Log error but return empty array for better UX
                    console.error('Erro ao listar serviços:', error.response.data);
                    return [];
                }
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    },

    listProfessionals: async (serviceId: number, barberShopId: number): Promise<Professional[]> => {
        try {
            const response = await api.get<Professional[]>(`/funcionarios/servico/${serviceId}`, {
                params: { barbeariaId: barberShopId }
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 404) {
                    return [];
                }
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    },

    getProfessionalWorkingHours: async (professionalId: number): Promise<WorkingHours[]> => {
        try {
            const response = await api.get<WorkingHours[]>(`/horarios/funcionario/${professionalId}`);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 404) {
                    return [];
                }
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    },

    getAvailableSlots: async (barberShopId: number, serviceId: number, date: string, professionalId?: number): Promise<import('@/types/api').AvailableSlot[]> => {
        try {
            const params: { servicoId: number; data: string; funcionarioId?: number } = { servicoId: serviceId, data: date };
            if (professionalId) {
                params.funcionarioId = professionalId;
            }
            console.log('Fetching slots with params:', params);
            const response = await api.get<import('@/types/api').AvailableSlot[]>(`/barbearias/${barberShopId}/horarios-disponiveis`, {
                params
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    },

    listMyClients: async (): Promise<import('@/types/api').BarberShopClient[]> => {
        try {
            const response = await api.get<import('@/types/api').BarberShopClient[]>('/barbearias/meus-clientes');
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

    listMyAppointments: async (data?: string): Promise<import('@/types/api').BarberShopAppointment[]> => {
        try {
            const params = data ? { data } : {};
            const response = await api.get<import('@/types/api').BarberShopAppointment[]>('/barbearias/meus-agendamentos', { params });
            if (response.status === 204 || !response.data) {
                return [];
            }
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 400) {
                    throw { message: 'Formato de data inválido' } as ApiError;
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

    getReviews: async (barberShopId: number): Promise<import('@/types/api').Review[]> => {
        try {
            const response = await api.get<import('@/types/api').Review[]>(`/barbearias/${barberShopId}/avaliacoes`);
            if (response.status === 204 || !response.data) {
                return [];
            }
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 404) {
                    return [];
                }
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    },

    getReviewStats: async (barberShopId: number): Promise<import('@/types/api').ReviewStats | null> => {
        try {
            const response = await api.get<import('@/types/api').ReviewStats>(`/barbearias/${barberShopId}/estatisticas-avaliacoes`);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 404) {
                    return null;
                }
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    },

    /**
     * List all appointments for the authenticated barbershop
     * Returns complete appointment history
     */
    listAllAppointments: async (): Promise<import('@/types/api').DetailedAppointment[]> => {
        try {
            const response = await api.get<import('@/types/api').DetailedAppointment[]>('/barbearias/agendamentos/todos');
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
                    throw { message: 'Usuário não possui role BARBEARIA' } as ApiError;
                }
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    },

    /**
     * List only future appointments for the authenticated barbershop
     * Returns appointments that haven't occurred yet
     */
    listFutureAppointments: async (): Promise<import('@/types/api').DetailedAppointment[]> => {
        try {
            const response = await api.get<import('@/types/api').DetailedAppointment[]>('/barbearias/agendamentos/futuros');
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
                    throw { message: 'Usuário não possui role BARBEARIA' } as ApiError;
                }
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    }
};

