import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class NewsCreationDTO {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(2)
  readonly name;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(2)
  readonly description;
}
