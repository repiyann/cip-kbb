export interface PermissionProps {
    id: number;
    name: string;
    description: string;
    category: string;
}

export interface RoleProps {
    id: number;
    name: string;
    description: string;
    permissions: PermissionProps[];
}

export interface PermissionForm {
    name: string;
    description: string;
    category: string;
}

export interface RoleForm {
    name: string;
    description: string;
}
