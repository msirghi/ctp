import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProblemDocument = Problem & Document;

@Schema()
export class Problem {
  @Prop({ required: true, minlength: 3 })
  name: string;

  @Prop({ required: false, minlength: 10 })
  description: string;

  @Prop({ required: true, minlength: 5 })
  locationId: string;

  @Prop({ required: true })
  createatAt: Date;

  @Prop({ required: false })
  address: string;

  @Prop({ required: true, default: 0 })
  raiting: number;

  @Prop({ required: true, default: 0 })
  views: number;

  @Prop({ required: false })
  creator: string;
}

export const ProblemSchema = SchemaFactory.createForClass(Problem);
