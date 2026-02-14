import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { UserFilters } from '@/types/user';

export const useUsers = (filters: UserFilters) => {
    return useQuery({
        queryKey: ['users', filters],
        queryFn: () => userService.getAll(filters),
        placeholderData: (previousData) => previousData,
    });
};

export const useUser = (id: number | null) => {
    return useQuery({
        queryKey: ['user', id],
        queryFn: () => userService.getById(id!),
        enabled: !!id,
    });
};
