/**
 * 收藏功能服务
 *
 * 处理用户收藏视频相关的业务逻辑
 * @module favorite/services/favorite.service
 */

import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateFavoriteDto, UpdateFavoriteDto } from '../dto/favorite.dto';

/**
 * 收藏服务类
 */
@Injectable()
export class FavoriteService {
  private readonly logger = new Logger(FavoriteService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 收藏视频
   *
   * @param userId 用户ID
   * @param dto 收藏创建DTO
   * @returns 收藏信息
   */
  async addFavorite(userId: string, dto: CreateFavoriteDto) {
    try {
      // 检查视频是否存在
      const video = await this.prisma.video.findUnique({
        where: { id: dto.videoId },
        select: { id: true, isPublished: true },
      });

      if (!video) {
        throw new NotFoundException('视频不存在');
      }

      if (!video.isPublished) {
        throw new BadRequestException('无法收藏未发布的视频');
      }

      // 检查是否已经收藏
      const existingFavorite = await this.prisma.favorite.findUnique({
        where: {
          userId_videoId: {
            userId,
            videoId: dto.videoId,
          },
        },
      });

      if (existingFavorite) {
        throw new ConflictException('已经收藏过该视频');
      }

      // 创建收藏记录
      const favorite = await this.prisma.favorite.create({
        data: {
          userId,
          videoId: dto.videoId,
          note: dto.note || '',
          collectionId: dto.collectionId,
        },
        include: {
          video: {
            select: {
              id: true,
              title: true,
              thumbnailUrl: true,
              duration: true,
              user: {
                select: {
                  id: true,
                  username: true,
                  avatar: true,
                },
              },
            },
          },
          collection: dto.collectionId
            ? {
                select: {
                  id: true,
                  name: true,
                },
              }
            : false,
        },
      });

      // 增加视频的收藏计数
      await this.prisma.video.update({
        where: { id: dto.videoId },
        data: { favoriteCount: { increment: 1 } },
      });

      return {
        id: favorite.id,
        videoId: favorite.videoId,
        note: favorite.note,
        collectionId: favorite.collectionId,
        createdAt: favorite.createdAt,
        video: {
          id: favorite.video.id,
          title: favorite.video.title,
          thumbnailUrl: favorite.video.thumbnailUrl,
          duration: favorite.video.duration,
          creator: {
            id: favorite.video.user.id,
            username: favorite.video.user.username,
            avatar: favorite.video.user.avatar,
          },
        },
        collection: favorite.collection
          ? {
              id: favorite.collection.id,
              name: favorite.collection.name,
            }
          : null,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error(`收藏视频失败: ${errorMessage}`, errorStack);

      // 重新抛出特定异常
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      throw new BadRequestException('收藏视频失败');
    }
  }

  /**
   * 取消收藏
   *
   * @param userId 用户ID
   * @param favoriteId 收藏ID
   * @returns 操作结果
   */
  async removeFavorite(userId: string, favoriteId: string) {
    try {
      // 检查收藏记录是否存在且属于该用户
      const favorite = await this.prisma.favorite.findFirst({
        where: {
          id: favoriteId,
          userId,
        },
      });

      if (!favorite) {
        throw new NotFoundException('收藏记录不存在或不属于您');
      }

      // 删除收藏记录
      await this.prisma.favorite.delete({
        where: { id: favoriteId },
      });

      // 减少视频的收藏计数
      await this.prisma.video.update({
        where: { id: favorite.videoId },
        data: { favoriteCount: { decrement: 1 } },
      });

      return { message: '取消收藏成功' };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error(`取消收藏失败: ${errorMessage}`, errorStack);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException('取消收藏失败');
    }
  }

  /**
   * 更新收藏备注或收藏夹
   *
   * @param userId 用户ID
   * @param favoriteId 收藏ID
   * @param dto 更新DTO
   * @returns 更新后的收藏信息
   */
  async updateFavorite(userId: string, favoriteId: string, dto: UpdateFavoriteDto) {
    try {
      // 检查收藏记录是否存在且属于该用户
      const favorite = await this.prisma.favorite.findFirst({
        where: {
          id: favoriteId,
          userId,
        },
      });

      if (!favorite) {
        throw new NotFoundException('收藏记录不存在或不属于您');
      }

      // 如果要更新收藏夹，先检查收藏夹是否存在且属于该用户
      if (dto.collectionId) {
        const collection = await this.prisma.collection.findFirst({
          where: {
            id: dto.collectionId,
            userId,
          },
        });

        if (!collection) {
          throw new NotFoundException('收藏夹不存在或不属于您');
        }
      }

      // 更新收藏记录
      const updatedFavorite = await this.prisma.favorite.update({
        where: { id: favoriteId },
        data: {
          note: dto.note !== undefined ? dto.note : favorite.note,
          collectionId: dto.collectionId !== undefined ? dto.collectionId : favorite.collectionId,
        },
        include: {
          video: {
            select: {
              id: true,
              title: true,
              thumbnailUrl: true,
              duration: true,
              user: {
                select: {
                  id: true,
                  username: true,
                  avatar: true,
                },
              },
            },
          },
          collection: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return {
        id: updatedFavorite.id,
        videoId: updatedFavorite.videoId,
        note: updatedFavorite.note,
        collectionId: updatedFavorite.collectionId,
        createdAt: updatedFavorite.createdAt,
        video: {
          id: updatedFavorite.video.id,
          title: updatedFavorite.video.title,
          thumbnailUrl: updatedFavorite.video.thumbnailUrl,
          duration: updatedFavorite.video.duration,
          creator: {
            id: updatedFavorite.video.user.id,
            username: updatedFavorite.video.user.username,
            avatar: updatedFavorite.video.user.avatar,
          },
        },
        collection: updatedFavorite.collection
          ? {
              id: updatedFavorite.collection.id,
              name: updatedFavorite.collection.name,
            }
          : null,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error(`更新收藏失败: ${errorMessage}`, errorStack);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException('更新收藏失败');
    }
  }

  /**
   * 获取用户收藏列表
   *
   * @param userId 用户ID
   * @param page 页码
   * @param limit 每页数量
   * @param collectionId 收藏夹ID（可选）
   * @returns 收藏列表及分页信息
   */
  async getUserFavorites(userId: string, page = 1, limit = 10, collectionId?: string) {
    const skip = (page - 1) * limit;

    try {
      // 构建查询条件
      const where: any = { userId };
      if (collectionId) {
        where.collectionId = collectionId;
      }

      // 查询收藏列表
      const [favorites, total] = await Promise.all([
        this.prisma.favorite.findMany({
          where,
          include: {
            video: {
              select: {
                id: true,
                title: true,
                thumbnailUrl: true,
                duration: true,
                viewCount: true,
                createdAt: true,
                publishedAt: true,
                user: {
                  select: {
                    id: true,
                    username: true,
                    avatar: true,
                  },
                },
              },
            },
            collection: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        this.prisma.favorite.count({ where }),
      ]);

      // 格式化返回数据
      return {
        data: favorites.map(favorite => ({
          id: favorite.id,
          videoId: favorite.videoId,
          note: favorite.note,
          collectionId: favorite.collectionId,
          createdAt: favorite.createdAt,
          video: {
            id: favorite.video.id,
            title: favorite.video.title,
            thumbnailUrl: favorite.video.thumbnailUrl,
            duration: favorite.video.duration,
            viewCount: favorite.video.viewCount,
            createdAt: favorite.video.createdAt,
            publishedAt: favorite.video.publishedAt,
            creator: {
              id: favorite.video.user.id,
              username: favorite.video.user.username,
              avatar: favorite.video.user.avatar,
            },
          },
          collection: favorite.collection
            ? {
                id: favorite.collection.id,
                name: favorite.collection.name,
              }
            : null,
        })),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error(`获取收藏列表失败: ${errorMessage}`, errorStack);
      throw new BadRequestException('获取收藏列表失败');
    }
  }

  /**
   * 检查视频是否已收藏
   *
   * @param userId 用户ID
   * @param videoId 视频ID
   * @returns 是否已收藏
   */
  async checkVideoFavorited(userId: string, videoId: string) {
    try {
      const favorite = await this.prisma.favorite.findUnique({
        where: {
          userId_videoId: {
            userId,
            videoId,
          },
        },
      });

      return {
        isFavorited: !!favorite,
        favoriteId: favorite?.id || null,
        collectionId: favorite?.collectionId || null,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error(`检查视频收藏状态失败: ${errorMessage}`, errorStack);
      throw new BadRequestException('检查视频收藏状态失败');
    }
  }

  /**
   * 批量检查视频是否已收藏
   *
   * @param userId 用户ID
   * @param videoIds 视频ID数组
   * @returns 每个视频的收藏状态
   */
  async bulkCheckFavoriteStatus(userId: string, videoIds: string[]) {
    try {
      if (!videoIds.length) {
        return {};
      }

      const favorites = await this.prisma.favorite.findMany({
        where: {
          userId,
          videoId: { in: videoIds },
        },
        select: {
          videoId: true,
          id: true,
          collectionId: true,
        },
      });

      // 构建结果对象，键为视频ID，值为收藏状态
      const result: Record<
        string,
        {
          isFavorited: boolean;
          favoriteId: string | null;
          collectionId: string | null;
        }
      > = {};

      // 初始化所有视频为未收藏状态
      videoIds.forEach(videoId => {
        result[videoId] = {
          isFavorited: false,
          favoriteId: null,
          collectionId: null,
        };
      });

      // 填充已收藏的视频信息
      favorites.forEach(favorite => {
        result[favorite.videoId] = {
          isFavorited: true,
          favoriteId: favorite.id,
          collectionId: favorite.collectionId,
        };
      });

      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error(`批量检查视频收藏状态失败: ${errorMessage}`, errorStack);
      throw new BadRequestException('批量检查视频收藏状态失败');
    }
  }
}
