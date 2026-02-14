
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useProducts, useProductCategories, useProductMutations } from '@/hooks/useProducts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Eye, Edit, Trash2, Plus, ArrowUpDown } from 'lucide-react';
import { ProductFilters } from '@/types/product';
import { useDebounce } from '@/hooks/useDebounce';
import { Checkbox } from "@/components/ui/checkbox"

export function ProductTable() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // URL State
    const searchParam = searchParams.get('search') || '';
    const categoryParam = searchParams.get('category') || 'all';
    const sortByParam = searchParams.get('sortBy') || 'id';
    const orderParam = (searchParams.get('order') as 'asc' | 'desc') || 'asc';
    const pageParam = Number(searchParams.get('page')) || 1;
    const limit = 10;
    const skip = (pageParam - 1) * limit;

    // Local State for Input (Debounce)
    const [searchInput, setSearchInput] = useState(searchParam);
    const debouncedSearch = useDebounce(searchInput, 300);

    // Sync Debounced Search to URL
    useEffect(() => {
        if (debouncedSearch !== searchParam) {
            setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);
                if (debouncedSearch) newParams.set('search', debouncedSearch);
                else newParams.delete('search');
                newParams.set('page', '1'); // Reset to page 1 on search
                return newParams;
            });
        }
    }, [debouncedSearch, setSearchParams, searchParam]);

    // Derived Filters for Query
    const filters: ProductFilters = {
        search: searchParam,
        category: categoryParam,
        sortBy: sortByParam,
        order: orderParam,
        limit,
        skip
    };

    const { data, isLoading, isError } = useProducts(filters);
    const { data: categories } = useProductCategories();
    const { deleteMutation } = useProductMutations();

    // Bulk Selection State
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const totalPages = data ? Math.ceil(data.total / limit) : 0;

    const handlePageChange = (newPage: number) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set('page', newPage.toString());
            return newParams;
        });
    };

    const handleSort = (field: string) => {
        const newOrder = sortByParam === field && orderParam === 'asc' ? 'desc' : 'asc';
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set('sortBy', field);
            newParams.set('order', newOrder);
            return newParams;
        });
    };

    const handleCategoryChange = (val: string) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            if (val === 'all') newParams.delete('category');
            else newParams.set('category', val);
            newParams.set('page', '1');
            return newParams;
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Delete this product?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleBulkDelete = () => {
        if (confirm(`Delete ${selectedIds.length} products?`)) {
            // In a real app, send array of IDs. For DummyJSON, we loop.
            selectedIds.forEach(id => deleteMutation.mutate(id));
            setSelectedIds([]);
        }
    };

    const toggleSelectAll = (checked: boolean) => {
        if (checked && data) {
            setSelectedIds(data.products.map(p => p.id));
        } else {
            setSelectedIds([]);
        }
    };

    const toggleSelectRow = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(x => x !== id));
        }
    };

    if (isError) return <div className="text-destructive">Error loading products.</div>;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Search products..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-[300px]"
                    />
                    <Select value={categoryParam} onValueChange={handleCategoryChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories?.map((cat) => (
                                <SelectItem key={cat.slug || cat.name || cat} value={cat.slug || cat.name || cat}>
                                    {cat.slug || cat.name || cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    {selectedIds.length > 0 && (
                        <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                            Delete Selected ({selectedIds.length})
                        </Button>
                    )}
                    <Button onClick={() => navigate('/products/add')}>
                        <Plus className="mr-2 h-4 w-4" /> Add Product
                    </Button>
                </div>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40px]">
                                <Checkbox
                                    checked={data && data.products.length > 0 && selectedIds.length === data.products.length}
                                    onCheckedChange={(checked) => toggleSelectAll(!!checked)}
                                />
                            </TableHead>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead onClick={() => handleSort('title')} className="cursor-pointer">
                                Title {sortByParam === 'title' && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                            </TableHead>
                            <TableHead onClick={() => handleSort('price')} className="cursor-pointer">
                                Price {sortByParam === 'price' && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                            </TableHead>
                            <TableHead onClick={() => handleSort('stock')} className="cursor-pointer">
                                Stock {sortByParam === 'stock' && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                            </TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><div className="h-4 w-4 bg-muted animate-pulse" /></TableCell>
                                    <TableCell><div className="h-10 w-10 bg-muted rounded animate-pulse" /></TableCell>
                                    <TableCell><div className="h-4 bg-muted rounded w-[200px] animate-pulse" /></TableCell>
                                    <TableCell><div className="h-4 bg-muted rounded w-[50px] animate-pulse" /></TableCell>
                                    <TableCell><div className="h-4 bg-muted rounded w-[50px] animate-pulse" /></TableCell>
                                    <TableCell><div className="h-4 bg-muted rounded w-[100px] animate-pulse" /></TableCell>
                                    <TableCell className="text-right"><div className="h-8 w-[100px] bg-muted rounded animate-pulse ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : (
                            data?.products.map((product) => (
                                <TableRow key={product.id} data-state={selectedIds.includes(product.id) && "selected"}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedIds.includes(product.id)}
                                            onCheckedChange={(checked) => toggleSelectRow(product.id, !!checked)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <img src={product.thumbnail} alt={product.title} className="h-10 w-10 object-cover rounded" />
                                    </TableCell>
                                    <TableCell className="font-medium">{product.title}</TableCell>
                                    <TableCell>${product.price}</TableCell>
                                    <TableCell>{product.stock}</TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => navigate(`/products/${product.id}`)}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => navigate(`/products/${product.id}/edit`)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(product.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => handlePageChange(pageParam - 1)}
                            className={pageParam <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                    </PaginationItem>
                    <PaginationItem>
                        <span className="flex h-9 w-9 items-center justify-center text-sm border rounded-md">
                            {pageParam} / {totalPages}
                        </span>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext
                            onClick={() => handlePageChange(pageParam + 1)}
                            className={pageParam >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
