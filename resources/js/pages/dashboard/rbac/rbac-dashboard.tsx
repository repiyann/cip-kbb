import LoadingSpinner from '@/components/atoms/loading-spinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData, User } from '@/types';
import { PermissionProps, RoleProps } from '@/types/rbac';
import { Head, router, usePage } from '@inertiajs/react';
import { pickBy } from 'lodash';
import { Key, Shield, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import PermissionManagement from './permission-management';
import RoleManagement from './role-management';
import UserRoleAssignment from './user-role-assignment';

interface PageProps {
    activeTab: string;
    roles: PaginatedData<RoleProps> | RoleProps[];
    permissions: PaginatedData<PermissionProps> | PermissionProps[];
    users: PaginatedData<User>;
    [key: string]: unknown;
}

export default function RbacDashboard() {
    const { activeTab: initialActiveTab, roles, permissions, users } = usePage<PageProps>().props;

    const [activeTab, setActiveTab] = useState<string>(initialActiveTab || 'permissions');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const currentActiveTab = urlParams.get('activeTab') || 'permissions';
        setActiveTab(currentActiveTab);
    }, []);

    function urlParamsToObject(urlParams: URLSearchParams): Record<string, string> {
        const obj: Record<string, string> = {};
        urlParams.forEach((value, key) => {
            obj[key] = value;
        });
        return obj;
    }

    function handleTabChange(tab: string) {
        setActiveTab(tab);

        const values = { activeTab: tab };
        const query = Object.keys(pickBy(values)).length ? pickBy(values) : new URLSearchParams(window.location.search);
        const queryObject = query instanceof URLSearchParams ? urlParamsToObject(query) : query;

        const routeName = route().current() ?? 'rbac.index';

        router.get(route(routeName), queryObject, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
            onStart: () => {
                setLoading(true);
            },
            onFinish: () => {
                setLoading(false);
            },
        });
    }

    return (
        <AppLayout>
            <Head title="RBAC" />

            <main className="container mx-auto px-4 py-6 md:px-6">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">RBAC Management Dashboard</h1>
                        <p className="text-muted-foreground">Manage roles, permissions, and user assignments in your application.</p>
                    </div>

                    <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
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
                                    {loading ? (
                                        <LoadingSpinner />
                                    ) : (
                                        <PermissionManagement permissions={permissions as PaginatedData<PermissionProps>} />
                                    )}
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
                                    {loading ? (
                                        <LoadingSpinner />
                                    ) : (
                                        <RoleManagement roles={roles as PaginatedData<RoleProps>} permissions={permissions as PermissionProps[]} />
                                    )}
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
                                    {loading ? <LoadingSpinner /> : <UserRoleAssignment users={users} roles={roles as RoleProps[]} />}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </AppLayout>
    );
}
