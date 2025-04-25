import InputError from '@/components/atoms/input-error';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { PaginatedData } from '@/types';
import { PermissionProps, RoleForm, RoleProps } from '@/types/rbac';
import { debouncedSearch } from '@/utils/rbac-utils'
import { router, useForm, usePage } from '@inertiajs/react';
import { Check, Edit, Eye, LoaderCircle, MoreHorizontal, Plus, Search, Shield, Trash } from 'lucide-react';
import { useState } from 'react';

interface PageProps {
    roles: PaginatedData<RoleProps>;
    permissions: PermissionProps[];
    [key: string]: unknown;
}

export default function RoleManagement({ roles, permissions }: PageProps) {
    const { filters } = usePage<{
        filters: { search?: string };
    }>().props;

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState<boolean>(false);
    const [currentRole, setCurrentRole] = useState<RoleProps | null>(null);
    const [values, setValues] = useState({
        search: filters.search || '',
    });

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        put,
        delete: destroy,
    } = useForm<Required<RoleForm>>({
        name: '',
        description: '',
        permissions: [],
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        if (isEditing && currentRole) {
            put(route('roles.update', { id: currentRole.id }), {
                onFinish: function () {
                    reset();
                    setIsDialogOpen(false);
                },
            });
        } else {
            post(route('roles.store'), {
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

    function handleCreateRole() {
        setIsEditing(false);
        setIsDialogOpen(true);
        setData({
            name: '',
            description: '',
            permissions: [],
        });
    }

    function handleEditRole(role: typeof currentRole) {
        setIsEditing(true);
        setCurrentRole(role);
        setIsDialogOpen(true);

        if (role) {
            setData({
                name: role.name,
                description: role.description,
                permissions: role.permissions.map((p) => p.id),
            });
        } else {
            setData({
                name: '',
                description: '',
                permissions: [],
            });
        }
    }

    function handleDeleteRole(role: typeof currentRole) {
        setCurrentRole(role);
        setIsDeleteDialogOpen(true);
    }

    function handleViewRoleDetails(role: typeof currentRole) {
        setCurrentRole(role);
        setIsDetailsDialogOpen(true);
    }

    function submitDestroy(role: typeof currentRole) {
        if (role) {
            destroy(route('roles.destroy', role.id), {
                onFinish: function () {
                    setIsDeleteDialogOpen(false);
                },
            });
        }
    }

    function togglePermission(permission: PermissionProps) {
        const exists = data.permissions.includes(permission.id);
        if (exists) {
            setData(
                'permissions',
                data.permissions.filter((id) => id !== permission.id),
            );
        } else {
            setData('permissions', [...data.permissions, permission.id]);
        }
    }

    // Group permissions by category (based on naming convention)
    const groupedPermissions = permissions.reduce(
        (groups, permission) => {
            const category = permission.category.split('.')[0];
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(permission);
            return groups;
        },
        {} as Record<string, typeof permissions>,
    );

    return (
        <div className="relative space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Roles</h2>

                <div className="flex w-full gap-2 sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                        <Input placeholder="Search roles..." value={values.search} onChange={handleSearchInput} className="pl-8" />
                    </div>
                    <Button onClick={handleCreateRole} className="flex items-center gap-2 whitespace-nowrap">
                        <Plus className="h-4 w-4" />
                        <span>Add Role</span>
                    </Button>
                </div>
            </div>

            <div className="relative">
                {roles.data.length === 0 ? (
                    <Alert>
                        <Shield className="h-4 w-4" />
                        <AlertTitle>No roles defined</AlertTitle>
                        <AlertDescription>Create your first role to start setting up access control.</AlertDescription>
                    </Alert>
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Permissions</TableHead>
                                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {roles.data.map((role) => (
                                    <TableRow key={role.id}>
                                        <TableCell className="font-medium">{role.name}</TableCell>
                                        <TableCell>{role.description}</TableCell>

                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {role.permissions.length > 3 ? (
                                                    <>
                                                        <Badge variant="outline" className="rounded-sm">
                                                            {role.permissions.length} permissions
                                                        </Badge>
                                                    </>
                                                ) : (
                                                    role.permissions.map((permission) => {
                                                        const permObj = permissions.find((p: PermissionProps) => p.id === permission.id);

                                                        return (
                                                            <Badge key={permission.id} variant="outline" className="rounded-sm">
                                                                {permObj?.name || permission.name}
                                                            </Badge>
                                                        );
                                                    })
                                                )}
                                            </div>
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Open menu">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleViewRoleDetails(role)} className="flex items-center gap-2">
                                                        <Eye className="h-4 w-4" />
                                                        <span>View Details</span>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem onClick={() => handleEditRole(role)} className="flex items-center gap-2">
                                                        <Edit className="h-4 w-4" />
                                                        <span>Edit</span>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        onClick={() => handleDeleteRole(role)}
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

            {/* Create/Edit Role Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <form onSubmit={submit}>
                    <DialogContent className="sm:max-w-[700px]">
                        <DialogHeader>
                            <DialogTitle>{isEditing ? 'Edit Role' : 'Create New Role'}</DialogTitle>
                            <DialogDescription>
                                {isEditing ? 'Update role details and permissions' : 'Configure a new role and its permissions'}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <Label htmlFor="name">Role Name</Label>
                                    <Input
                                        id="name"
                                        required
                                        autoFocus
                                        name="name"
                                        tabIndex={1}
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g., Admin, Editor, Viewer"
                                    />

                                    <InputError message={errors.name} />
                                </div>

                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Describe what this role is for"
                                    />

                                    <InputError message={errors.description} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label>Permissions</Label>

                                <ScrollArea className="h-[400px] rounded-md border">
                                    <div className="space-y-6 p-4">
                                        {Object.entries(groupedPermissions).map(([category, permissions]) => (
                                            <Card key={category}>
                                                <CardHeader className="py-3">
                                                    <CardTitle className="text-base capitalize">{category}</CardTitle>
                                                </CardHeader>

                                                <CardContent className="py-2">
                                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                        {permissions.map((permission) => (
                                                            <div key={permission.id} className="flex items-start space-x-2">
                                                                <Checkbox
                                                                    id={`permission-${permission.id}`}
                                                                    checked={data.permissions.includes(permission.id)}
                                                                    onCheckedChange={() => togglePermission(permission)}
                                                                />

                                                                <div className="grid gap-1.5 leading-none">
                                                                    <Label htmlFor={`permission-${permission.id}`} className="text-sm font-medium">
                                                                        {permission.name}
                                                                    </Label>
                                                                    <p className="text-muted-foreground text-xs">{permission.description}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>

                            <Button type="submit" onClick={submit} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                {isEditing ? 'Update Role' : 'Create Role'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the role "{currentRole?.name}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>

                        <Button variant="destructive" disabled={processing} onClick={() => submitDestroy(currentRole)}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Role Details Dialog */}
            <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle>Role Details: {currentRole?.name}</DialogTitle>
                        <DialogDescription>{currentRole?.description}</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <h3 className="mb-2 text-sm font-medium">Assigned Permissions</h3>
                        {!currentRole || currentRole.permissions.length === 0 ? (
                            <p className="text-muted-foreground text-sm">This role has no permissions assigned.</p>
                        ) : (
                            <ScrollArea className="h-[400px] rounded-md border">
                                <div className="space-y-6 p-4">
                                    {Object.entries(
                                        currentRole.permissions.reduce(
                                            (groupedPermissions, permission) => {
                                                const category = permission.category.split('.')[0];
                                                if (!groupedPermissions[category]) {
                                                    groupedPermissions[category] = [];
                                                }
                                                groupedPermissions[category].push(permission);
                                                return groupedPermissions;
                                            },
                                            {} as Record<string, typeof permissions>,
                                        ),
                                    ).map(([category, permissions]) => (
                                        <Card key={category}>
                                            <CardHeader className="py-3">
                                                <CardTitle className="text-base capitalize">{category}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="py-2">
                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    {permissions.map((permission) => (
                                                        <div key={permission.id} className="flex items-start space-x-2">
                                                            <Check className="text-primary mt-0.5 h-4 w-4" />
                                                            <div className="grid gap-1 leading-none">
                                                                <span className="text-sm font-medium">{permission.name}</span>
                                                                <p className="text-muted-foreground text-xs">{permission.description}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
