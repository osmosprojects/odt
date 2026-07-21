import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  private notifications = [
    {
      id: 1,
      userId: 101,
      title: 'Offer Approved',
      message: 'WBC Offer OFF-WBC-2026-002 has been fully approved by Finance.',
      notificationType: 'SUCCESS',
      isRead: 'N',
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      userId: 101,
      title: 'Approval Required',
      message: 'WBC Offer OFF-WBC-2026-001 is awaiting your RTM approval.',
      notificationType: 'WARNING',
      isRead: 'N',
      createdAt: new Date().toISOString(),
    },
  ];

  getUserNotifications(userId: number) {
    return this.notifications;
  }

  markAsRead(id: number) {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.isRead = 'Y';
    }
    return { message: 'Notification marked as read' };
  }
}
