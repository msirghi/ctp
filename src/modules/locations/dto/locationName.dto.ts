import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class LocationNameDTO {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  readonly name: string;
}
