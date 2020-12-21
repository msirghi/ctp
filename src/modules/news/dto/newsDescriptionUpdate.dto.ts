import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class NewsDescriptionUpdateDTO {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(2)
  readonly description;
}
