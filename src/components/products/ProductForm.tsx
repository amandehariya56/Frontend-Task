
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { uploadService } from "@/services/upload.service";
import { Product, CreateProductDTO } from "@/types/product";
import { useProductMutations, useProductCategories } from "@/hooks/useProducts";
import { useNavigate } from "react-router-dom";
import { Loader2, X, UploadCloud } from "lucide-react";

// Schema
const productSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    price: z.coerce.number().min(0.01, "Price must be greater than 0"),
    discountPercentage: z.coerce.number().min(0).max(100).default(0),
    stock: z.coerce.number().min(0, "Stock cannot be negative"),
    brand: z.string().min(2, "Brand is required"),
    category: z.string().min(1, "Category is required"),
    thumbnail: z.string().url("Thumbnail is required").or(z.literal("")), // Validation handled manually for file
    images: z.array(z.string().url()).default([]),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
    initialData?: Product;
}

export function ProductForm({ initialData }: ProductFormProps) {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { createMutation, updateMutation } = useProductMutations();
    const { data: categories } = useProductCategories();

    const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
    const [isUploadingImages, setIsUploadingImages] = useState(false);

    const form = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            price: initialData?.price || 0,
            discountPercentage: initialData?.discountPercentage || 0,
            stock: initialData?.stock || 0,
            brand: initialData?.brand || "",
            category: initialData?.category || "",
            thumbnail: initialData?.thumbnail || "",
            images: initialData?.images || [],
        },
    });

    const isLoading = createMutation.isPending || updateMutation.isPending;

    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast({ title: "Error", description: "File size must be less than 5MB", variant: "destructive" });
            return;
        }

        try {
            setIsUploadingThumbnail(true);
            const url = await uploadService.uploadImage(file);
            form.setValue("thumbnail", url);
            toast({ title: "Success", description: "Thumbnail uploaded successfully" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to upload thumbnail", variant: "destructive" });
        } finally {
            setIsUploadingThumbnail(false);
        }
    };

    const handleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        try {
            setIsUploadingImages(true);
            const uploadPromises = Array.from(files).map((file) => uploadService.uploadImage(file));
            const urls = await Promise.all(uploadPromises);

            const currentImages = form.getValues("images") || [];
            form.setValue("images", [...currentImages, ...urls]);
            toast({ title: "Success", description: `${urls.length} images uploaded` });
        } catch (error) {
            toast({ title: "Error", description: "Failed to upload images", variant: "destructive" });
        } finally {
            setIsUploadingImages(false);
        }
    };

    const removeImage = (index: number) => {
        const currentImages = form.getValues("images") || [];
        const newImages = currentImages.filter((_, i) => i !== index);
        form.setValue("images", newImages);
    };

    const onSubmit = (values: ProductFormValues) => {
        console.log("Submitting form with values:", values);
        if (!values.thumbnail) {
            toast({ title: "Validation Error", description: "Thumbnail is required", variant: "destructive" });
            return;
        }

        if (initialData) {
            updateMutation.mutate(
                { id: initialData.id, data: values },
                {
                    onSuccess: () => {
                        toast({ title: "Product updated", description: "Product updated successfully" });
                        navigate("/products");
                    },
                    onError: (error) => {
                        console.error("Update error:", error);
                        toast({ title: "Error", description: "Failed to update product", variant: "destructive" });
                    }
                }
            );
        } else {
            createMutation.mutate(values as CreateProductDTO, {
                onSuccess: () => {
                    toast({ title: "Product created", description: "Product created successfully" });
                    navigate("/products");
                },
                onError: (error) => {
                    console.error("Create error:", error);
                    toast({ title: "Error", description: "Failed to create product", variant: "destructive" });
                }
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, (errors) => console.log("Form Validation Errors:", errors))} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Product title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Product description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price ($)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" {...field} value={field.value as number} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="discountPercentage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Discount (%)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.1" {...field} value={field.value as number} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="stock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stock</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} value={field.value as number} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="brand"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Brand</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Brand name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories?.map((cat) => (
                                                <SelectItem key={cat} value={cat}>
                                                    {cat}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-6">
                        {/* Thumbnail Upload */}
                        <div className="space-y-4">
                            <FormLabel>Thumbnail</FormLabel>
                            <div className="flex items-center gap-4">
                                {form.watch("thumbnail") && (
                                    <div className="relative h-32 w-32 border rounded-md overflow-hidden">
                                        <img src={form.watch("thumbnail")} alt="Thumbnail" className="object-cover w-full h-full" />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-1 right-1 h-6 w-6"
                                            onClick={() => form.setValue("thumbnail", "")}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                )}
                                <div className="flex-1">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleThumbnailUpload}
                                        disabled={isUploadingThumbnail}
                                    />
                                    {isUploadingThumbnail && <p className="text-xs text-muted-foreground mt-1">Uploading...</p>}
                                </div>
                            </div>
                        </div>

                        {/* Multiple Images Upload */}
                        <div className="space-y-4">
                            <FormLabel>Gallery Images</FormLabel>
                            <div className="grid grid-cols-3 gap-4">
                                {form.watch("images")?.map((url, index) => (
                                    <div key={index} className="relative aspect-square border rounded-md overflow-hidden">
                                        <img src={url} alt={`Gallery ${index}`} className="object-cover w-full h-full" />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-1 right-1 h-6 w-6"
                                            onClick={() => removeImage(index)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}
                                <div className="flex items-center justify-center border-2 border-dashed rounded-md aspect-square bg-muted/10">
                                    <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                                        <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                                        <span className="text-xs text-muted-foreground">Upload Images</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            onChange={handleImagesUpload}
                                            disabled={isUploadingImages}
                                        />
                                    </label>
                                </div>
                            </div>
                            {isUploadingImages && <p className="text-xs text-muted-foreground">Uploading images...</p>}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => navigate("/products")}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? "Update Product" : "Create Product"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
