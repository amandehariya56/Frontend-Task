import { useParams } from "react-router-dom";
import { ProductForm } from "@/components/products/ProductForm";
import { useProduct } from "@/hooks/useProducts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductEditPage() {
    const { id } = useParams<{ id: string }>();
    const { data: product, isLoading, isError } = useProduct(Number(id));

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <Skeleton className="h-10 w-48" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <Skeleton className="h-[500px] w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isError || !product) {
        return <div className="p-8 text-destructive">Failed to load product.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <ProductForm initialData={product} />
                </CardContent>
            </Card>
        </div>
    );
}
