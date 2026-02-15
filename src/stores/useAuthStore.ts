import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthState, LoginResponse } from '@/types/auth';

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,

            login: (data: LoginResponse) => {
                const { token, refreshToken, ...user } = data;
                set({
                    user,
                    token,
                    refreshToken,
                    isAuthenticated: true,
                });
            },

            updateToken: (token: string, refreshToken: string) => {
                set({ token, refreshToken });
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    refreshToken: null,
                    isAuthenticated: false,
                });
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
