import api from './api';
import { CreateAppointmentData, AppointmentResponse, ApiError } from '@/types/api';
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

    rescheduleAppointment: async (id: number, data: import('@/types/api').RescheduleData): Promise<AppointmentResponse> => {
        try {
            const response = await api.post<AppointmentResponse>(`/agendamentos/${id}/reagendar`, data);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede ao reagendar' } as ApiError;
        }
    },

    cancelAppointment: async (id: number): Promise<void> => {
        try {
            await api.post(`/agendamentos/${id}/cancelar`);
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede ao cancelar' } as ApiError;
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
