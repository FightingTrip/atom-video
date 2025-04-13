/**
 * 点赞服务模块
 *
 * 提供点赞相关的业务逻辑实现
 * @module interaction/services/like
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

/**
 * 创建点赞DTO
 */
export interface CreateLikeDto {
  videoId: string;
  userId: string;
}

/**
 * 检查点赞状态DTO
 */
export interface CheckLikeStatusDto {
  videoId: string;
  userId: string;
}

/**
 * 点赞服务类
 * 管理点赞相关的业务逻辑
 */
@Injectable()
export class LikeService {
  private readonly logger = new Logger(LikeService.name);

  constructor(private readonly prismaService: PrismaService) {}

  /**
   * 添加点赞
   * @param createLikeDto 创建点赞数据
   * @returns 创建的点赞信息
   */
  async addLike(createLikeDto: CreateLikeDto) {
    try {
      // 检查视频是否存在
      const video = await this.prismaService.video.findUnique({
        where: { id: createLikeDto.videoId },
      });

      if (!video) {
        throw new NotFoundException(`未找到ID为 ${createLikeDto.videoId} 的视频`);
      }

      // 检查是否已经点赞
      const existingLike = await this.prismaService.like.findFirst({
        where: {
          videoId: createLikeDto.videoId,
          userId: createLikeDto.userId,
        },
      });

      if (existingLike) {
        throw new ConflictException('您已经点赞过此视频');
      }

      // 事务执行点赞和更新视频点赞计数
      const result = await this.prismaService.$transaction(async prisma => {
        // 创建点赞记录
        const like = await prisma.like.create({
          data: {
            video: {
              connect: { id: createLikeDto.videoId },
            },
            user: {
              connect: { id: createLikeDto.userId },
            },
          },
        });

        // 更新视频点赞计数
        await prisma.video.update({
          where: { id: createLikeDto.videoId },
          data: {
            likeCount: {
              increment: 1,
            },
          },
        });

        return like;
      });

      return { message: '点赞成功', like: result };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`添加点赞失败: ${error.message}`, error.stack);
      throw new BadRequestException(`添加点赞失败: ${error.message}`);
    }
  }

  /**
   * 取消点赞
   * @param videoId 视频ID
   * @param userId 用户ID
   * @returns 成功消息
   */
  async removeLike(videoId: string, userId: string) {
    try {
      // 检查点赞记录是否存在
      const existingLike = await this.prismaService.like.findFirst({
        where: {
          videoId,
          userId,
        },
      });

      if (!existingLike) {
        throw new NotFoundException('您尚未点赞此视频');
      }

      // 事务执行取消点赞和更新视频点赞计数
      await this.prismaService.$transaction(async prisma => {
        // 删除点赞记录
        await prisma.like.delete({
          where: {
            id: existingLike.id,
          },
        });

        // 更新视频点赞计数
        await prisma.video.update({
          where: { id: videoId },
          data: {
            likeCount: {
              decrement: 1,
            },
          },
        });
      });

      return { message: '取消点赞成功' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`取消点赞失败: ${error.message}`, error.stack);
      throw new BadRequestException(`取消点赞失败: ${error.message}`);
    }
  }

  /**
   * 检查用户是否已点赞视频
   * @param checkLikeStatusDto 检查点赞状态数据
   * @returns 点赞状态
   */
  async checkLikeStatus(checkLikeStatusDto: CheckLikeStatusDto) {
    try {
      const { videoId, userId } = checkLikeStatusDto;

      // 检查点赞记录是否存在
      const like = await this.prismaService.like.findFirst({
        where: {
          videoId,
          userId,
        },
      });

      return {
        isLiked: !!like,
        likeId: like ? like.id : null,
      };
    } catch (error) {
      this.logger.error(`检查点赞状态失败: ${error.message}`, error.stack);
      throw new BadRequestException(`检查点赞状态失败: ${error.message}`);
    }
  }

  /**
   * 获取用户的所有点赞视频
   * @param userId 用户ID
   * @param page 页码
   * @param limit 每页数量
   * @returns 点赞的视频列表及分页信息
   */
  async getUserLikedVideos(userId: string, page = 1, limit = 10) {
    try {
      // 计算分页
      const skip = (page - 1) * limit;

      // 获取用户点赞的视频
      const [likes, total] = await Promise.all([
        this.prismaService.like.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
          include: {
            video: {
              include: {
                creator: {
                  select: {
                    id: true,
                    username: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        }),
        this.prismaService.like.count({ where: { userId } }),
      ]);

      // 格式化响应数据
      const likedVideos = likes.map(like => ({
        likeId: like.id,
        likedAt: like.createdAt,
        video: like.video,
      }));

      return {
        likedVideos,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(`获取用户点赞视频失败: ${error.message}`, error.stack);
      throw new BadRequestException(`获取用户点赞视频失败: ${error.message}`);
    }
  }
}
