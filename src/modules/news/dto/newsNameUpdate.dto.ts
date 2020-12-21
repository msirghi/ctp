import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class NewsNameUpdateDTO {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(2)
  readonly name;
}
