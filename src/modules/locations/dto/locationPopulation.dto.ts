import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Min } from 'class-validator';

export class LocationPopulationDTO {
  @ApiProperty()
  @IsNotEmpty()
  @Min(0)
  readonly population: number;
}
