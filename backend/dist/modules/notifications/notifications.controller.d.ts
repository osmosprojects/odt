import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getUserNotifications(): {
        id: number;
        userId: number;
        title: string;
        message: string;
        notificationType: string;
        isRead: string;
        createdAt: string;
    }[];
    markAsRead(id: string): {
        message: string;
    };
}
