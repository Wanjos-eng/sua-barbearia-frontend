
import api from './api';
import { RegisterClientData, LoginData, AuthResponse, ApiError, User } from '@/types/api';
import axios from 'axios';

export const authService = {
    registerClient: async (data: RegisterClientData): Promise<AuthResponse> => {
        try {
            const response = await api.post<AuthResponse>('/auth/cliente/registrar', data);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    },

    loginClient: async (data: LoginData): Promise<AuthResponse> => {
        try {
            const response = await api.post<any>('/auth/cliente/login', data);

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);

                // Handle flat structure or nested user object
                const userData = response.data.user || {
                    id: response.data.userId,
                    nome: response.data.nome,
                    email: response.data.email,
                    role: response.data.role,
                    telefone: response.data.telefone
                };

                if (userData && (userData.id || userData.userId)) {
                    // Ensure id is set if it came as userId
                    if (!userData.id && userData.userId) {
                        userData.id = userData.userId;
                    }
                    localStorage.setItem('user', JSON.stringify(userData));
                }
            }
            return response.data;
        } catch (error: unknown) {
            console.error('Login error:', error);
            if (axios.isAxiosError(error) && error.response) {
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    },

    loginBarberShop: async (data: LoginData): Promise<AuthResponse> => {
        try {
            const response = await api.post<any>('/auth/barbearia/login', data);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                // Handle flat structure or nested user object
                const userData = response.data.user || {
                    id: response.data.userId,
                    nome: response.data.nome,
                    email: response.data.email,
                    role: response.data.role,
                    telefone: response.data.telefone
                };

                if (userData && (userData.id || userData.userId)) {
                    if (!userData.id && userData.userId) {
                        userData.id = userData.userId;
                    }
                    localStorage.setItem('user', JSON.stringify(userData));
                }
            }
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    },

    loginBarber: async (data: LoginData): Promise<AuthResponse> => {
        try {
            const response = await api.post<any>('/auth/barbeiro/login', data);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                // Handle flat structure or nested user object
                const userData = response.data.user || {
                    id: response.data.userId,
                    nome: response.data.nome,
                    email: response.data.email,
                    role: response.data.role,
                    telefone: response.data.telefone
                };

                if (userData && (userData.id || userData.userId)) {
                    if (!userData.id && userData.userId) {
                        userData.id = userData.userId;
                    }
                    localStorage.setItem('user', JSON.stringify(userData));
                }
            }
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                throw error.response.data as ApiError;
            }
            throw { message: 'Erro de rede' };
        }
    },

    logout: () => {
        const userStr = localStorage.getItem('user');
        let redirectUrl = '/';

        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.role === 'BARBEARIA' || user.role === 'BARBEIRO') {
                    redirectUrl = '/login/barbearia';
                } else if (user.role === 'CLIENTE') {
                    redirectUrl = '/login/cliente';
                }
            } catch (e) {
                // Fallback to root
            }
        }

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (typeof window !== 'undefined') {
            window.location.href = redirectUrl;
        }
    },

    getCurrentUser: (): User | null => {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        }
        return null;
    },

    updateCurrentUser: (user: User) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }
};

