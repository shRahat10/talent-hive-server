import { Controller, Post, Get, Patch, Delete, Param, Body, HttpStatus, HttpCode, BadRequestException, Query } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification } from './notification.schema';

@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Get(':userId')
    async getUserNotifications(
        @Param('userId') userId: string,
        @Query('page') page: number,
        @Query('limit') limit: number
    ): Promise<{ notifications: Notification[], page: number }> {
        return this.notificationService.getNotificationsForUser(userId, page, limit);
    }

    @Get(':userId/unread-count')
    async getUnreadNotificationCount(@Param('userId') userId: string): Promise<{ count: number }> {
        const count = await this.notificationService.getUnreadCountForUser(userId);
        return { count };
    }

    @Post()
    async create(
        @Body() data: { type: string; recipient: string; sender: string; postId?: string; jobId?: string }
    ): Promise<Notification> {
        if (!data.type || !data.recipient || !data.sender) {
            throw new BadRequestException('Missing required fields');
        }
        return this.notificationService.createNotification(data);
    }

    @Patch(':id/read')
    async markAsRead(@Param('id') id: string): Promise<Notification> {
        return this.notificationService.markAsRead(id);
    }

    @Patch(':userId/mark-all-read')
    async markAllNotificationsAsRead(@Param('userId') userId: string): Promise<Notification[]> {
        return this.notificationService.markAllAsRead(userId);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteNotification(@Param('id') id: string): Promise<void> {
        await this.notificationService.deleteNotification(id);
    }
}
