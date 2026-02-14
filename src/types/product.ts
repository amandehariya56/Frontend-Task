export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
}

export interface ProductsResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

export interface ProductFilters {
    search?: string;
    category?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
    limit?: number;
    skip?: number;
}

export type CreateProductDTO = Omit<Product, 'id' | 'rating'>;
export type UpdateProductDTO = Partial<CreateProductDTO>;
