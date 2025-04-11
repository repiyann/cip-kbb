'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, MoreHorizontal, UserCog, Users } from 'lucide-react';
import { useState } from 'react';

// Sample users data - in a real app, this would come from your API/database
const initialUsers = [
    {
        id: '1',
        name: 'Olivia Martin',
        email: 'olivia.martin@example.com',
        avatarUrl: '/placeholder.svg?height=40&width=40',
        roleIds: ['1'], // Admin
    },
    {
        id: '2',
        name: 'Jackson Lee',
        email: 'jackson.lee@example.com',
        avatarUrl: '/placeholder.svg?height=40&width=40',
        roleIds: ['2'], // Editor
    },
    {
        id: '3',
        name: 'Isabella Nguyen',
        email: 'isabella.nguyen@example.com',
        avatarUrl: '/placeholder.svg?height=40&width=40',
        roleIds: ['3'], // Viewer
    },
    {
        id: '4',
        name: 'William Kim',
        email: 'william.kim@example.com',
        avatarUrl: '/placeholder.svg?height=40&width=40',
        roleIds: ['2', '3'], // Editor and Viewer
    },
    {
        id: '5',
        name: 'Sofia Davis',
        email: 'sofia.davis@example.com',
        avatarUrl: '/placeholder.svg?height=40&width=40',
        roleIds: [], // No roles
    },
];

// Sample roles data - in a real app, this would come from your API/database
const roles = [
    {
        id: '1',
        name: 'Admin',
        description: 'Full access to all resources',
    },
    {
        id: '2',
        name: 'Editor',
        description: 'Can edit and publish content',
    },
    {
        id: '3',
        name: 'Viewer',
        description: 'Read-only access',
    },
];

export default function UserRoleAssignment() {
    const [users, setUsers] = useState(initialUsers);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleManageRoles = (userId: string) => {
        setSelectedUserId(userId);
        setIsDialogOpen(true);
    };

    const saveUserRoles = (userId: string, roleIds: string[]) => {
        setUsers(users.map((user) => (user.id === userId ? { ...user, roleIds } : user)));
        setIsDialogOpen(false);
        setSelectedUserId(null);
    };

    const selectedUser = users.find((user) => user.id === selectedUserId);

    const filteredUsers = users.filter(
        (user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <h2 className="text-lg font-medium">User Role Assignment</h2>
                <Input placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="max-w-sm" />
            </div>

            {users.length === 0 ? (
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
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={user.avatarUrl} alt={user.name} />
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
                                            {user.roleIds.length === 0 ? (
                                                <span className="text-muted-foreground text-sm">No roles assigned</span>
                                            ) : (
                                                user.roleIds.map((roleId) => {
                                                    const role = roles.find((r) => r.id === roleId);
                                                    return (
                                                        <Badge key={roleId} variant="secondary" className="rounded-sm">
                                                            {role?.name || 'Unknown Role'}
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
                                                <DropdownMenuItem onClick={() => handleManageRoles(user.id)} className="flex items-center gap-2">
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
                                const isChecked = selectedUser?.roleIds.includes(role.id) || false;
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

                                                const newRoleIds = isChecked
                                                    ? selectedUser.roleIds.filter((id) => id !== role.id)
                                                    : [...selectedUser.roleIds, role.id];

                                                saveUserRoles(selectedUser.id, newRoleIds);
                                            }}
                                            className="gap-2"
                                        >
                                            {isChecked && <Check className="h-4 w-4" />}
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
