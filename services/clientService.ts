
import api from './api';
import { Appointment, UpdateProfileData, User, ApiError } from '@/types/api';
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
    }
};

