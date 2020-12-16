import { ApiProperty } from '@nestjs/swagger';

export class CountryDTO {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly createdAt: Date;
}
