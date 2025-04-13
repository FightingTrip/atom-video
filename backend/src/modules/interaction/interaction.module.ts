/**
 * 互动模块
 *
 * 提供视频评论、点赞、收藏等互动功能
 * @module interaction/interaction.module
 */

import { Module } from '@nestjs/common';
import { CommentService } from './services/comment.service';
import { LikeService } from './services/like.service';
import { CommentController } from './controllers/comment.controller';
import { LikeController } from './controllers/like.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CommentController, LikeController],
  providers: [CommentService, LikeService],
  exports: [CommentService, LikeService],
})
export class InteractionModule {}
