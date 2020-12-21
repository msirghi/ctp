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
  UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestPayload } from 'src/common/types';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { CommentsService } from './comments.service';
import { CommentCreationDTO } from './dto/commentCreation';

@Controller()
@ApiTags('Comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('/countries/:countryId/location/:locationId/problems/:problemId/comments')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  createCommentForProblem(
    @Param('countryId') countryId: string,
    @Param('locationId') locationId: string,
    @Param('problemId') problemId: string,
    @Request() { userId, usname }: RequestPayload,
    @Body() dto: CommentCreationDTO
  ) {
    return this.commentsService.createCommentForProblem(countryId, locationId, userId, usname, problemId, dto);
  }

  @Get('/comments/all/:itemId')
  async getCommentsByItemId(@Param('itemId') itemId: string) {
    return this.commentsService.getCommentsById(itemId);
  }

  @Get('/comments/:commentId')
  async getCommentsById(@Param('commentId') commentId: string) {
    return this.commentsService.getCommentsById(commentId);
  }

  @Patch('/comments/:commentId/message')
  @UseGuards(AuthGuard)
  async updateCommentMessage(
    @Request() req: RequestPayload,
    @Param('commentId') commentId: string,
    @Body() dto: CommentCreationDTO
  ) {
    return this.commentsService.updateCommentMessage(req.userId, commentId, dto);
  }

  @Delete('/comments/:commentId')
  @UseGuards(AuthGuard, RolesGuard)
  async removeComment(@Param('commentId') commentId: string, @Request() req: RequestPayload) {
    return this.commentsService.removeComment(req.role, req.userId, commentId);
  }

  @Post('/locationId/:locationId/comments')
  @UseGuards(AuthGuard)
  createCommentForNews(@Request() { userId, usname }: RequestPayload, @Body() dto: CommentCreationDTO) {}
}
