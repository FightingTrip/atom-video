/**
 * 视频服务模块
 *
 * 提供视频相关的业务逻辑实现
 * @module video/services/video
 */

import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { VideoVisibility, VideoType, DifficultyLevel } from '../../../models/enums';
import { formatError } from '../../../utils/error-handler.util';
import { Prisma } from '@prisma/client';

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
    } catch (error: unknown) {
      const { message, stack } = formatError(error);
      this.logger.error(`创建视频失败: ${message}`, stack);
      throw new BadRequestException(`创建视频失败: ${message}`);
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
    const where: Prisma.VideoWhereInput = {
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
    let orderBy: Prisma.VideoOrderByWithRelationInput = {};
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
                avatarUrl: true,
              },
            },
            // 为计数而包含关系
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

      // 格式化响应数据，使用_count正确获取计数
      const formattedVideos = videos.map(video => {
        // 从视频对象中提取_count
        const { _count, ...videoData } = video;

        // 返回格式化后的对象
        return {
          ...videoData,
          commentsCount: _count?.comments || 0,
          likesCount: _count?.likes || 0,
        };
      });

      return {
        videos: formattedVideos,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error: unknown) {
      const { message, stack } = formatError(error);
      this.logger.error(`获取视频列表失败: ${message}`, stack);
      throw new BadRequestException(`获取视频列表失败: ${message}`);
    }
  }

  /**
   * 根据ID获取视频详情
   * @param id 视频ID
   * @returns 视频详情
   */
  async getVideoById(id: string) {
    try {
      // 检查Prisma模型中的确切字段，只选择存在的字段
      const video = await this.prismaService.video.findUnique({
        where: { id },
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
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
          // 使用Prisma模型中正确定义的VideoTag关系
          tags: {
            include: {
              tag: true,
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

      // 安全地格式化数据
      const formattedVideo = {
        ...video,
        tags: video.tags?.map(vt => vt.tag) || [],
      };

      // 更新浏览量
      await this.incrementViewCount(id);

      return formattedVideo;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const { message, stack } = formatError(error);
      this.logger.error(`获取视频详情失败: ${message}`, stack);
      throw new BadRequestException(`获取视频详情失败: ${message}`);
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
      const updateData: Prisma.VideoUpdateInput = {};

      // 复制基本字段
      if (updateVideoDto.title) updateData.title = updateVideoDto.title;
      if (updateVideoDto.description !== undefined)
        updateData.description = updateVideoDto.description;
      if (updateVideoDto.thumbnailUrl) updateData.thumbnailUrl = updateVideoDto.thumbnailUrl;
      if (updateVideoDto.visibility) updateData.visibility = updateVideoDto.visibility;
      if (updateVideoDto.difficultyLevel)
        updateData.difficultyLevel = updateVideoDto.difficultyLevel;
      if (updateVideoDto.sourceCodeUrl !== undefined)
        updateData.sourceCodeUrl = updateVideoDto.sourceCodeUrl;
      if (updateVideoDto.liveDemo !== undefined) updateData.liveDemo = updateVideoDto.liveDemo;
      if (updateVideoDto.videoType) updateData.videoType = updateVideoDto.videoType;
      if (updateVideoDto.prerequisites !== undefined)
        updateData.prerequisites = updateVideoDto.prerequisites;
      if (updateVideoDto.learningOutcomes !== undefined)
        updateData.learningOutcomes = updateVideoDto.learningOutcomes;
      if (updateVideoDto.seriesOrder !== undefined)
        updateData.seriesOrder = updateVideoDto.seriesOrder;

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
      }

      // 执行更新
      const updatedVideo = await this.prismaService.video.update({
        where: { id },
        data: updateData,
      });

      return updatedVideo;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const { message, stack } = formatError(error);
      this.logger.error(`更新视频失败: ${message}`, stack);
      throw new BadRequestException(`更新视频失败: ${message}`);
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
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const { message, stack } = formatError(error);
      this.logger.error(`删除视频失败: ${message}`, stack);
      throw new BadRequestException(`删除视频失败: ${message}`);
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
