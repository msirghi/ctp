import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, UseGuards, Request } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RequestPayload } from 'src/common/types';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserCreationDTO } from './dto/userCreation.dto';
import { UserPasswordUpdateDTO } from './dto/userPasswordUpdate.dto';
import { UserFirstNameUpdateDTO } from './dto/userFirstNameUpdate.dto';
import { UserLastNameUpdateDTO } from './dto/userLastNameUpdate.dto';
import { UserDocument } from './schema/users.schema';
import { UsersService } from './users.service';
import SwaggerConstants from '../../constants/swagger.constants';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @ApiOkResponse({ description: SwaggerConstants.REGISTER })
  @ApiBadRequestResponse({ description: SwaggerConstants.REGISTER_BAD_REQUEST })
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() userDTO: UserCreationDTO) {
    return this.userService.createUser(userDTO);
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOkResponse({ description: SwaggerConstants.GET_LOGGED_IN_INFO })
  async getLoggedUserInfo(@Request() { userId }: RequestPayload): Promise<UserDocument> {
    return this.userService.getLoggedUserInfo(userId);
  }

  @Patch('/firstName')
  @UseGuards(AuthGuard)
  @ApiOkResponse({ description: SwaggerConstants.UPDATE_FIRST_NAME })
  @ApiBadRequestResponse({ description: SwaggerConstants.INVALID_NAME })
  async updateFirstName(
    @Request() { userId }: RequestPayload,
    @Body() userDTO: UserFirstNameUpdateDTO
  ): Promise<UserFirstNameUpdateDTO> {
    return this.userService.updateFirstName(userId, userDTO);
  }

  @Patch('/lastName')
  @ApiOkResponse({ description: SwaggerConstants.UPDATE_LAST_NAME })
  @ApiBadRequestResponse({ description: SwaggerConstants.INVALID_NAME })
  @UseGuards(AuthGuard)
  async updateLastName(@Request() { userId }: RequestPayload, @Body() userDTO: UserLastNameUpdateDTO) {
    return this.userService.updateLastName(userId, userDTO);
  }

  @Patch('/pwd')
  @ApiOkResponse({ description: SwaggerConstants.UPDATE_PASSWORD })
  @ApiBadRequestResponse({ description: SwaggerConstants.INVALID_DATA })
  @UseGuards(AuthGuard)
  async updateUserPassword(@Request() { userId }: RequestPayload, @Body() userDTO: UserPasswordUpdateDTO) {
    return this.userService.updateUserPassword(userId, userDTO);
  }
}
