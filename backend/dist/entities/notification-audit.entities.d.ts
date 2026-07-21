export declare class InAppNotification {
    id: number;
    userId: number;
    title: string;
    message: string;
    notificationType: string;
    isRead: string;
    createdAt: Date;
}
export declare class AuditLog {
    auditId: number;
    actionType: string;
    entityType: string;
    entityId: string;
    actorCode: string;
    actorEmail: string;
    ipAddress: string;
    remarks: string;
    createdAt: Date;
}
