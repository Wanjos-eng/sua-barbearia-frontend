import api from './api';
import {
    Receita,
    CreateReceitaData,
    UpdateReceitaData,
    Despesa,
    CreateDespesaData,
    UpdateDespesaData,
    RelatorioGeral,
    RelatorioComissoes,
    DashboardMetricas
} from '@/types/api';

export const financeiroService = {
    // Receitas
    listarReceitas: async (inicio?: string, fim?: string) => {
        const params = new URLSearchParams();
        if (inicio) params.append('inicio', inicio);
        if (fim) params.append('fim', fim);
        const response = await api.get<Receita[]>(`/financeiro/receitas?${params.toString()}`);
        return response.data;
    },

    adicionarReceita: async (data: CreateReceitaData) => {
        const response = await api.post<Receita>('/financeiro/receitas', data);
        return response.data;
    },

    editarReceita: async (id: number, data: UpdateReceitaData) => {
        const response = await api.put<Receita>(`/financeiro/receitas/${id}`, data);
        return response.data;
    },

    removerReceita: async (id: number) => {
        await api.delete(`/financeiro/receitas/${id}`);
    },

    // Despesas
    listarDespesas: async (inicio?: string, fim?: string) => {
        const params = new URLSearchParams();
        if (inicio) params.append('inicio', inicio);
        if (fim) params.append('fim', fim);
        const response = await api.get<Despesa[]>(`/financeiro/despesas?${params.toString()}`);
        return response.data;
    },

    adicionarDespesa: async (data: CreateDespesaData) => {
        const response = await api.post<Despesa>('/financeiro/despesas', data);
        return response.data;
    },

    editarDespesa: async (id: number, data: UpdateDespesaData) => {
        const response = await api.put<Despesa>(`/financeiro/despesas/${id}`, data);
        return response.data;
    },

    removerDespesa: async (id: number) => {
        await api.delete(`/financeiro/despesas/${id}`);
    },

    // Relatórios
    obterRelatorioGeral: async (periodo: 'DIA' | 'SEMANA' | 'MES' = 'MES') => {
        const response = await api.get<RelatorioGeral>(`/financeiro/relatorios/geral?periodo=${periodo}`);
        return response.data;
    },

    obterRelatorioComissoes: async (dataInicio: string, dataFim: string) => {
        const response = await api.get<RelatorioComissoes>(`/financeiro/relatorios/comissoes?dataInicio=${dataInicio}&dataFim=${dataFim}`);
        return response.data;
    },

    // Dashboard
    obterMetricasDashboard: async () => {
        const response = await api.get<DashboardMetricas>('/financeiro/dashboard/metricas');
        return response.data;
    }
};
