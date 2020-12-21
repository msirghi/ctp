import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ROLES } from 'src/common/enums';
import ErrorConstants from 'src/constants/error.constants';
import { LocationService } from '../locations/locations.service';
import { CommentCreationDTO } from './dto/commentCreation';
import { Comment, CommentDocument } from './schema/comments.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly commentsModel: Model<CommentDocument>,
    private readonly locationService: LocationService
  ) {}

  async createCommentForProblem(
    countryId: string,
    locationId: string,
    userId: string,
    username: string,
    problemId: string,
    dto: CommentCreationDTO
  ) {
    const { message } = dto;
    await this.locationService.getLocationByCountryAndId(countryId, locationId);

    if (message.length < 5) {
      throw new HttpException(ErrorConstants.COMMENT_MESSAGE_TOO_SHORT, HttpStatus.BAD_REQUEST);
    }

    const newComment = new this.commentsModel(dto);
    newComment.username = username;
    newComment.userId = userId;
    newComment.itemId = problemId;
    return newComment.save();
  }

  async getCommentsByItemId(itemId: string) {
    return this.commentsModel.find({ itemId });
  }

  async getCommentsById(commentId: string) {
    const comment = await this.commentsModel.findOne({ _id: commentId });

    if (!comment) {
      throw new HttpException(ErrorConstants.COMMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return comment;
  }

  async updateCommentMessage(userId: string, commentId: string, { message }: CommentCreationDTO) {
    const comment = await this.commentsModel.findOne({ _id: commentId });
    if (!comment) {
      throw new HttpException(ErrorConstants.COMMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if (comment.userId !== userId) {
      throw new HttpException(ErrorConstants.LACK_OF_PERMISSIONS, HttpStatus.FORBIDDEN);
    }

    comment.message = message;
    return comment.save();
  }

  async removeComment(userRole: string, userId: string, commentId: string) {
    const comment = await this.commentsModel.findOne({ _id: commentId });

    if (!comment) {
      throw new HttpException(ErrorConstants.COMMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (comment.userId !== userId && userRole !== ROLES.USER) {
      throw new HttpException(ErrorConstants.LACK_OF_PERMISSIONS, HttpStatus.FORBIDDEN);
    }
    await this.commentsModel.findByIdAndRemove(commentId);
    return;
  }

  async createCommentForNews(userId: string, dto: CommentCreationDTO) {}
}
