export declare class Role {
    roleId: number;
    roleCode: string;
    roleName: string;
    roleType: string;
    stream: string;
    channel: string;
    appType: string;
    description: string;
    status: string;
    createdAt: Date;
}
export declare class Module {
    moduleId: number;
    moduleCode: string;
    moduleName: string;
    parentModule: number;
    appType: string;
    sortOrder: number;
    status: string;
}
export declare class Permission {
    permissionId: number;
    roleId: number;
    moduleId: number;
    empCode: string;
    canView: string;
    canAdd: string;
    canUpdate: string;
    canDelete: string;
    canApprove: string;
    status: string;
}
export declare class RoleUserMap {
    mapId: number;
    userId: number;
    roleId: number;
    status: string;
}
