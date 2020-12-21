import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema()
export class Comment {
  @Prop({ required: true, minlength: 5 })
  userId: string;

  @Prop({ required: true, minlength: 3 })
  username: string;

  @Prop({ required: true, min: 0 })
  message: string;

  @Prop({ required: true })
  itemId: string;

  @Prop({ required: true, default: new Date() })
  createdAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
