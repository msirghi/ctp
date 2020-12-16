import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PreferenceController } from './preference.controller';
import { PreferenceService } from './preference.service';
import { Preference, PreferenceSchema } from './schema/preference.schema';

@Module({
  controllers: [PreferenceController],
  providers: [PreferenceService],
  imports: [MongooseModule.forFeature([{ name: Preference.name, schema: PreferenceSchema }])]
})
export class PreferenceModule {}
