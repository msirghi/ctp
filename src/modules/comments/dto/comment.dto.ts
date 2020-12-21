import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CommentCreationDTO {
  @ApiProperty()
  @IsNotEmpty()
  readonly message: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly createdAt: Date;

  @ApiProperty()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly userId: Date;

  @ApiProperty()
  @IsNotEmpty()
  readonly itemId: Date;
}
