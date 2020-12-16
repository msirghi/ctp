import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger';
import { ROLES } from 'src/common/enums';
import SwaggerConstants from 'src/constants/swagger.constants';
import { HasRoles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { LocationDTO } from './dto/location.dto';
import { LocationNameDTO } from './dto/locationName.dto';
import { LocationPopulationDTO } from './dto/locationPopulation.dto';
import { LocationService } from './locations.service';
import { LocationDocument } from './schema/location.schema';

@Controller('countries/:countryId/locations')
@ApiTags('Locations')
export class LocationsContoller {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @HasRoles(ROLES.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiCreatedResponse({ description: SwaggerConstants.LOCATION_CREATED })
  @ApiForbiddenResponse({ description: SwaggerConstants.FORBIDDEN })
  @ApiNotFoundResponse({ description: SwaggerConstants.COUNTRY_NOT_FOUND })
  @ApiBadRequestResponse({ description: SwaggerConstants.INVALID_DATA })
  async createLocation(
    @Param('countryId') countryId: string,
    @Body() location: LocationDTO
  ): Promise<LocationDocument> {
    return this.locationService.createLocation(countryId, location);
  }

  @Get()
  @ApiOkResponse({ description: SwaggerConstants.LOCATIONS_BY_COUNTRY })
  @ApiNotFoundResponse({ description: SwaggerConstants.COUNTRY_NOT_FOUND })
  async getLocationsByCountry(@Param('countryId') countryId: string) {
    return this.locationService.getLocationsByCountry(countryId);
  }

  @Get(':locationId')
  @ApiOkResponse({ description: SwaggerConstants.GET_LOCATION_BY_ID })
  @ApiNotFoundResponse({ description: SwaggerConstants.COUNTRY_NOT_FOUND })
  async getLocationByCountryAndId(@Param('countryId') countryId: string, @Param('locationId') locationId: string) {
    return this.locationService.getLocationByCountryAndId(countryId, locationId);
  }

  @Get('/id/:locationId')
  @ApiOkResponse({ description: SwaggerConstants.GET_LOCATION_BY_ID_ONLY })
  @ApiNotFoundResponse({ description: SwaggerConstants.COUNTRY_NOT_FOUND })
  async getLocationById(@Param('locationId') locationId: string) {
    return this.locationService.getLocationById(locationId);
  }

  @Delete(':locationId')
  @HasRoles(ROLES.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: SwaggerConstants.LOCATION_DELETE })
  async removeLocationById(@Param(':locationId') locationId: string) {
    return this.locationService.removeLocation(locationId);
  }

  @Put(':locationId')
  @HasRoles(ROLES.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOkResponse({ description: SwaggerConstants.LOCATION_UPDATE })
  @ApiNotFoundResponse({ description: SwaggerConstants.LOCATION_NOT_FOUND })
  @ApiBadRequestResponse({ description: SwaggerConstants.INVALID_DATA })
  async updateLocation(
    @Param('countryId') countryId: string,
    @Param('locationId') locationId: string,
    @Body() location: LocationDTO
  ) {
    return this.locationService.updateLocation(countryId, locationId, location);
  }

  @Patch(':locationId/name')
  @HasRoles(ROLES.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOkResponse({ description: SwaggerConstants.LOCATION_UPDATE_NAME })
  @ApiNotFoundResponse({ description: SwaggerConstants.LOCATION_NOT_FOUND })
  @ApiBadRequestResponse({ description: SwaggerConstants.INVALID_DATA })
  async updateLocationName(
    @Param('countryId') countryId: string,
    @Param('locationId') locationId: string,
    @Body() location: LocationNameDTO
  ) {
    return this.locationService.updateLocationName(countryId, locationId, location);
  }

  @Patch(':locationId/population')
  @HasRoles(ROLES.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOkResponse({ description: SwaggerConstants.LOCATION_UPDATE_POPULATION })
  @ApiNotFoundResponse({ description: SwaggerConstants.LOCATION_NOT_FOUND })
  @ApiBadRequestResponse({ description: SwaggerConstants.INVALID_DATA })
  async updateLocationPopulation(
    @Param('countryId') countryId: string,
    @Param('locationId') locationId: string,
    @Body() location: LocationPopulationDTO
  ) {
    return this.locationService.updateLocationPopulation(countryId, locationId, location);
  }
}
