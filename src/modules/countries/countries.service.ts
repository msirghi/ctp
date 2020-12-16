import { Injectable, HttpException, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CountryDTO } from './dto/country.dto';
import { Country, CountryDocument } from './schemas/country.schema';
import { HttpStatus } from '@nestjs/common/enums';
import ErrorConstants from 'src/constants/error.constants';
import PatternService from 'src/services/PatternService';

@Injectable()
export class CountryService {
  constructor(@InjectModel(Country.name) private countryModel: Model<CountryDocument>) {}

  async getAll(): Promise<Country[]> {
    return this.countryModel.find().exec();
  }

  async getById(id: string): Promise<CountryDocument> {
    if (isValidObjectId(id)) {
      const country = await this.countryModel.findById(id).exec();
      if (country) {
        return country;
      }
      throw new HttpException(ErrorConstants.COUNTRY_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    throw new HttpException(ErrorConstants.COUNTRY_NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  async getByName(name: string): Promise<Country> {
    return this.countryModel.findOne({ name }).exec();
  }

  async createCountry(countryDto: CountryDTO): Promise<Country> {
    const { name } = countryDto;
    if (name.length < 3 || PatternService.constainsNumber(name)) {
      throw new HttpException(ErrorConstants.INVALID_COUNTRY_NAME, HttpStatus.BAD_REQUEST);
    }
    const existingCountry = await this.getByName(name.toLowerCase());
    if (!existingCountry) {
      const newCountry = new this.countryModel(countryDto);
      newCountry.name = newCountry.name.toLowerCase();
      newCountry.createdAt = new Date();
      return newCountry.save();
    }
    throw new HttpException(ErrorConstants.EXISTING_COUNTRY_ERROR, HttpStatus.BAD_REQUEST);
  }

  async remove(id: string): Promise<Country> {
    if (isValidObjectId(id)) {
      return this.countryModel.findByIdAndRemove(id);
    }
    return new HttpException(ErrorConstants.BAD_REQUEST, HttpStatus.BAD_REQUEST);
  }

  async update(id: string, countryDto: CountryDTO): Promise<Country> {
    const { name } = countryDto;
    const existingCountry = await this.getByName(name);
    if (!existingCountry && isValidObjectId(id)) {
      const country = await this.countryModel.findByIdAndUpdate(id, {
        ...countryDto,
        name: countryDto.name.toLowerCase()
      });
      if (country) {
        country.name = countryDto.name;
        return country;
      }
      throw new HttpException(ErrorConstants.COUNTRY_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    throw new HttpException(ErrorConstants.EXISTING_COUNTRY_ERROR, HttpStatus.BAD_REQUEST);
  }
}
