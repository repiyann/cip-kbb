import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PaginatedData, User } from '@/types';
import { RoleProps } from '@/types/rbac';
import { debouncedSearch } from '@/utils/rbac-utils';
import { router, usePage } from '@inertiajs/react';
import { MoreHorizontal, Search, UserCog, Users } from 'lucide-react';
import { useState } from 'react';

interface PageProps {
    users: PaginatedData<User>;
    roles: RoleProps[];
    [key: string]: unknown;
}

export default function UserRoleAssignment({ users, roles }: PageProps) {
    const { filters } = usePage<{
        filters: { search?: string };
    }>().props;

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [values, setValues] = useState({
        search: filters.search || '',
    });

    const selectedRoleIds = selectedUser?.roles.map((role) => role.id) || [];

    function handleSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
        const newValue = e.target.value;

        setValues((values) => ({
            ...values,
            search: newValue,
        }));

        debouncedSearch(newValue, router);
    }

    function handleManageRoles(user: User) {
        setSelectedUser(user);
        setIsDialogOpen(true);
    }

    function saveUserRoles(userId: number, roleIds: number[]) {
        router.put(
            route('users.update', userId),
            {
                roles: roleIds,
            },
            {
                onSuccess: () => setIsDialogOpen(false),
            },
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <h2 className="text-lg font-medium">User Role Assignment</h2>
                <div className="relative max-w-sm">
                    <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                    <Input placeholder="Search users..." value={values.search} onChange={handleSearchInput} className="pl-8" />
                </div>
            </div>

            {users.data.length === 0 ? (
                <Alert>
                    <Users className="h-4 w-4" />
                    <AlertTitle>No users found</AlertTitle>
                    <AlertDescription>There are no users in the system. Add users to assign roles.</AlertDescription>
                </Alert>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Roles</TableHead>
                                <TableHead className="w-[100px] text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                {/* <AvatarImage src={user.avatarUrl} alt={user.name} /> */}
                                                <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{user.name}</div>
                                                <div className="text-muted-foreground text-sm">{user.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles.length === 0 ? (
                                                <span className="text-muted-foreground text-sm">No roles assigned</span>
                                            ) : (
                                                user.roles.map((role) => (
                                                    <Badge key={role.id} variant="secondary" className="rounded-sm">
                                                        {role.name}
                                                    </Badge>
                                                ))
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
                                                <DropdownMenuItem onClick={() => handleManageRoles(user)} className="flex items-center gap-2">
                                                    <UserCog className="h-4 w-4" />
                                                    <span>Manage Roles</span>
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

            {/* Manage User Roles Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Manage User Roles</DialogTitle>
                        <DialogDescription>Assign or remove roles for {selectedUser?.name}</DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <ScrollArea className="h-[300px] rounded-md border p-4">
                            {roles.map((role) => {
                                const isChecked = selectedRoleIds.includes(role.id);

                                return (
                                    <div key={role.id} className="flex items-center justify-between py-2">
                                        <div>
                                            <div className="font-medium">{role.name}</div>
                                            <div className="text-muted-foreground text-sm">{role.description}</div>
                                        </div>
                                        <Button
                                            variant={isChecked ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => {
                                                if (!selectedUser) return;

                                                const newRoles = isChecked
                                                    ? selectedUser.roles.filter((r) => r.id !== role.id)
                                                    : [...selectedUser.roles, role];

                                                setSelectedUser({ ...selectedUser, roles: newRoles });

                                                // You can also auto-save here if desired:
                                                saveUserRoles(
                                                    selectedUser.id,
                                                    newRoles.map((r) => r.id),
                                                );
                                            }}
                                            className="gap-2"
                                        >
                                            {isChecked ? 'Assigned' : 'Assign'}
                                        </Button>
                                    </div>
                                );
                            })}
                        </ScrollArea>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
