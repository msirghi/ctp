import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CountriesModule } from '../countries/countries.module';
import { LocationsContoller } from './locations.controller';
import { LocationService } from './locations.service';
import { LocationSchema, Location } from './schema/location.schema';

@Module({
  providers: [LocationService],
  controllers: [LocationsContoller],
  imports: [MongooseModule.forFeature([{ name: Location.name, schema: LocationSchema }]), CountriesModule],
  exports: [LocationService]
})
export class LocationsModule {}
