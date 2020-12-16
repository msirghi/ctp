import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';
import { INTERFACE_TYPE } from 'src/common/enums';

export class InterfaceTypeDTO {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(2)
  readonly type: INTERFACE_TYPE;
}
