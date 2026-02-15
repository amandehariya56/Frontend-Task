import axios, { InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';

interface FailedRequest {
    resolve: (token: string) => void;
    reject: (error: any) => void;
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://dummyjson.com',
    headers: {
        'Content-Type': 'application/json',
    },
});


api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);


let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            if (token) prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;


        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise<string>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = useAuthStore.getState().refreshToken;

                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }


                const { data } = await axios.post('https://dummyjson.com/auth/refresh', {
                    refreshToken,
                    expiresInMins: 30,
                });

                const { token: newToken, refreshToken: newRefreshToken, accessToken } = data;
                const finalToken = newToken || accessToken;


                useAuthStore.getState().updateToken(finalToken, newRefreshToken);


                processQueue(null, finalToken);


                originalRequest.headers.Authorization = `Bearer ${finalToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                useAuthStore.getState().logout();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
