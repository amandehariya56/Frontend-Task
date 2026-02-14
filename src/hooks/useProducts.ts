import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/product.service';
import { ProductFilters, CreateProductDTO, UpdateProductDTO } from '@/types/product';

export const useProducts = (filters: ProductFilters) => {
    return useQuery({
        queryKey: ['products', filters],
        queryFn: () => productService.getAll(filters),
        placeholderData: (previousData) => previousData, // keep previous data while fetching new page
        staleTime: 5000,
    });
};

export const useProduct = (id: number) => {
    return useQuery({
        queryKey: ['product', id],
        queryFn: () => productService.getById(id),
        enabled: !!id,
    });
};

export const useProductCategories = () => {
    return useQuery({
        queryKey: ['product-categories'],
        queryFn: productService.getCategories,
        staleTime: Infinity, // categories rarely change
    });
};

export const useProductMutations = () => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (newProduct: CreateProductDTO) => productService.create(newProduct),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateProductDTO }) => productService.update(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.setQueryData(['product', data.id], data);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => productService.delete(id),
        onMutate: async (deletedId) => {
            await queryClient.cancelQueries({ queryKey: ['products'] });
            const previousProducts = queryClient.getQueryData(['products']);

            queryClient.setQueryData(['products'], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    products: old.products.filter((p: any) => p.id !== deletedId),
                    total: old.total - 1
                };
            });

            return { previousProducts };
        },
        onError: (err, newTodo, context) => {
            queryClient.setQueryData(['products'], context?.previousProducts);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });

    return { createMutation, updateMutation, deleteMutation };
};
