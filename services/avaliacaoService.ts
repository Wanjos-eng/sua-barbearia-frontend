import api from './api';
import { ApiError } from '@/types/api';
import axios from 'axios';

export const avaliacaoService = {
    /**
     * Verifica se um agendamento específico já foi avaliado
     * @param agendamentoId - ID do agendamento a ser verificado
     * @returns true se já foi avaliado, false caso contrário
     */
    verificarAvaliacao: async (agendamentoId: number): Promise<boolean> => {
        try {
            const response = await api.get<boolean>(`/avaliacoes/verificar/${agendamentoId}`);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                // Em caso de erro 500, assumimos que não foi avaliado
                if (error.response.status === 500) {
                    console.error('Erro ao verificar avaliação:', error.response.data);
                    return false;
                }
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    }
};
