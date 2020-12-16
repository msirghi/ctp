import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class LanguageDTO {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(2)
  readonly language: string;
}
