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
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { ProblemDTO } from './dto/problem.dto';
import { ProblemsService } from './problems.service';
import { ProblemDocument } from './schema/problems.schema';
import SwaggerConstants from '../../constants/swagger.constants';
import { RequestPayload } from 'src/common/types';

@Controller('countries/:countryId/locations/:locationId/problems')
@ApiTags('Problems')
export class ProblemsController {
  constructor(private readonly problemService: ProblemsService) {}

  @Get(':problemId')
  @ApiOkResponse({ description: SwaggerConstants.PROBLEM_BY_ID_OK })
  @ApiNotFoundResponse({ description: SwaggerConstants.PROBLEM_BY_ID_NOT_FOUND })
  async getProblemById(
    @Param('countryId') countryId: string,
    @Param('locationId') locationId: string,
    @Param('problemId') problemId: string
  ): Promise<ProblemDocument> {
    return this.problemService.getById(countryId, locationId, problemId);
  }

  @Get()
  @ApiOkResponse({ description: SwaggerConstants.GET_PROBLEMS_BY_LOCATION_OK })
  @ApiNotFoundResponse({ description: SwaggerConstants.GET_PROBLEMS_BY_LOCATION_NOT_FOUND })
  async getProblemsByLocation(@Param('countryId') countryId: string, @Param('locationId') locationId: string) {
    return this.problemService.getProblemsByLocation(countryId, locationId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({ description: SwaggerConstants.PROBLEM_CREATED })
  @ApiUnauthorizedResponse({ description: SwaggerConstants.NOT_AUTH })
  @ApiNotFoundResponse({ description: SwaggerConstants.PROBLEM_CREATION_NOT_FOUND })
  async createProblem(
    @Param('countryId') countryId: string,
    @Param('locationId') locationId: string,
    @Body() problemDTO: ProblemDTO,
    @Request() req
  ): Promise<ProblemDocument> {
    return this.problemService.createProblem(countryId, locationId, problemDTO, req.userId);
  }

  @Put(':problemId')
  @UseGuards(AuthGuard)
  @ApiUnauthorizedResponse({ description: SwaggerConstants.NOT_AUTH })
  @ApiForbiddenResponse({ description: SwaggerConstants.FORBIDDEN })
  @ApiOkResponse({ description: SwaggerConstants.PROBLEM_UPDATE_OK })
  @ApiNotFoundResponse({ description: SwaggerConstants.GET_PROBLEMS_BY_LOCATION_NOT_FOUND })
  async updateProblem(
    @Param('countryId') countryId: string,
    @Param('locationId') locationId: string,
    @Param('problemId') problemId: string,
    @Body() dto: ProblemDTO,
    @Request() req
  ) {
    return this.problemService.updateProblem(countryId, locationId, problemId, dto, req.userId);
  }

  @Patch(':problemId/location')
  @ApiOkResponse({ description: SwaggerConstants.PROBLEM_NAME_UPDATE })
  @ApiNotFoundResponse({ description: SwaggerConstants.PROBLEM_BY_ID_NOT_FOUND })
  async updateProblemLocation(
    @Param('countryId') countryId: string,
    @Param('locationId') locationId: string,
    @Param('problemId') problemId: string,
    @Body() dto: ProblemDTO,
    @Request() req
  ) {
    return this.problemService.updateProblemLocation(countryId, locationId, problemId, dto, req.userId);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  @ApiNoContentResponse({ description: SwaggerConstants.PROBLEM_DELETE })
  @ApiForbiddenResponse({ description: SwaggerConstants.FORBIDDEN })
  @ApiUnauthorizedResponse({
    description: SwaggerConstants.NOT_AUTH
  })
  async removeProblem(
    @Param('countryId') countryId: string,
    @Param('locationId') locationId: string,
    @Param('problemId') problemId: string,
    @Request() req
  ) {
    return this.problemService.removeProblem(countryId, locationId, problemId, req.userId);
  }

  @Patch(':problemId/views')
  @ApiOkResponse({ description: SwaggerConstants.PROBLEM_VIEWS_UPDATE })
  @ApiNotFoundResponse({ description: SwaggerConstants.PROBLEM_BY_ID_NOT_FOUND })
  async incrementViews(
    @Param('countryId') countryId: string,
    @Param('locationId') locationId: string,
    @Param('problemId') problemId: string
  ) {
    return this.problemService.incrementViews(countryId, locationId, problemId);
  }

  @Patch(':problemId/thumbUp')
  @UseGuards(AuthGuard)
  async thumpUp(
    @Param('countryId') countryId: string,
    @Param('locationId') locationId: string,
    @Param('problemId') problemId: string,
    @Request() req: RequestPayload
  ) {
    return this.problemService.thumbUp(req.userId, countryId, locationId, problemId);
  }

  @Patch(':problemId/thumbDown')
  @UseGuards(AuthGuard)
  async thumpDown(
    @Param('countryId') countryId: string,
    @Param('locationId') locationId: string,
    @Param('problemId') problemId: string,
    @Request() req: RequestPayload
  ) {
    return this.problemService.thumbDown(req.userId, countryId, locationId, problemId);
  }
}
