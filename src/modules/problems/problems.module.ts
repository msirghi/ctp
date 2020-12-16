import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CountriesModule } from '../countries/countries.module';
import { LocationsModule } from '../locations/locations.module';
import { ProblemsController } from './problems.controller';
import { ProblemsService } from './problems.service';
import { Problem, ProblemSchema } from './schema/problems.schema';

@Module({
  controllers: [ProblemsController],
  providers: [ProblemsService],
  imports: [
    MongooseModule.forFeature([{ name: Problem.name, schema: ProblemSchema }]),
    LocationsModule,
    CountriesModule
  ]
})
export class ProblemsModule {}
