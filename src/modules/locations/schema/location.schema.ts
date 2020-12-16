import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LocationDocument = Location & Document;

@Schema()
export class Location {
  @Prop({ required: true, minlength: 3 })
  name: string;

  @Prop({ required: true, minlength: 5 })
  countryId: string;

  @Prop({ required: false, min: 0 })
  population: number;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
