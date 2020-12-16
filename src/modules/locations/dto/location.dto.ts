import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class LocationDTO {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  readonly name: string;

  @ApiProperty()
  countryId?: string;

  @ApiProperty()
  readonly population?: number;
}
