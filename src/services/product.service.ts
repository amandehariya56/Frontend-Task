import api from '@/lib/axios';
import { Product, ProductsResponse, CreateProductDTO, UpdateProductDTO, ProductFilters } from '@/types/product';

export const productService = {
    getAll: async (filters: ProductFilters = {}): Promise<ProductsResponse> => {
        const { search, category, sortBy, order, limit = 10, skip = 0 } = filters;

        let url = '/products';
        const params: any = { limit, skip };

        if (search) {
            url = `/products/search`;
            params.q = search;
        } else if (category && category !== 'all') {
            url = `/products/category/${category}`;
        }

        if (sortBy) {
            params.sortBy = sortBy;
            params.order = order || 'asc';
        }

        const { data } = await api.get<ProductsResponse>(url, { params });
        return data;
    },

    getById: async (id: number): Promise<Product> => {
        const { data } = await api.get<Product>(`/products/${id}`);
        return data;
    },

    getCategories: async (): Promise<string[]> => {
        const { data } = await api.get<string[]>('/products/categories');
        // Ensure we return just strings (DummyJSON might return objects sometimes based on version, but usually strings)
        // The current version returns: [{slug: '...', name: '...'}, ...] OR ['...', '...']. 
        // Standard DummyJSON returns generic list. I'll assume list of objects if the array consists of objects, otherwise strings.
        // Let's safe guard.
        if (data.length > 0 && typeof data[0] === 'object') {
            return (data as any[]).map((c: any) => c.slug || c.name);
        }
        return data;
    },

    create: async (product: CreateProductDTO): Promise<Product> => {
        const { data } = await api.post<Product>('/products/add', product);
        return data;
    },

    update: async (id: number, product: UpdateProductDTO): Promise<Product> => {
        const { data } = await api.put<Product>(`/products/${id}`, product);
        return data;
    },

    delete: async (id: number): Promise<Product> => {
        const { data } = await api.delete<Product>(`/products/${id}`);
        return data;
    },
};
