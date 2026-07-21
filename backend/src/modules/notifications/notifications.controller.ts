import { Controller, Get, Post, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Notifications & Inbox')
@Controller('api/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({ summary: 'Get active in-app notifications for user' })
  @Get('inbox')
  getUserNotifications() {
    return this.notificationsService.getUserNotifications(101);
  }

  @ApiOperation({ summary: 'Mark notification as read' })
  @Post(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(Number(id));
  }
}
