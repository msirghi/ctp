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
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { RequestPayload } from "src/common/types";
import SwaggerConstants from "src/constants/swagger.constants";
import { AuthGuard } from "src/guards/auth.guard";
import { NewsCreationDTO } from "./dto/newsCreation.dto";
import { NewsDescriptionUpdateDTO } from "./dto/newsDescriptionUpdate.dto";
import { NewsNameUpdateDTO } from "./dto/newsNameUpdate.dto";
import { NewsService } from "./news.service";

@Controller()
@ApiTags("News")
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post("/countries/:countryId/news")
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: SwaggerConstants.NEWS_ADD })
  @ApiUnauthorizedResponse({ description: SwaggerConstants.NOT_AUTH })
  @ApiBadRequestResponse({ description: SwaggerConstants.INVALID_DATA })
  @UseGuards(AuthGuard)
  async addNews(
    @Param("countryId") countryId: string,
    @Body() dto: NewsCreationDTO,
    @Request() { userId }: RequestPayload
  ) {
    return this.newsService.addNews(countryId, userId, dto);
  }

  @Get("/countries/:countryId/news/:newsId")
  @ApiNotFoundResponse({ description: SwaggerConstants.NOT_FOUND })
  @ApiOkResponse({ description: SwaggerConstants.GET_NEWS_BY_ID })
  async getNewsById(@Param("countryId") countryId: string, @Param("newsId") newsId: string) {
    return this.newsService.getNewsById(countryId, newsId);
  }

  @Get("/countries/:countryId/news")
  @ApiOkResponse({ description: SwaggerConstants.GET_NEWS_BY_COUNTRY })
  async getNewsByCountry(@Param("countryId") countryId: string) {
    return this.newsService.getNewsByCountry(countryId);
  }

  @Put("/countries/:countryId/news/:newsId")
  @ApiOkResponse({ description: SwaggerConstants.UPDATE_NEWS_BY_ID })
  @ApiBadRequestResponse({ description: SwaggerConstants.INVALID_DATA })
  async updateNews(
    @Param("countryId") countryId: string,
    @Param("newsId") newsId: string,
    @Body() dto: NewsCreationDTO
  ) {
    return this.newsService.updateNewsById(countryId, newsId, dto);
  }

  @Patch("/countries/:countryId/news/:newsId/name")
  @ApiOkResponse({ description: SwaggerConstants.UPDATE_NEWS_NAME })
  @ApiBadRequestResponse({ description: SwaggerConstants.INVALID_DATA })
  async updateNewsName(
    @Param("countryId") countryId: string,
    @Param("newsId") newsId: string,
    @Body() dto: NewsNameUpdateDTO
  ) {
    return this.newsService.updateNewsName(countryId, newsId, dto);
  }

  @Patch("/countries/:countryId/news/:newsId/description")
  @ApiOkResponse({ description: SwaggerConstants.UPDATE_NEWS_DESCRIPTION })
  @ApiBadRequestResponse({ description: SwaggerConstants.INVALID_DATA })
  async updateNewsDescription(
    @Param("countryId") countryId: string,
    @Param("newsId") newsId: string,
    @Body() dto: NewsDescriptionUpdateDTO
  ) {
    return this.newsService.updateNewsDescription(countryId, newsId, dto);
  }

  @Delete("/countries/:countryId/news/:newsId")
  @ApiNoContentResponse({ description: SwaggerConstants.REMOVE_NEWS_BY_ID })
  async removeNewsById(@Param("countryId") countryId: string, @Param("newsId") newsId: string) {
    return this.newsService.removeNews(countryId, newsId);
  }
}
