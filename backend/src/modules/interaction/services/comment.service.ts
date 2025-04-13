/**
 * 评论服务模块
 *
 * 提供评论相关的业务逻辑实现
 * @module interaction/services/comment
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

/**
 * 创建评论DTO
 */
export interface CreateCommentDto {
  content: string;
  videoId: string;
  authorId: string;
  parentId?: string;
}

/**
 * 更新评论DTO
 */
export interface UpdateCommentDto {
  content: string;
}

/**
 * 评论查询参数
 */
export interface CommentQueryParams {
  videoId?: string;
  authorId?: string;
  parentId?: string;
  page?: number;
  limit?: number;
}

/**
 * 评论服务类
 * 管理评论相关的业务逻辑
 */
@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);

  constructor(private readonly prismaService: PrismaService) {}

  /**
   * 创建评论
   * @param createCommentDto 创建评论数据
   * @returns 创建的评论信息
   */
  async createComment(createCommentDto: CreateCommentDto) {
    try {
      // 检查视频是否存在
      const video = await this.prismaService.video.findUnique({
        where: { id: createCommentDto.videoId },
      });

      if (!video) {
        throw new NotFoundException(`未找到ID为 ${createCommentDto.videoId} 的视频`);
      }

      // 如果有父评论，检查父评论是否存在
      if (createCommentDto.parentId) {
        const parentComment = await this.prismaService.comment.findUnique({
          where: { id: createCommentDto.parentId },
        });

        if (!parentComment) {
          throw new NotFoundException(`未找到ID为 ${createCommentDto.parentId} 的父评论`);
        }

        if (parentComment.videoId !== createCommentDto.videoId) {
          throw new BadRequestException('父评论与当前视频不匹配');
        }
      }

      // 创建评论
      const comment = await this.prismaService.comment.create({
        data: {
          content: createCommentDto.content,
          isEdited: false,
          author: {
            connect: { id: createCommentDto.authorId },
          },
          video: {
            connect: { id: createCommentDto.videoId },
          },
          ...(createCommentDto.parentId && {
            parent: {
              connect: { id: createCommentDto.parentId },
            },
          }),
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      });

      // 更新视频评论计数
      await this.prismaService.video.update({
        where: { id: createCommentDto.videoId },
        data: {
          commentCount: {
            increment: 1,
          },
        },
      });

      return comment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`创建评论失败: ${error.message}`, error.stack);
      throw new BadRequestException(`创建评论失败: ${error.message}`);
    }
  }

  /**
   * 获取评论列表
   * @param queryParams 查询参数
   * @returns 评论列表及分页信息
   */
  async getComments(queryParams: CommentQueryParams) {
    const { videoId, authorId, parentId, page = 1, limit = 10 } = queryParams;

    // 构建过滤条件
    const where: any = {};

    if (videoId) {
      where.videoId = videoId;
    }

    if (authorId) {
      where.authorId = authorId;
    }

    // 查询根评论还是回复
    if (parentId === null) {
      // 查询顶级评论（没有父评论的评论）
      where.parentId = null;
    } else if (parentId) {
      // 查询特定父评论下的回复
      where.parentId = parentId;
    }

    // 计算分页
    const skip = (page - 1) * limit;

    try {
      const [comments, total] = await Promise.all([
        this.prismaService.comment.findMany({
          where,
          orderBy: {
            createdAt: 'desc',
          },
          skip,
          take: limit,
          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
            _count: {
              select: {
                replies: true,
                likes: true,
              },
            },
          },
        }),
        this.prismaService.comment.count({ where }),
      ]);

      // 格式化响应数据
      const formattedComments = comments.map(comment => ({
        ...comment,
        repliesCount: comment._count.replies,
        likesCount: comment._count.likes,
        _count: undefined,
      }));

      return {
        comments: formattedComments,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(`获取评论列表失败: ${error.message}`, error.stack);
      throw new BadRequestException(`获取评论列表失败: ${error.message}`);
    }
  }

  /**
   * 更新评论
   * @param id 评论ID
   * @param userId 用户ID（用于验证权限）
   * @param updateCommentDto 更新数据
   * @returns 更新后的评论信息
   */
  async updateComment(id: string, userId: string, updateCommentDto: UpdateCommentDto) {
    try {
      // 检查评论是否存在
      const existingComment = await this.prismaService.comment.findUnique({
        where: { id },
      });

      if (!existingComment) {
        throw new NotFoundException(`未找到ID为 ${id} 的评论`);
      }

      // 检查用户是否有权限更新此评论
      if (existingComment.authorId !== userId) {
        throw new ForbiddenException('您没有权限更新此评论');
      }

      // 更新评论
      const updatedComment = await this.prismaService.comment.update({
        where: { id },
        data: {
          content: updateCommentDto.content,
          isEdited: true,
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      });

      return updatedComment;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      this.logger.error(`更新评论失败: ${error.message}`, error.stack);
      throw new BadRequestException(`更新评论失败: ${error.message}`);
    }
  }

  /**
   * 删除评论
   * @param id 评论ID
   * @param userId 用户ID（用于验证权限）
   * @returns 成功消息
   */
  async deleteComment(id: string, userId: string) {
    try {
      // 检查评论是否存在
      const existingComment = await this.prismaService.comment.findUnique({
        where: { id },
      });

      if (!existingComment) {
        throw new NotFoundException(`未找到ID为 ${id} 的评论`);
      }

      // 检查用户是否有权限删除此评论
      if (existingComment.authorId !== userId) {
        throw new ForbiddenException('您没有权限删除此评论');
      }

      // 删除评论
      await this.prismaService.comment.delete({
        where: { id },
      });

      // 更新视频评论计数
      await this.prismaService.video.update({
        where: { id: existingComment.videoId },
        data: {
          commentCount: {
            decrement: 1,
          },
        },
      });

      return { message: '评论删除成功' };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      this.logger.error(`删除评论失败: ${error.message}`, error.stack);
      throw new BadRequestException(`删除评论失败: ${error.message}`);
    }
  }
}
