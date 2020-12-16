import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { InterfaceTypeDTO } from './dto/interfaceType.dto';
import { LanguageDTO } from './dto/language.dto';
import { PreferenceDTO } from './dto/preference.dto';
import { PreferenceService } from './preference.service';
import { PreferenceDocument } from './schema/preference.schema';
import SwaggerConstants from '../../constants/swagger.constants';

@Controller('preferences')
@ApiTags('Preference')
export class PreferenceController {
  constructor(private readonly preferenceService: PreferenceService) {}

  @Post()
  @ApiCreatedResponse({ description: SwaggerConstants.PREFERENCE_INIT })
  @ApiBadRequestResponse({ description: SwaggerConstants.PREFERENCE_NOT_INIT })
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async initializePreferences(@Request() req, @Body() dto: PreferenceDTO): Promise<PreferenceDocument> {
    return this.preferenceService.initializePreferences(req.userId, dto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBadRequestResponse({ description: SwaggerConstants.PREFERENCE_NOT_INIT })
  async getUserPreferences(@Request() req): Promise<PreferenceDocument> {
    return this.preferenceService.getUserPreferences(req.userId);
  }

  @Patch('/language')
  @UseGuards(AuthGuard)
  @ApiOkResponse({ description: SwaggerConstants.INTERFACE_LANGUAGE_UPDATE })
  @ApiBadRequestResponse({ description: SwaggerConstants.PREFERENCE_NOT_INIT })
  async updateLanguage(@Request() req, @Body() dto: LanguageDTO) {
    return this.preferenceService.updateLanguage(req.userId, dto);
  }

  @Patch('/interface')
  @UseGuards(AuthGuard)
  @ApiOkResponse({ description: SwaggerConstants.INTERFACE_UPDATE })
  @ApiBadRequestResponse({ description: SwaggerConstants.PREFERENCE_NOT_INIT })
  async updateInterfaceType(@Request() req, @Body() dto: InterfaceTypeDTO) {
    return this.preferenceService.updateInterfaceMode(req.userId, dto);
  }
}
