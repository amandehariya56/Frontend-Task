import { useState } from "react";
import { useUsers } from "@/hooks/useUsers";
import { useDebounce } from "@/hooks/useDebounce";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { User } from "@/types/user";

export default function UsersPage() {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);
    const [limit] = useState(10);
    const [skip, setSkip] = useState(0);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const { data, isLoading, isError } = useUsers({ search: debouncedSearch, limit, skip });

    const totalPages = data ? Math.ceil(data.total / limit) : 0;
    const currentPage = Math.ceil(skip / limit) + 1;

    const handlePageChange = (page: number) => {
        setSkip((page - 1) * limit);
    };

    if (isError) return <div className="p-8 text-destructive">Failed to load users.</div>;

    return (
        <div className="space-y-6 pt-6 pl-8">
            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
            <div className="flex items-center gap-4">
                <Input
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Avatar</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>City</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><div className="h-10 w-10 rounded-full bg-muted animate-pulse" /></TableCell>
                                    <TableCell><div className="h-4 w-32 bg-muted rounded animate-pulse" /></TableCell>
                                    <TableCell><div className="h-4 w-40 bg-muted rounded animate-pulse" /></TableCell>
                                    <TableCell><div className="h-4 w-24 bg-muted rounded animate-pulse" /></TableCell>
                                    <TableCell><div className="h-4 w-32 bg-muted rounded animate-pulse" /></TableCell>
                                    <TableCell><div className="h-4 w-24 bg-muted rounded animate-pulse" /></TableCell>
                                </TableRow>
                            ))
                        ) : (
                            data?.users.map((user) => (
                                <TableRow
                                    key={user.id}
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => setSelectedUser(user)}
                                >
                                    <TableCell>
                                        <Avatar>
                                            <AvatarImage src={user.image} alt={user.username} />
                                            <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phone}</TableCell>
                                    <TableCell>{user.company.name}</TableCell>
                                    <TableCell>{user.address.city}</TableCell>
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
                            onClick={() => handlePageChange(currentPage - 1)}
                            className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                    </PaginationItem>
                    <PaginationItem>
                        <span className="flex h-9 w-9 items-center justify-center text-sm">
                            {currentPage} / {totalPages}
                        </span>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext
                            onClick={() => handlePageChange(currentPage + 1)}
                            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>

            <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                        <DialogDescription>
                            Information about {selectedUser?.firstName} {selectedUser?.lastName}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="grid grid-cols-2 gap-6 mt-4">
                            <div className="flex flex-col items-center space-y-4">
                                <Avatar className="h-32 w-32">
                                    <AvatarImage src={selectedUser.image} />
                                    <AvatarFallback>{selectedUser.firstName[0]}</AvatarFallback>
                                </Avatar>
                                <div className="text-center">
                                    <h3 className="text-xl font-bold">{selectedUser.firstName} {selectedUser.lastName}</h3>
                                    <p className="text-muted-foreground">@{selectedUser.username}</p>
                                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                                </div>
                            </div>
                            <div className="space-y-4 text-sm">
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="font-bold">Company:</span>
                                    <span className="col-span-2">{selectedUser.company.name}</span>
                                    <span className="font-bold">Title:</span>
                                    <span className="col-span-2">{selectedUser.company.title}</span>
                                    <span className="font-bold">Address:</span>
                                    <span className="col-span-2">
                                        {selectedUser.address.address}, {selectedUser.address.city}, {selectedUser.address.state}
                                    </span>
                                    <span className="font-bold">University:</span>
                                    <span className="col-span-2">{selectedUser.university}</span>
                                    <span className="font-bold">IP:</span>
                                    <span className="col-span-2 font-mono">{selectedUser.ip}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
