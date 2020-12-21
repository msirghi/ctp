import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CommentCreationDTO {
  @ApiProperty()
  @IsNotEmpty()
  readonly message: string;
}
