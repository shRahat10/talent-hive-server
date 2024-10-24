import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './notification.schema';

interface CreateNotificationDto {
  type: string;
  recipient: string;
  sender: string;
  postId?: string;
  jobId?: string;
}

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
  ) { }

  async createNotification(data: CreateNotificationDto): Promise<Notification> {
    if (!data.type || !data.recipient || !data.sender) {
      throw new BadRequestException('Missing required fields');
    }

    const newNotification = new this.notificationModel(data);
    return newNotification.save();
  }

  async getNotificationsForUser(userId: string, page: number, limit: number): Promise<{ notifications: Notification[], page: number }> {
    const skip = page * limit;

    const notifications = await this.notificationModel
      .find({ recipient: userId, sender: { $ne: userId } })
      .sort({ createdAt: -1 })
      .populate({ path: 'recipient', select: 'fullName profileImage' })
      .populate({ path: 'sender', select: 'fullName profileImage' })
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      notifications,
      page: +page + 1
    }
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    const notification = await this.notificationModel.findById(notificationId);

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.isRead = true;

    await notification.save();

    return this.notificationModel
      .findById(notificationId)
      .populate({ path: 'recipient', select: 'fullName profileImage' })
      .populate({ path: 'sender', select: 'fullName profileImage' })
      .exec();
  }

  async markAllAsRead(userId: string): Promise<Notification[]> {
    const unreadNotifications = await this.notificationModel
      .find({ recipient: userId, isRead: false })
      .populate({ path: 'recipient', select: 'fullName profileImage' })
      .populate({ path: 'sender', select: 'fullName profileImage' })
      .exec();

    const updatedNotifications = await Promise.all(
      unreadNotifications.map(async (notification) => {
        notification.isRead = true;
        await notification.save();
        return notification;
      })
    );

    return updatedNotifications;
  }

  async deleteNotification(notificationId: string): Promise<void> {
    const result = await this.notificationModel.findByIdAndDelete(notificationId);
    if (!result) {
      throw new NotFoundException('Notification not found');
    }
  }
}
