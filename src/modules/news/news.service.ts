import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import ErrorConstants from 'src/constants/error.constants';
import { CountryService } from '../countries/countries.service';
import { NewsCreationDTO } from './dto/newsCreation.dto';
import { NewsDescriptionUpdateDTO } from './dto/newsDescriptionUpdate.dto';
import { NewsNameUpdateDTO } from './dto/newsNameUpdate.dto';
import { News, NewsDocument } from './schema/news.schema';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private newsModel: Model<NewsDocument>,
    private readonly countryService: CountryService
  ) {}

  async addNews(countryId: string, userId: string, dto: NewsCreationDTO) {
    await this.countryService.getById(countryId);
    const newEntity = new this.newsModel(dto);
    newEntity.creatorId = userId;
    newEntity.countryId = countryId;
    return newEntity.save();
  }

  async getNewsById(countryId: string, id: string) {
    await this.countryService.getById(countryId);
    const entity = this.newsModel.findOne({ _id: id });
    if (!entity) {
      throw new HttpException(ErrorConstants.NEWS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return entity;
  }

  async getNewsByCountry(countryId: string) {
    await this.countryService.getById(countryId);
    return this.newsModel.findOne({ countryId });
  }

  async updateNewsById(countryId: string, newsId: string, dto: NewsCreationDTO) {
    await this.countryService.getById(countryId);
    const entity = await this.newsModel.findOne({ _id: newsId });
    if (!entity) {
      throw new HttpException(ErrorConstants.NEWS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    entity.name = dto.name;
    entity.description = dto.description;
    return entity.save();
  }

  async updateNewsName(countryId: string, newsId: string, { name }: NewsNameUpdateDTO) {
    await this.countryService.getById(countryId);
    const entity = await this.newsModel.findOne({ _id: newsId });
    if (!entity) {
      throw new HttpException(ErrorConstants.NEWS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    entity.name = name;
    return entity.save();
  }

  async updateNewsDescription(countryId: string, newsId: string, { description }: NewsDescriptionUpdateDTO) {
    await this.countryService.getById(countryId);
    const entity = await this.newsModel.findOne({ _id: newsId });
    if (!entity) {
      throw new HttpException(ErrorConstants.NEWS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    entity.description = description;
    return entity.save();
  }

  async removeNews(countryId: string, newsId: string) {
    await this.countryService.getById(countryId);
    const entity = await this.newsModel.findOne({ _id: newsId });
    if (!entity) {
      throw new HttpException(ErrorConstants.NEWS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    await this.newsModel.remove({ _id: newsId });
    return;
  }
}
