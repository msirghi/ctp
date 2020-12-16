import { Body, Controller, Post, Response } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';
import { Response as Res } from 'express';
import SwaggerConstants from 'src/constants/swagger.constants';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiOkResponse({ description: SwaggerConstants.LOGIN })
  @ApiBadRequestResponse({ description: SwaggerConstants.INVALID_CREDENTIALS })
  async login(@Body() credentials: AuthDTO, @Response() res: Res) {
    const response = await this.authService.login(credentials, res);
    res.send(response);
  }
}
