import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import ErrorConstants from 'src/constants/error.constants';
import PatternService from 'src/services/PatternService';
import { CountryService } from '../countries/countries.service';
import { LocationDTO } from './dto/location.dto';
import { LocationPopulationDTO } from './dto/locationPopulation.dto';
import { Location, LocationDocument } from './schema/location.schema';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(Location.name) private readonly locationModel: Model<LocationDocument>,
    @Inject('CountryService') private readonly countryService: CountryService
  ) {}

  async getLocationsByCountry(countryId: string): Promise<LocationDocument[]> {
    if (isValidObjectId(countryId)) {
      return this.locationModel.find({ countryId }).exec();
    }
    throw new HttpException(ErrorConstants.INVALID_DATA_SUPPLIED, HttpStatus.BAD_REQUEST);
  }

  async createLocation(countryId: string, location: LocationDTO): Promise<LocationDocument> {
    if (isValidObjectId(countryId)) {
      const { name } = location;
      if (!PatternService.constainsNumber(name)) {
        const country = await this.countryService.getById(countryId);
        if (!country) {
          throw new HttpException(ErrorConstants.COUNTRY_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }

        const existingLocations = await this.getLocationsByCountry(countryId);
        const isAlreadyPresent = existingLocations.find(
          (location) => location.name.toLowerCase() === name.toLowerCase()
        );

        if (isAlreadyPresent) {
          throw new HttpException(ErrorConstants.LOCATION_IS_ALREADY_EXISTING, HttpStatus.BAD_REQUEST);
        }

        const newLocation = new this.locationModel(location);
        newLocation.name = newLocation.name.toLowerCase();
        newLocation.countryId = country._id;
        return newLocation.save();
      }
      throw new HttpException(ErrorConstants.INVALID_LOCATION_NAME, HttpStatus.BAD_REQUEST);
    }
    throw new HttpException(ErrorConstants.INVALID_DATA_SUPPLIED, HttpStatus.BAD_REQUEST);
  }

  async updateLocation(countryId: string, locationId: string, location: LocationDTO): Promise<LocationDocument> {
    if (isValidObjectId(countryId) && isValidObjectId(locationId)) {
      const { name, population } = location;
      if (PatternService.constainsNumber(name)) {
        throw new HttpException(ErrorConstants.INVALID_LOCATION_NAME, HttpStatus.BAD_REQUEST);
      }

      const locationFromDb = await this.getLocationById(locationId);
      if (locationFromDb) {
        if (PatternService.constainsNumber(name) || population <= 0) {
          throw new HttpException(ErrorConstants.INVALID_DATA_SUPPLIED, HttpStatus.BAD_REQUEST);
        }

        const existingLocationByCountry = await this.getLocationsByCountry(countryId);
        const isExisting = existingLocationByCountry.find(
          (location) => location.name.toLowerCase() === name.toLowerCase()
        );
        if (isExisting) {
          throw new HttpException(ErrorConstants.LOCATION_IS_ALREADY_EXISTING, HttpStatus.BAD_REQUEST);
        }

        locationFromDb.name = name.toLowerCase();
        locationFromDb.population = population;
        return locationFromDb.save();
      }
      throw new HttpException(ErrorConstants.LOCATION_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    throw new HttpException(ErrorConstants.INVALID_DATA_SUPPLIED, HttpStatus.BAD_REQUEST);
  }

  async getLocationById(locationId: string) {
    if (isValidObjectId(locationId)) {
      const location = await this.locationModel.findById(locationId);
      if (!location) {
        throw new HttpException(ErrorConstants.LOCATION_NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      return location;
    }
    throw new HttpException(ErrorConstants.LOCATION_NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  async getLocationByCountryAndId(countryId: string, locationId: string) {
    if (isValidObjectId(locationId)) {
      const location = await this.locationModel.findById(locationId);
      if (!location) {
        throw new HttpException(ErrorConstants.LOCATION_NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      if (location.countryId !== countryId) {
        throw new HttpException(ErrorConstants.LOCATION_NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      return location;
    }
    throw new HttpException(ErrorConstants.INVALID_DATA_SUPPLIED, HttpStatus.BAD_REQUEST);
  }

  async removeLocation(locationId: string) {
    if (isValidObjectId(locationId)) {
      await this.locationModel.findByIdAndRemove(locationId);
      return;
    }
  }

  async updateLocationName(countryId: string, locationId: string, location: LocationDTO) {
    const { name } = location;
    const existingLocationsByCountry = await this.getLocationsByCountry(countryId);
    const isExisting = existingLocationsByCountry.find(
      (location) => location.name.toLowerCase() === name.toLowerCase()
    );

    if (isExisting) {
      throw new HttpException(ErrorConstants.LOCATION_IS_ALREADY_EXISTING, HttpStatus.BAD_REQUEST);
    }
    const existingLocation = existingLocationsByCountry.find((location) => String(location._id) === String(locationId));
    if (!existingLocation) {
      throw new HttpException(ErrorConstants.LOCATION_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }

    if (PatternService.constainsNumber(name) || name.length <= 3) {
      throw new HttpException(ErrorConstants.INVALID_LOCATION_NAME, HttpStatus.BAD_REQUEST);
    }

    existingLocation.name = name.toLowerCase();
    return existingLocation.save();
  }

  async updateLocationPopulation(countryId: string, locationId: string, location: LocationPopulationDTO) {
    const { population } = location;
    const existingLocationByCountry = await this.getLocationsByCountry(countryId);
    const existingLocation = existingLocationByCountry.find((location) => String(location._id) === locationId);

    if (!existingLocation) {
      throw new HttpException(ErrorConstants.LOCATION_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }

    if (population <= 0 || isNaN(population)) {
      throw new HttpException(ErrorConstants.INVALID_DATA_SUPPLIED, HttpStatus.BAD_REQUEST);
    }

    existingLocation.population = population;
    return existingLocation.save();
  }
}
