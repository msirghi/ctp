import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import ErrorConstants from 'src/constants/error.constants';
import { Notification, NotificationDocument } from './schema/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(@InjectModel(Notification.name) private readonly notificationModel: Model<NotificationDocument>) {}

  async createNotification(userId: string, message: string) {
    const notification = new this.notificationModel();
    notification.userId = userId;
    notification.message = message;
    return notification.save();
  }

  async getNotificationById(notificationId: string) {
    const notification = await this.notificationModel.findOne({ _id: notificationId });

    if (!notification) {
      throw new HttpException(ErrorConstants.NOTIFICATION_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return notification;
  }

  async markNotificationAsRead(userId: string, notificationId: string) {
    return this.notificationModel.findOneAndUpdate({ _id: notificationId, userId }, { read: true }, (err) => {
      if (err) {
        throw new HttpException(ErrorConstants.NOTIFICATION_NOT_FOUND, HttpStatus.NOT_FOUND);
      }
    });
  }

  async markNotificationAsUnread(userId: string, notificationId: string) {
    return this.notificationModel.findOneAndUpdate({ _id: notificationId, userId }, { read: false }, (err) => {
      if (err) {
        throw new HttpException(ErrorConstants.NOTIFICATION_NOT_FOUND, HttpStatus.NOT_FOUND);
      }
    });
  }

  async getUserNotifications(userId: string) {
    return this.notificationModel.find({ userId });
  }

  async updateNotificationMessage(notificationId: string, message: string) {
    return this.notificationModel.findOneAndUpdate({ _id: notificationId }, { message }, (err) => {
      if (err) {
        throw new HttpException(ErrorConstants.NOTIFICATION_NOT_FOUND, HttpStatus.NOT_FOUND);
      }
    });
  }

  async removeNotification(notificationId: string) {
    return this.notificationModel.remove({ _id: notificationId });
  }
}
