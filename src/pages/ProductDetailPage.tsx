import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Edit } from "lucide-react";

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: product, isLoading, isError } = useProduct(Number(id));

    if (isLoading) return <div className="p-8">Loading...</div>;
    if (isError || !product) return <div className="p-8 text-destructive">Product not found.</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate("/products")}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                <div className="space-y-4">
                    <div className="aspect-square rounded-lg border overflow-hidden">
                        <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {product.images?.map((img, i) => (
                            <div key={i} className="aspect-square rounded-md border overflow-hidden">
                                <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>


                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold">{product.title}</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary">{product.category}</Badge>
                            <Badge variant="outline">{product.brand}</Badge>
                            {product.stock < 10 && <Badge variant="destructive">Low Stock</Badge>}
                        </div>
                    </div>

                    <div className="text-4xl font-bold text-primary">
                        ${product.price}
                        {product.discountPercentage > 0 && (
                            <span className="text-lg text-muted-foreground line-through ml-2 font-normal">
                                ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                            </span>
                        )}
                    </div>

                    <p className="text-lg text-muted-foreground">{product.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-4 bg-muted rounded-md">
                            <span className="block text-muted-foreground">Rating</span>
                            <span className="font-semibold text-lg">{product.rating} / 5</span>
                        </div>
                        <div className="p-4 bg-muted rounded-md">
                            <span className="block text-muted-foreground">Stock</span>
                            <span className="font-semibold text-lg">{product.stock} items</span>
                        </div>
                    </div>

                    <Button onClick={() => navigate(`/products/${product.id}/edit`)} className="w-full">
                        <Edit className="mr-2 h-4 w-4" /> Edit Product
                    </Button>
                </div>
            </div>
        </div>
    );
}
