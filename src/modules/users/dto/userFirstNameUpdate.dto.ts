import { IsNotEmpty } from 'class-validator';

export class UserFirstNameUpdateDTO {
  @IsNotEmpty()
  readonly firstName: string;
}
