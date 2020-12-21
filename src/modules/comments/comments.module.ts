import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationsModule } from '../locations/locations.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment, CommentSchema } from './schema/comments.schema';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]), LocationsModule]
})
export class CommentsModule {}
