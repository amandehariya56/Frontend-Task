import api from '@/lib/axios';
import { User, UsersResponse, UserFilters } from '@/types/user';

export const userService = {
    getAll: async (filters: UserFilters = {}): Promise<UsersResponse> => {
        const { limit = 10, skip = 0, search } = filters;
        const params: any = { limit, skip };

        let url = '/users';
        if (search) {
            url = '/users/search';
            params.q = search;
        }

        const { data } = await api.get<UsersResponse>(url, { params });
        return data;
    },

    getById: async (id: number): Promise<User> => {
        const { data } = await api.get<User>(`/users/${id}`);
        return data;
    },
};
