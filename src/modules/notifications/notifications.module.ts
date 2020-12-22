import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { Notification, NotificationSchema } from './schema/notification.schema';

@Module({
  providers: [NotificationsService],
  controllers: [NotificationsController],
  imports: [MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }])]
})
export class NotificationsModule {}
