import { IsNotEmpty } from 'class-validator';

export class UserPasswordUpdateDTO {
  @IsNotEmpty()
  readonly password: string;
}
