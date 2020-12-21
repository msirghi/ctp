import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Request,
  UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestPayload } from 'src/common/types';
import { AuthGuard } from 'src/guards/auth.guard';
import { NewsCreationDTO } from './dto/newsCreation.dto';
import { NewsDescriptionUpdateDTO } from './dto/newsDescriptionUpdate.dto';
import { NewsNameUpdateDTO } from './dto/newsNameUpdate.dto';
import { NewsService } from './news.service';

@Controller()
@ApiTags('News')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post('/countries/:countryId/news')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  async addNews(
    @Param('countryId') countryId: string,
    @Body() dto: NewsCreationDTO,
    @Request() { userId }: RequestPayload
  ) {
    return this.newsService.addNews(countryId, userId, dto);
  }

  @Get('/countries/:countryId/news/:newsId')
  async getNewsById(@Param('countryId') countryId: string, @Param('newsId') newsId: string) {
    return this.newsService.getNewsById(countryId, newsId);
  }

  @Get('/countries/:countryId/news')
  async getNewsByCountry(@Param('countryId') countryId: string) {
    return this.newsService.getNewsByCountry(countryId);
  }

  @Put('/countries/:countryId/news/:newsId')
  async updateNews(
    @Param('countryId') countryId: string,
    @Param('newsId') newsId: string,
    @Body() dto: NewsCreationDTO
  ) {
    return this.newsService.updateNewsById(countryId, newsId, dto);
  }

  @Patch('/countries/:countryId/news/:newsId/name')
  async updateNewsName(
    @Param('countryId') countryId: string,
    @Param('newsId') newsId: string,
    @Body() dto: NewsNameUpdateDTO
  ) {
    return this.newsService.updateNewsName(countryId, newsId, dto);
  }

  @Patch('/countries/:countryId/news/:newsId/description')
  async updateNewsDescription(
    @Param('countryId') countryId: string,
    @Param('newsId') newsId: string,
    @Body() dto: NewsDescriptionUpdateDTO
  ) {
    return this.newsService.updateNewsDescription(countryId, newsId, dto);
  }

  @Delete('/countries/:countryId/news/:newsId')
  async removeNewsById(@Param('countryId') countryId: string, @Param('newsId') newsId: string) {
    return this.newsService.removeNews(countryId, newsId);
  }
}
