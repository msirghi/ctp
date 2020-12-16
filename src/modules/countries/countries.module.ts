import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { CountriesController } from './countries.controller';
import { CountryService } from './countries.service';
import { Country, CountrySchema } from './schemas/country.schema';

@Module({
  providers: [CountryService],
  controllers: [CountriesController],
  imports: [MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }]), UsersModule],
  exports: [CountryService]
})
export class CountriesModule {}
