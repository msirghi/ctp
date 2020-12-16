import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class PreferenceDTO {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(2)
  readonly interfaceType: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(2)
  readonly language: string;
}
