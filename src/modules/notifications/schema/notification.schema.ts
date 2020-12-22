import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
  @Prop({ required: true, default: false, minlength: 3 })
  read: boolean;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true, default: new Date() })
  createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
