import api from '@/lib/axios';

export interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  lowStockCount: number;
  averagePrice: number;
  averageRating: number;
  categoryCount: number;
  categoryDistribution: { name: string; value: number }[];
  priceRanges: { name: string; value: number }[];
  topRatedProducts: { name: string; rating: number }[];
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    // Parallel fetch
    const [productsRes, usersRes] = await Promise.all([
      api.get('/products?limit=100'), // Get 100 products for sample analytics
      api.get('/users?limit=30'), // Get default users to avoid large payload/timeouts
    ]);

    const products = productsRes.data.products;
    const totalProducts = productsRes.data.total;
    const totalUsers = usersRes.data.total;

    // Calculations
    const lowStockCount = products.filter((p: any) => p.stock < 10).length;
    const totalRating = products.reduce((acc: number, p: any) => acc + p.rating, 0);
    const averageRating = products.length ? totalRating / products.length : 0;

    const totalPrice = products.reduce((acc: number, p: any) => acc + p.price, 0);
    const averagePrice = products.length ? totalPrice / products.length : 0;

    // Category Distribution (Top 5 + Others)
    const categoryMap: Record<string, number> = {};
    products.forEach((p: any) => {
      categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
    });

    const categoryCount = Object.keys(categoryMap).length;

    const sortedCategories = Object.entries(categoryMap)
      .sort(([, a], [, b]) => b - a)
      .map(([name, value]) => ({ name, value }));

    const topCategories = sortedCategories.slice(0, 5);
    const otherCount = sortedCategories.slice(5).reduce((acc, { value }) => acc + value, 0);
    if (otherCount > 0) {
      topCategories.push({ name: 'Others', value: otherCount });
    }

    // Price Ranges
    const ranges = {
      '0-50': 0,
      '50-100': 0,
      '100-500': 0,
      '500+': 0,
    };
    products.forEach((p: any) => {
      if (p.price <= 50) ranges['0-50']++;
      else if (p.price <= 100) ranges['50-100']++;
      else if (p.price <= 500) ranges['100-500']++;
      else ranges['500+']++;
    });
    const priceRanges = Object.entries(ranges).map(([name, value]) => ({ name, value }));

    // Top Rated
    const topRatedProducts = [...products]
      .sort((a: any, b: any) => b.rating - a.rating)
      .slice(0, 5)
      .map((p: any) => ({ name: p.title, rating: p.rating }));

    return {
      totalProducts,
      totalUsers,
      lowStockCount,
      averagePrice,
      averageRating,
      categoryCount,
      categoryDistribution: topCategories,
      priceRanges,
      topRatedProducts,
    };
  },
};
