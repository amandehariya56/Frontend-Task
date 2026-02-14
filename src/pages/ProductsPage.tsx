import { ProductTable } from "@/components/products/ProductTable";

export default function ProductsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                {/* Add button is inside ProductTable now for better layout, or can be here */}
            </div>
            <ProductTable />
        </div>
    );
}
