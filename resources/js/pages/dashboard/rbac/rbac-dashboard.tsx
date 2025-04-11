import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { PermissionProps, RoleProps } from '@/types/rbac';
import { Head, usePage } from '@inertiajs/react';
import { Key, Shield, Users } from 'lucide-react';
import { useState } from 'react';
import PermissionManagement from './permission-management';
import RoleManagement from './role-management';
import UserRoleAssignment from './user-role-assignment';

interface PageProps {
    roles: RoleProps[];
    permissions: PermissionProps[];
    [key: string]: unknown;
}

export default function RbacDashboard() {
    const { roles, permissions } = usePage<PageProps>().props;
    const [activeTab, setActiveTab] = useState<string>('permissions');
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'RBAC Management',
            href: '/permissions',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chatbot" />
            <main className="container mx-auto px-4 py-6 md:px-6">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">RBAC Management Dashboard</h1>
                        <p className="text-muted-foreground">Manage roles, permissions, and user assignments in your application.</p>
                    </div>

                    <Tabs defaultValue="permissions" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                        <TabsList className="grid h-auto max-w-2xl grid-cols-3 gap-4 md:inline-grid md:w-auto md:grid-cols-3">
                            <TabsTrigger value="permissions" className="data-[state=active]:border-primary flex items-center gap-2">
                                <Key className="h-4 w-4" />
                                <span className="hidden md:inline">Permissions</span>
                            </TabsTrigger>

                            <TabsTrigger value="roles" className="data-[state=active]:border-primary flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                <span className="hidden md:inline">Roles</span>
                            </TabsTrigger>

                            <TabsTrigger value="users" className="data-[state=active]:border-primary flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span className="hidden md:inline">User Assignment</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="permissions" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Permission Management</CardTitle>
                                    <CardDescription>Create and manage permissions that can be assigned to roles.</CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <PermissionManagement permissions={permissions} />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="roles" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Role Management</CardTitle>
                                    <CardDescription>Create, edit, and delete roles for your application.</CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <RoleManagement roles={roles} permissions={permissions} />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="users" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>User Role Assignment</CardTitle>
                                    <CardDescription>Assign roles to users in your application.</CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <UserRoleAssignment />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </AppLayout>
    );
}
