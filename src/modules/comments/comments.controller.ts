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
import { RolesGuard } from "src/guards/roles.guard";
import { CommentsService } from "./comments.service";
import { CommentCreationDTO } from "./dto/commentCreation";

@Controller()
@ApiTags("Comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post("/countries/:countryId/location/:locationId/problems/:problemId/comments")
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({ description: SwaggerConstants.PROBLEM_COMMENT_ADD })
  @ApiUnauthorizedResponse({ description: SwaggerConstants.NOT_AUTH })
  @ApiBadRequestResponse({ description: SwaggerConstants.INVALID_DATA })
  createCommentForProblem(
    @Param("countryId") countryId: string,
    @Param("locationId") locationId: string,
    @Param("problemId") problemId: string,
    @Request() { userId, usname }: RequestPayload,
    @Body() dto: CommentCreationDTO
  ) {
    return this.commentsService.createCommentForProblem(countryId, locationId, userId, usname, problemId, dto);
  }

  @Get("/comments/all/:itemId")
  @ApiNotFoundResponse({ description: SwaggerConstants.NOT_FOUND })
  @ApiOkResponse({ description: SwaggerConstants.GET_COMMENTS_BY_ITEM })
  async getCommentsByItemId(@Param("itemId") itemId: string) {
    return this.commentsService.getCommentsById(itemId);
  }

  @Get("/comments/:commentId")
  @ApiOkResponse({ description: SwaggerConstants.GET_COMMENT_BY_ID })
  @ApiNotFoundResponse({ description: SwaggerConstants.NOT_FOUND })
  async getCommentsById(@Param("commentId") commentId: string) {
    return this.commentsService.getCommentsById(commentId);
  }

  @Patch("/comments/:commentId/message")
  @UseGuards(AuthGuard)
  @ApiUnauthorizedResponse({ description: SwaggerConstants.NOT_AUTH })
  @ApiOkResponse({ description: SwaggerConstants.UPDATE_COMMENT_MESSAGE })
  @ApiBadRequestResponse({ description: SwaggerConstants.INVALID_DATA })
  async updateCommentMessage(
    @Request() req: RequestPayload,
    @Param("commentId") commentId: string,
    @Body() dto: CommentCreationDTO
  ) {
    return this.commentsService.updateCommentMessage(req.userId, commentId, dto);
  }

  @Delete("/comments/:commentId")
  @UseGuards(AuthGuard, RolesGuard)
  @ApiUnauthorizedResponse({ description: SwaggerConstants.NOT_AUTH })
  @ApiNoContentResponse({ description: SwaggerConstants.REMOVE_COMMENT_BY_ID })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeComment(@Param("commentId") commentId: string, @Request() req: RequestPayload) {
    return this.commentsService.removeComment(req.role, req.userId, commentId);
  }

  @Post("/locationId/:locationId/comments")
  @UseGuards(AuthGuard)
  createCommentForNews(@Request() { userId, usname }: RequestPayload, @Body() dto: CommentCreationDTO) {}
}
