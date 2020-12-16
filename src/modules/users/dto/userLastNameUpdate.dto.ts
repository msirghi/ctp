import { IsNotEmpty } from 'class-validator';

export class UserLastNameUpdateDTO {
  @IsNotEmpty()
  readonly lastName: string;
}
