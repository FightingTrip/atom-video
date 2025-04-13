/**
 * 视频服务模块
 *
 * 提供视频相关的业务逻辑实现
 * @module video/services/video
 */

import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { VideoVisibility, VideoType, DifficultyLevel } from '@atom/shared-types/models';

/**
 * 创建视频DTO
 */
export interface CreateVideoDto {
  title: string;
  description?: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  visibility: VideoVisibility;
  difficultyLevel: DifficultyLevel;
  sourceCodeUrl?: string;
  liveDemo?: string;
  videoType: VideoType;
  prerequisites?: string;
  learningOutcomes?: string;
  creatorId: string;
  seriesId?: string;
  seriesOrder?: number;
  languageId?: string;
}

/**
 * 更新视频DTO
 */
export interface UpdateVideoDto {
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  visibility?: VideoVisibility;
  difficultyLevel?: DifficultyLevel;
  sourceCodeUrl?: string;
  liveDemo?: string;
  videoType?: VideoType;
  prerequisites?: string;
  learningOutcomes?: string;
  seriesId?: string;
  seriesOrder?: number;
  languageId?: string;
}

/**
 * 视频查询参数
 */
export interface VideoQueryParams {
  creatorId?: string;
  videoType?: VideoType;
  difficultyLevel?: DifficultyLevel;
  seriesId?: string;
  languageId?: string;
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'oldest' | 'popular' | 'views';
}

/**
 * 视频服务类
 * 管理视频相关的业务逻辑
 */
@Injectable()
export class VideoService {
  private readonly logger = new Logger(VideoService.name);

  constructor(private readonly prismaService: PrismaService) {}

  /**
   * 创建新视频
   * @param createVideoDto 创建视频数据
   * @returns 创建的视频信息
   */
  async createVideo(createVideoDto: CreateVideoDto) {
    try {
      const video = await this.prismaService.video.create({
        data: {
          title: createVideoDto.title,
          description: createVideoDto.description,
          thumbnailUrl: createVideoDto.thumbnailUrl,
          videoUrl: createVideoDto.videoUrl,
          duration: createVideoDto.duration,
          visibility: createVideoDto.visibility,
          difficultyLevel: createVideoDto.difficultyLevel,
          sourceCodeUrl: createVideoDto.sourceCodeUrl,
          liveDemo: createVideoDto.liveDemo,
          videoType: createVideoDto.videoType,
          prerequisites: createVideoDto.prerequisites,
          learningOutcomes: createVideoDto.learningOutcomes,
          viewCount: 0,
          likeCount: 0,
          commentCount: 0,
          creator: {
            connect: { id: createVideoDto.creatorId },
          },
          ...(createVideoDto.seriesId && {
            series: {
              connect: { id: createVideoDto.seriesId },
            },
            seriesOrder: createVideoDto.seriesOrder,
          }),
          ...(createVideoDto.languageId && {
            language: {
              connect: { id: createVideoDto.languageId },
            },
          }),
          publishedAt: new Date(),
        },
      });

      return video;
    } catch (error) {
      this.logger.error(`创建视频失败: ${error.message}`, error.stack);
      throw new BadRequestException(`创建视频失败: ${error.message}`);
    }
  }

