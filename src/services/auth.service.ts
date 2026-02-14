import api from '@/lib/axios';
import { LoginResponse } from '@/types/auth';

export const authService = {
    login: async (username: string, password: string): Promise<LoginResponse> => {
        const { data } = await api.post<any>('/auth/login', {
            username,
            password,
            expiresInMins: 1, // Short expiry to test refresh logic as requested
        });

        return {
            ...data,
            token: data.token || data.accessToken,
        };
    },

    getCurrentUser: async () => {
        const { data } = await api.get('/auth/me');
        return data;
    },
};
