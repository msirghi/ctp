import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class NotificationCreationDTO {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(2)
  readonly message: string;
}
