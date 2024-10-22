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
      .find({ recipient: userId })
      .sort({ updatedAt: -1, _id: -1 })
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
    return notification.save();
  }

  async deleteNotification(notificationId: string): Promise<void> {
    const result = await this.notificationModel.findByIdAndDelete(notificationId);
    if (!result) {
      throw new NotFoundException('Notification not found');
    }
  }
}
