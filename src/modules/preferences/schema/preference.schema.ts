import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { INTERFACE_TYPE } from 'src/common/enums';

export type PreferenceDocument = Preference & Document;

@Schema()
export class Preference {
  @Prop({ required: true, default: new Date() })
  createdAt: Date;

  @Prop({ required: false, default: INTERFACE_TYPE.LIGHT })
  interfaceType: INTERFACE_TYPE;

  @Prop({ required: false, default: 'en', lowercase: true })
  language: string;

  @Prop({ required: true })
  userId: string;
}

export const PreferenceSchema = SchemaFactory.createForClass(Preference);