  /**
   * 获取视频列表
   * @param queryParams 查询参数
   * @returns 视频列表及分页信息
   */
  async getVideos(queryParams: VideoQueryParams) {
    const {
      creatorId,
      videoType,
      difficultyLevel,
      seriesId,
      languageId,
      searchTerm,
      page = 1,
      limit = 10,
      sortBy = 'newest',
    } = queryParams;

    // 构建过滤条件
    const where: any = {
      visibility: VideoVisibility.PUBLIC,
    };

    if (creatorId) {
      where.creatorId = creatorId;
    }

    if (videoType) {
      where.videoType = videoType;
    }

    if (difficultyLevel) {
      where.difficultyLevel = difficultyLevel;
    }

    if (seriesId) {
      where.seriesId = seriesId;
    }

    if (languageId) {
      where.languageId = languageId;
    }

    if (searchTerm) {
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    // 构建排序条件
    let orderBy: any = {};
    switch (sortBy) {
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'popular':
        orderBy = { likeCount: 'desc' };
        break;
      case 'views':
        orderBy = { viewCount: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    // 计算分页
    const skip = (page - 1) * limit;

    try {
      const [videos, total] = await Promise.all([
        this.prismaService.video.findMany({
          where,
          orderBy,
          skip,
          take: limit,
          include: {
            creator: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
            _count: {
              select: {
                comments: true,
                likes: true,
              },
            },
          },
        }),
        this.prismaService.video.count({ where }),
      ]);

      // 格式化响应数据
      const formattedVideos = videos.map(video => ({
        ...video,
        commentsCount: video._count.comments,
        likesCount: video._count.likes,
        _count: undefined,
      }));

      return {
        videos: formattedVideos,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(`获取视频列表失败: ${error.message}`, error.stack);
      throw new BadRequestException(`获取视频列表失败: ${error.message}`);
    }
  }

  /**
   * 根据ID获取视频详情
   * @param id 视频ID
   * @returns 视频详情
   */
  async getVideoById(id: string) {
    try {
      const video = await this.prismaService.video.findUnique({
        where: { id },
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              avatar: true,
              bio: true,
            },
          },
          series: {
            select: {
              id: true,
              title: true,
              videos: {
                select: {
                  id: true,
                  title: true,
                  thumbnailUrl: true,
                  duration: true,
                  seriesOrder: true,
                },
                orderBy: {
                  seriesOrder: 'asc',
                },
              },
            },
          },
          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          codeSnippets: true,
          resources: true,
          chapters: {
            orderBy: {
              order: 'asc',
            },
          },
        },
      });

      if (!video) {
        throw new NotFoundException(`未找到ID为 ${id} 的视频`);
      }

      // 格式化标签数据
      const formattedVideo = {
        ...video,
        tags: video.tags.map(tag => tag.tag),
      };

      // 更新浏览量
      await this.incrementViewCount(id);

      return formattedVideo;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`获取视频详情失败: ${error.message}`, error.stack);
      throw new BadRequestException(`获取视频详情失败: ${error.message}`);
    }
  }

  /**
   * 更新视频信息
   * @param id 视频ID
   * @param updateVideoDto 更新数据
   * @returns 更新后的视频信息
   */
  async updateVideo(id: string, updateVideoDto: UpdateVideoDto) {
    try {
      // 检查视频是否存在
      const existingVideo = await this.prismaService.video.findUnique({
        where: { id },
      });

      if (!existingVideo) {
        throw new NotFoundException(`未找到ID为 ${id} 的视频`);
      }

      // 准备更新数据
      const updateData: any = { ...updateVideoDto };

      // 处理系列关联
      if ('seriesId' in updateVideoDto) {
        if (updateVideoDto.seriesId) {
          updateData.series = {
            connect: { id: updateVideoDto.seriesId },
          };
        } else {
          updateData.series = {
            disconnect: true,
          };
        }
        delete updateData.seriesId;
      }

      // 处理语言关联
      if ('languageId' in updateVideoDto) {
        if (updateVideoDto.languageId) {
          updateData.language = {
            connect: { id: updateVideoDto.languageId },
          };
        } else {
          updateData.language = {
            disconnect: true,
          };
        }
        delete updateData.languageId;
      }

      // 执行更新
      const updatedVideo = await this.prismaService.video.update({
        where: { id },
        data: updateData,
      });

      return updatedVideo;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`更新视频失败: ${error.message}`, error.stack);
      throw new BadRequestException(`更新视频失败: ${error.message}`);
    }
  }

  /**
   * 删除视频
   * @param id 视频ID
   * @returns 成功消息
   */
  async deleteVideo(id: string) {
    try {
      // 检查视频是否存在
      const existingVideo = await this.prismaService.video.findUnique({
        where: { id },
      });

      if (!existingVideo) {
        throw new NotFoundException(`未找到ID为 ${id} 的视频`);
      }

      // 删除视频
      await this.prismaService.video.delete({
        where: { id },
      });

      return { message: '视频删除成功' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`删除视频失败: ${error.message}`, error.stack);
      throw new BadRequestException(`删除视频失败: ${error.message}`);
    }
  }

  /**
   * 增加视频浏览量
   * @param id 视频ID
   */
  private async incrementViewCount(id: string): Promise<void> {
    await this.prismaService.video.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  }
}
