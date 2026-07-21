export declare class NotificationsService {
    private notifications;
    getUserNotifications(userId: number): {
        id: number;
        userId: number;
        title: string;
        message: string;
        notificationType: string;
        isRead: string;
        createdAt: string;
    }[];
    markAsRead(id: number): {
        message: string;
    };
}
