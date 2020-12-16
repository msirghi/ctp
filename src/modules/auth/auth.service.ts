import { HttpException, HttpStatus, Injectable, Scope } from '@nestjs/common';
import { AuthDTO } from './dto/auth.dto';
import { compare } from 'bcryptjs';
import ErrorConstants from 'src/constants/error.constants';
import TokenService from '../../services/TokenService';
import { Response as Res } from 'express';
import { UsersService } from 'src/modules/users/users.service';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async login(credentials: AuthDTO, res: Res) {
    const { email, password } = credentials;

    const user = await this.userService.getByEmail(email);

    // TODO: Check if account is activated

    const valid = await compare(password, user.password);
    if (!valid) {
      throw new HttpException(ErrorConstants.BAD_CREDENTIALS, HttpStatus.BAD_REQUEST);
    }
    TokenService.sendRefreshToken(res, TokenService.createRefreshToken(user));
    return {
      accessToken: TokenService.createAccessToken(user)
    };
  }
}
