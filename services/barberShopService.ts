
import api from './api';
import { BarberShop, Service, Professional, WorkingHours, ApiError } from '@/types/api';
import axios from 'axios';

export const barberShopService = {
    listBarberShops: async (): Promise<BarberShop[]> => {
        try {
            const response = await api.get<BarberShop[]>('/barbearias');
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    },

    listServices: async (barberShopId: number): Promise<Service[]> => {
        try {
            const response = await api.get<Service[]>(`/barbearias/${barberShopId}/servicos`);
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
            const params: any = { servicoId: serviceId, data: date };
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
    }
};

