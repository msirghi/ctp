import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NewsDocument = News & Document;

@Schema()
export class News {
  @Prop({ required: true, minlength: 3 })
  name: string;

  @Prop({ required: true, minlength: 5 })
  description: string;

  @Prop({ required: true })
  creatorId: string;

  @Prop({ required: true })
  countryId: string;

  @Prop({ required: true, default: new Date() })
  createdAt: Date;
}

export const NewsSchema = SchemaFactory.createForClass(News);
