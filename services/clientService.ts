
import api from './api';
import { Appointment, UpdateProfileData, User, ApiError, RecentAppointment, CreateReviewData, Review, ReviewStats, AvailableTimeSlot } from '@/types/api';
import axios from 'axios';

export const clientService = {
    getHistory: async (): Promise<Appointment[]> => {
        try {
            const response = await api.get<Appointment[]>('/clientes/meus-agendamentos/historico');
            // Handle 204 or empty list
            if (response.status === 204 || !response.data) {
                return [];
            }
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    },

    updateProfile: async (data: UpdateProfileData): Promise<User> => {
        try {
            const response = await api.put<User>('/clientes/meu-perfil', data);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    },

    getUpcomingAppointments: async (): Promise<Appointment[]> => {
        try {
            const response = await api.get<Appointment[]>('/clientes/meus-agendamentos/historico');
            if (response.status === 204 || !response.data) {
                return [];
            }

            // Filter only future appointments (PENDENTE or CONFIRMADO)
            const now = new Date();
            return response.data.filter(app => {
                const appointmentDate = new Date(app.dataHora);
                return appointmentDate > now && (app.status === 'PENDENTE' || app.status === 'CONFIRMADO');
            });
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    },

    getRecentAppointments: async (tipo?: 'futuros' | 'concluidos_recentes'): Promise<RecentAppointment[]> => {
        try {
            const params: { tipo?: 'futuros' | 'concluidos_recentes' } = {};
            if (tipo) {
                params.tipo = tipo;
            }
            const response = await api.get<RecentAppointment[]>('/clientes/meus-agendamentos/recentes', { params });
            if (response.status === 204 || !response.data) {
                return [];
            }
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 400) {
                    throw { message: 'Tipo inválido' } as ApiError;
                }
                if (error.response.status === 401) {
                    throw { message: 'Token inválido' } as ApiError;
                }
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    },

    // Reviews
    createReview: async (data: CreateReviewData): Promise<Review> => {
        try {
            const response = await api.post<Review>('/avaliacoes', data);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    },

    getBarberShopReviews: async (barbeariaId: number): Promise<Review[]> => {
        try {
            const response = await api.get<Review[]>(`/barbearias/${barbeariaId}/avaliacoes`);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    },

    getBarberShopReviewStats: async (barbeariaId: number): Promise<ReviewStats> => {
        try {
            const response = await api.get<ReviewStats>(`/barbearias/${barbeariaId}/estatisticas-avaliacoes`);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    },

    // Available dates and times
    getAvailableDates: async (
        barbeariaId: number,
        servicoId: number,
        ano: number,
        mes: number,
        funcionarioId?: number
    ): Promise<string[]> => {
        try {
            const params: Record<string, number> = { ano, mes };
            if (funcionarioId) params.funcionarioId = funcionarioId;

            const response = await api.get<string[]>(
                `/barbearias/${barbeariaId}/servicos/${servicoId}/datas-disponiveis`,
                { params }
            );
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    },

    getAvailableTimeSlots: async (
        barbeariaId: number,
        servicoId: number,
        data: string,
        funcionarioId?: number
    ): Promise<AvailableTimeSlot[]> => {
        try {
            const params: Record<string, string | number> = { data };
            if (funcionarioId) params.funcionarioId = funcionarioId;

            console.log('Fetching slots with params:', { url: `/barbearias/${barbeariaId}/servicos/${servicoId}/horarios-disponiveis`, params });

            const response = await api.get<AvailableTimeSlot[]>(
                `/barbearias/${barbeariaId}/servicos/${servicoId}/horarios-disponiveis`,
                { params }
            );
            console.log('Slots response:', response.data);
            return response.data;
        } catch (error: unknown) {
            console.error('Error fetching slots API:', error);
            if (axios.isAxiosError(error) && error.response) {
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    }
};

