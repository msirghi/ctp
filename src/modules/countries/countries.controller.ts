import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger';
import { CountryService } from './countries.service';
import { CountryDTO } from './dto/country.dto';
import { Country } from './schemas/country.schema';
import SwaggerConstants from '../../constants/swagger.constants';
import { HasRoles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { ROLES } from 'src/common/enums';

@Controller('countries')
@ApiTags('Countries')
export class CountriesController {
  constructor(private readonly countryService: CountryService) {
    this.countryService = countryService;
  }

  @Get(':id')
  @ApiOkResponse({
    description: SwaggerConstants.GET_COUNTRY_BY_ID,
    type: CountryDTO
  })
  @ApiNotFoundResponse({ description: SwaggerConstants.COUNTRY_NOT_FOUND })
  getCountryById(@Param('id') id): Promise<Country> {
    return this.countryService.getById(id);
  }

  @Get()
  @ApiOkResponse({
    description: SwaggerConstants.GET_COUNTRY_LIST,
    type: CountryDTO
  })
  getAllCountries() {
    return this.countryService.getAll();
  }

  @Post()
  @HasRoles(ROLES.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({
    description: SwaggerConstants.CREATE_COUNTRY,
    type: CountryDTO
  })
  @ApiBadRequestResponse({ description: SwaggerConstants.INVALID_DATA })
  createCountry(@Body() country: CountryDTO) {
    return this.countryService.createCountry(country);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: SwaggerConstants.REMOVE_COUNTRY
  })
  @HasRoles(ROLES.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  removeCountry(@Param('id') id: string) {
    return this.countryService.remove(id);
  }

  @Put(':id')
  @ApiOkResponse({
    description: SwaggerConstants.UPDATE_COUNTRY,
    type: CountryDTO
  })
  @ApiBadRequestResponse({
    description: SwaggerConstants.INVALID_DATA
  })
  @HasRoles(ROLES.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  updateCountry(@Param('id') id, @Body() country: CountryDTO) {
    return this.countryService.update(id, country);
  }
}
