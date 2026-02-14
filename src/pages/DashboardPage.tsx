import { useDashboardStats } from '@/hooks/useDashboard';
import { StatCard } from '@/components/dashboard/StatCard';
import { CategoryDistributionChart, PriceRangeChart, TopRatedChart } from '@/components/dashboard/DashboardCharts';
import { RecentProducts, DashboardSkeleton } from '@/components/dashboard/RecentProducts';
import { Package, Users, AlertTriangle, DollarSign, Activity, ListFilter } from 'lucide-react';
import { ErrorState } from '@/components/common/ErrorState';

export default function DashboardPage() {
    const { data: stats, isLoading, error, refetch } = useDashboardStats();

    if (isLoading) {
        return (
            <div className="p-8 space-y-8">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                </div>
                <DashboardSkeleton />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <ErrorState
                    title="Failed to load dashboard"
                    message="We couldn't fetch the latest statistics. Please check your connection."
                    onRetry={() => refetch()}
                />
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Products"
                    value={stats.totalProducts}
                    icon={Package}
                    description="Total items in catalog"
                />
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={Users}
                    description="Active users"
                />
                <StatCard
                    title="Low Stock"
                    value={stats.lowStockCount}
                    icon={AlertTriangle}
                    description="Products with stock < 10"
                    className="border-destructive/50"
                />
                <StatCard
                    title="Avg Price"
                    value={`$${stats.averagePrice.toFixed(2)}`}
                    icon={DollarSign}
                    description="Average product price"
                />
                <StatCard
                    title="Categories"
                    value={stats.categoryCount}
                    icon={ListFilter}
                    description="Active categories"
                />
                <StatCard
                    title="Avg Rating"
                    value={stats.averageRating.toFixed(1)}
                    icon={Activity}
                    description="Overall catalog rating"
                />
            </div>

            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4">
                    <PriceRangeChart data={stats.priceRanges} title="Price Distribution" />
                </div>
                <div className="col-span-3">
                    <CategoryDistributionChart data={stats.categoryDistribution} title="Category Distribution" />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-3">
                    <TopRatedChart data={stats.topRatedProducts} title="Top Rated Products" />
                </div>
                <div className="col-span-4">
                    <RecentProducts products={stats.topRatedProducts} />
                </div>
            </div>
        </div>
    );
}
