import api from './api';
import { CreateAppointmentData, AppointmentResponse, ApiError, RescheduleRequest, RepeatAppointmentRequest } from '@/types/api';
import axios from 'axios';

export const appointmentService = {
    /**
     * Create a new appointment
     * @param data Appointment data including serviceId, professionalId, barberShopId, dateTime and optional notes
     * @returns The created appointment response
     */
    createAppointment: async (data: CreateAppointmentData): Promise<AppointmentResponse> => {
        try {
            const response = await api.post<AppointmentResponse>('/agendamentos', data);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                // Handle specific error cases
                if (error.response.status === 400) {
                    throw { message: 'Dados inválidos. Verifique as informações do agendamento.', ...error.response.data } as ApiError;
                }
                if (error.response.status === 401) {
                    throw { message: 'Token inválido. Faça login novamente.', ...error.response.data } as ApiError;
                }
                if (error.response.status === 422) {
                    throw { message: 'Horário indisponível ou conflito de agendamento.', ...error.response.data } as ApiError;
                }
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede ao criar agendamento' } as ApiError;
        }
    },

    // Confirmar agendamento (PENDENTE -> CONFIRMADO)
    confirmAppointment: async (id: number): Promise<string> => {
        try {
            const response = await api.post<string>(`/agendamentos/${id}/confirmar`);
            return response.data || 'Agendamento confirmado com sucesso';
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 401) {
                    throw { message: 'Token JWT inválido' } as ApiError;
                }
                if (error.response.status === 403) {
                    throw { message: 'Apenas barbearia pode confirmar agendamento' } as ApiError;
                }
                if (error.response.status === 404) {
                    throw { message: 'Agendamento não encontrado' } as ApiError;
                }
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    },

    // Cancelar agendamento (PENDENTE/CONFIRMADO -> CANCELADO)
    cancelAppointment: async (id: number): Promise<void> => {
        try {
            await api.post(`/agendamentos/${id}/cancelar`);
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 401) {
                    throw { message: 'Token JWT inválido' } as ApiError;
                }
                if (error.response.status === 403) {
                    throw { message: 'Você não tem permissão para cancelar este agendamento' } as ApiError;
                }
                if (error.response.status === 404) {
                    throw { message: 'Agendamento não encontrado' } as ApiError;
                }
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede ao cancelar' } as ApiError;
        }
    },

    // Concluir agendamento (CONFIRMADO -> CONCLUIDO)
    completeAppointment: async (id: number): Promise<string> => {
        try {
            const response = await api.post<string>(`/agendamentos/${id}/concluir`);
            return response.data || 'Agendamento concluído com sucesso';
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 401) {
                    throw { message: 'Token JWT inválido' } as ApiError;
                }
                if (error.response.status === 403) {
                    throw { message: 'Apenas barbearia pode concluir agendamento' } as ApiError;
                }
                if (error.response.status === 404) {
                    throw { message: 'Agendamento não encontrado' } as ApiError;
                }
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    },

    // Reagendar agendamento (mudar data/hora)
    rescheduleAppointment: async (id: number, data: RescheduleRequest): Promise<string> => {
        try {
            await api.post(`/agendamentos/${id}/reagendar`, data);
            return 'Agendamento reagendado com sucesso';
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 400) {
                    throw { message: error.response.data?.message || 'Novo horário indisponível' } as ApiError;
                }
                if (error.response.status === 401) {
                    throw { message: 'Token JWT inválido' } as ApiError;
                }
                if (error.response.status === 403) {
                    throw { message: 'Você não tem permissão para reagendar este agendamento' } as ApiError;
                }
                if (error.response.status === 404) {
                    throw { message: 'Agendamento não encontrado' } as ApiError;
                }
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede ao reagendar' } as ApiError;
        }
    },

    // Repetir agendamento (criar novo baseado em um concluído)
    repeatAppointment: async (id: number, data: RepeatAppointmentRequest): Promise<string> => {
        try {
            await api.post(`/agendamentos/${id}/repetir`, data);
            return 'Novo agendamento criado com sucesso';
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 400) {
                    throw { message: error.response.data?.message || 'Agendamento original não está concluído ou data inválida' } as ApiError;
                }
                if (error.response.status === 401) {
                    throw { message: 'Token JWT inválido' } as ApiError;
                }
                if (error.response.status === 403) {
                    throw { message: 'Você não tem permissão para repetir este agendamento' } as ApiError;
                }
                if (error.response.status === 404) {
                    throw { message: 'Agendamento original não encontrado' } as ApiError;
                }
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    },

    getAppointmentById: async (id: number): Promise<AppointmentResponse> => {
        try {
            const response = await api.get<AppointmentResponse>(`/agendamentos/${id}`);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede ao buscar agendamento' } as ApiError;
        }
    }
};
