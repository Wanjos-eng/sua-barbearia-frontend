
import api from './api';
import { BarberShop, Service, ApiError } from '@/types/api';
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

    getAvailableSlots: async (barberShopId: number, serviceId: number, date: string): Promise<import('@/types/api').AvailableSlot[]> => {
        try {
            const response = await api.get<import('@/types/api').AvailableSlot[]>(`/barbearias/${barberShopId}/horarios-disponiveis`, {
                params: { servicoId: serviceId, data: date }
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

