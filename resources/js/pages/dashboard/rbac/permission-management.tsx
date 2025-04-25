import InputError from '@/components/atoms/input-error';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { PaginatedData } from '@/types';
import { PermissionForm, PermissionProps } from '@/types/rbac';
import { debouncedSearch } from '@/utils/rbac-utils'
import { router, useForm, usePage } from '@inertiajs/react';
import { Edit, Key, LoaderCircle, MoreHorizontal, Plus, Search, Trash } from 'lucide-react';
import { useState } from 'react';

interface PageProps {
    permissions: PaginatedData<PermissionProps>;
    [key: string]: unknown;
}

export default function PermissionManagement({ permissions }: PageProps) {
    const { filters } = usePage<{
        filters: { search?: string };
    }>().props;

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const [currentPermission, setCurrentPermission] = useState<PermissionProps | null>(null);
    const [isCustomCategory, setIsCustomCategory] = useState<boolean>(false);
    const [values, setValues] = useState({
        search: filters.search || '',
    });

    const categories = ['Admins', 'Users', 'Chatbot'];

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        put,
        delete: destroy,
    } = useForm<Required<PermissionForm>>({
        name: '',
        category: '',
        description: '',
    });

    const [selectedCategory, setSelectedCategory] = useState<string>(data.category);

    function submit(e: React.FormEvent) {
        e.preventDefault();

        if (isEditing && currentPermission) {
            put(route('permissions.update', { id: currentPermission.id }), {
                onFinish: function () {
                    reset();
                    setIsDialogOpen(false);
                },
            });
        } else {
            post(route('permissions.store'), {
                onFinish: function () {
                    reset();
                    setIsDialogOpen(false);
                },
            });
        }
    }

    function handleSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
        const newValue = e.target.value;

        setValues((values) => ({
            ...values,
            search: newValue,
        }));

        debouncedSearch(newValue, router);
    }

    function handleCreatePermission() {
        setIsEditing(false);
        setIsDialogOpen(true);

        setData({
            name: '',
            category: '',
            description: '',
        });
    }

    function handleEditPermission(permission: typeof currentPermission) {
        setIsEditing(true);
        setIsDialogOpen(true);

        setCurrentPermission(permission);
        if (permission) {
            const isCustom = !categories.includes(permission.category);
            setIsCustomCategory(isCustom);
            setSelectedCategory(isCustom ? 'custom' : permission.category);
            const actionName = permission.name.split('.').pop() || '';

            setData({
                name: actionName,
                category: permission.category,
                description: permission.description,
            });
        } else {
            setIsCustomCategory(false);
            setSelectedCategory('');
            setData({
                name: '',
                category: '',
                description: '',
            });
        }
    }

    function handleDeletePermission(permission: typeof currentPermission) {
        setCurrentPermission(permission);
        setIsDeleteDialogOpen(true);
    }

    function submitDestroy(permission: typeof currentPermission) {
        if (permission) {
            destroy(route('permissions.destroy', permission.id), {
                onFinish: function () {
                    setIsDeleteDialogOpen(false);
                },
            });
        }
    }

    return (
        <div className="relative space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-lg font-medium">Permissions</h2>

                <div className="flex w-full gap-2 sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                        <Input placeholder="Search permissions..." value={values.search} onChange={handleSearchInput} className="pl-8" />
                    </div>
                    <Button onClick={handleCreatePermission} className="flex items-center gap-2 whitespace-nowrap">
                        <Plus className="h-4 w-4" />
                        <span>Add Permission</span>
                    </Button>
                </div>
            </div>

            <div className="relative">
                {permissions.data.length === 0 ? (
                    <Alert>
                        <Key className="h-4 w-4" />
                        <AlertTitle>No permissions defined</AlertTitle>
                        <AlertDescription>Create your first permission to start building your access control system.</AlertDescription>
                    </Alert>
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {permissions.data.map((permission) => (
                                    <TableRow key={permission.id}>
                                        <TableCell className="font-medium">{permission.name}</TableCell>
                                        <TableCell>{permission.description}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize">
                                                {permission.category}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Open menu">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => handleEditPermission(permission)}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        <span>Edit</span>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        onClick={() => handleDeletePermission(permission)}
                                                        className="text-destructive flex items-center gap-2"
                                                    >
                                                        <Trash className="h-4 w-4" />
                                                        <span>Delete</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            {/* Create/Edit Permission Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <form onSubmit={submit}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{isEditing ? 'Edit Permission' : 'Create New Permission'}</DialogTitle>
                            <DialogDescription>
                                {isEditing ? 'Update permission details' : 'Define a new permission for your application'}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <div className="flex gap-2">
                                        <Select
                                            value={isCustomCategory ? 'custom' : selectedCategory}
                                            onValueChange={(value) => {
                                                if (value === 'custom') {
                                                    setIsCustomCategory(true);
                                                    setSelectedCategory(value);
                                                    setData('category', '');
                                                } else {
                                                    setIsCustomCategory(false);
                                                    setSelectedCategory(value);
                                                    setData('category', value);
                                                }
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat} value={cat}>
                                                        {cat}
                                                    </SelectItem>
                                                ))}
                                                <SelectItem value="custom">Custom category...</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {isCustomCategory && (
                                    <div>
                                        <Label htmlFor="customCategory">Custom Category</Label>
                                        <Input
                                            id="customCategory"
                                            value={data.category}
                                            onChange={(e) => setData('category', e.target.value)}
                                            placeholder="e.g., products, payments"
                                        />

                                        <InputError message={errors.category} />
                                    </div>
                                )}

                                <div>
                                    <Label htmlFor="action">Action</Label>
                                    <Input
                                        id="name"
                                        required
                                        autoFocus
                                        name="name"
                                        tabIndex={1}
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g., create, read, update, delete"
                                    />
                                    <p className="text-muted-foreground mt-1 text-sm">
                                        Permission name will be: {isCustomCategory ? data.category : selectedCategory}.{data.name}
                                    </p>

                                    <InputError message={errors.name} />
                                </div>

                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Describe what this permission allows"
                                    />

                                    <InputError message={errors.description} />
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>

                            <Button type="submit" disabled={processing} onClick={submit}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                {isEditing ? 'Update Permission' : 'Create Permission'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    {currentPermission ? (
                        <>
                            <DialogHeader>
                                <DialogTitle>Confirm Deletion</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete the permission "{currentPermission.name}"? This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button variant="destructive" disabled={processing} onClick={() => submitDestroy(currentPermission)}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Delete
                                </Button>
                            </DialogFooter>
                        </>
                    ) : (
                        <DialogHeader>
                            <DialogTitle>Permission Not Found</DialogTitle>
                            <DialogDescription>
                                The selected permission could not be found. It may have been deleted or you may not have access to it.
                            </DialogDescription>
                        </DialogHeader>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
