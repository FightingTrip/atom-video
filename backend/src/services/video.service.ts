import {
  VideoDetail,
  VideoListItem,
  VideoSearchDto,
  CreateVideoDto,
  UpdateVideoDto,
} from '../models/video.model';
import {
  getPrismaClient,
  withDbClient,
  getPaginationParams,
  buildSearchCondition,
} from '../utils/db-helpers';
import { NotFoundError, ForbiddenError } from '../utils/app-error';
import { removeNullUndefined } from '../utils/helpers';

/**
 * 视频服务 - 管理视频相关操作
 */
export class VideoService {
  /**
   * 获取视频详情
   * @param id 视频ID
   * @param userId 当前用户ID（可选）
   * @returns 视频详情
   */
  async getVideoById(id: string, userId?: string): Promise<VideoDetail> {
    return withDbClient(async prisma => {
      // 获取视频基本信息
      const video = await prisma.video.findUnique({
        where: { id },
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              name: true,
              avatarUrl: true,
              bio: true,
              isVerified: true,
              isCreator: true,
              channelDescription: true,
              channelBannerUrl: true,
              createdAt: true,
            },
          },
          chapters: {
            orderBy: { order: 'asc' },
            select: {
              id: true,
              title: true,
              startTime: true,
              endTime: true,
              order: true,
            },
          },
          videoTags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
          videoTechnologies: {
            include: {
              technology: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  iconUrl: true,
                },
              },
            },
          },
          codeSnippets: {
            select: {
              id: true,
              title: true,
              language: true,
              startTime: true,
              endTime: true,
            },
          },
          resources: {
            select: {
              id: true,
              title: true,
              resourceType: true,
              url: true,
            },
          },
          contentAccuracy: true,
          programmingLanguage: {
            select: {
              id: true,
              name: true,
              iconUrl: true,
            },
          },
        },
      });

      if (!video) {
        throw new NotFoundError('视频未找到');
      }

      // 检查视频可见性
      if (
        video.visibility !== 'PUBLIC' &&
        (!userId || (userId !== video.creatorId && video.visibility === 'PRIVATE'))
      ) {
        throw new ForbiddenError('该视频不可访问');
      }

      // 格式化视频标签
      const tags = video.videoTags.map(vt => vt.tag);

      // 格式化技术栈
      const technologies = video.videoTechnologies.map(vt => vt.technology);

      // 如果视频属于系列，获取系列信息和下一个视频
      let series = null;
      let nextVideo = null;

      if (video.seriesId) {
        const seriesData = await prisma.series.findUnique({
          where: { id: video.seriesId },
          include: {
            videos: {
              orderBy: { seriesOrder: 'asc' },
              select: {
                id: true,
                title: true,
                thumbnailUrl: true,
                seriesOrder: true,
              },
            },
          },
        });

        if (seriesData) {
          // 系列信息
          series = {
            id: seriesData.id,
            title: seriesData.title,
            videosCount: seriesData.videos.length,
          };

          // 查找下一个视频
          if (video.seriesOrder !== null) {
            const nextVideoInSeries = seriesData.videos.find(
              v => v.seriesOrder === (video.seriesOrder ?? 0) + 1
            );

            if (nextVideoInSeries) {
              nextVideo = {
                id: nextVideoInSeries.id,
                title: nextVideoInSeries.title,
                thumbnailUrl: nextVideoInSeries.thumbnailUrl,
              };
            }
          }
        }
      }

      // 获取用户特定信息（如点赞、保存、观看进度）
      let isLiked = false;
      let isSaved = false;
      let progress = null;

      if (userId) {
        // 检查用户是否已点赞
        const like = await prisma.like.findFirst({
          where: {
            videoId: id,
            userId,
          },
        });
        isLiked = !!like;

        // 检查用户是否已保存
        const saved = await prisma.savedVideo.findFirst({
          where: {
            videoId: id,
            userId,
          },
        });
        isSaved = !!saved;

        // 获取观看进度
        const videoProgress = await prisma.videoProgress.findFirst({
          where: {
            videoId: id,
            userId,
          },
        });

        if (videoProgress) {
          progress = {
            currentTime: videoProgress.currentTime,
            isCompleted: videoProgress.isCompleted,
            completedAt: videoProgress.completedAt,
          };
        }

        // 更新观看历史
        await prisma.watchHistory.upsert({
          where: {
            userId_videoId: {
              userId,
              videoId: id,
            },
          },
          update: {
            lastWatchedAt: new Date(),
          },
          create: {
            userId,
            videoId: id,
            lastWatchedAt: new Date(),
          },
        });

        // 仅在访问者不是创作者时增加浏览量
        if (userId !== video.creatorId) {
          await prisma.video.update({
            where: { id },
            data: {
              viewCount: {
                increment: 1,
              },
            },
          });
        }
      }

      // 构建完整的视频详情响应
      return {
        ...video,
        tags,
        technologies,
        series,
        nextVideo,
        isLiked,
        isSaved,
        progress,
      } as VideoDetail;
    });
  }

  /**
   * 获取视频列表
   * @param params 搜索参数
   * @param userId 当前用户ID（可选）
   * @returns 分页视频列表和总数
   */
  async getVideos(
    params: VideoSearchDto,
    userId?: string
  ): Promise<{ items: VideoListItem[]; total: number }> {
    return withDbClient(async prisma => {
      const {
        query,
        categories,
        tags,
        difficultyLevels,
        videoTypes,
        programmingLanguages,
        technologies,
        creatorId,
        duration,
        sortBy = 'newest',
        page = 1,
        pageSize = 10,
      } = params;

      // 处理分页参数
      const { skip, take } = getPaginationParams(page, pageSize);

      // 构建查询条件
      const where: any = {
        visibility: 'PUBLIC', // 默认只显示公开视频
      };

      // 如果提供了用户ID，添加查看自己的私人视频的条件
      if (userId) {
        where.OR = [
          { visibility: 'PUBLIC' },
          { visibility: 'UNLISTED' },
          { visibility: 'MEMBERS_ONLY' },
          { creatorId: userId, visibility: 'PRIVATE' },
        ];
      }

      // 如果提供了查询词，添加搜索条件
      if (query) {
        const searchFields = ['title', 'description'];
        const searchCondition = buildSearchCondition(query, searchFields);

        // 合并搜索条件
        where.AND = [...(where.AND || []), searchCondition];
      }

      // 添加其他筛选条件
      if (categories?.length) {
        where.videoCategories = {
          some: {
            categoryId: {
              in: categories,
            },
          },
        };
      }

      if (tags?.length) {
        where.videoTags = {
          some: {
            tag: {
              name: {
                in: tags,
              },
            },
          },
        };
      }

      if (difficultyLevels?.length) {
        where.difficultyLevel = {
          in: difficultyLevels,
        };
      }

      if (videoTypes?.length) {
        where.videoType = {
          in: videoTypes,
        };
      }

      if (programmingLanguages?.length) {
        where.languageId = {
          in: programmingLanguages,
        };
      }

      if (technologies?.length) {
        where.videoTechnologies = {
          some: {
            technologyId: {
              in: technologies,
            },
          },
        };
      }

      if (creatorId) {
        where.creatorId = creatorId;
      }

      // 处理时长筛选
      if (duration) {
        const durationFilter: any = {};

        if (duration.min !== undefined) {
          durationFilter.gte = duration.min;
        }

        if (duration.max !== undefined) {
          durationFilter.lte = duration.max;
        }

        if (Object.keys(durationFilter).length > 0) {
          where.duration = durationFilter;
        }
      }

      // 处理排序
      const orderBy: any = {};

      switch (sortBy) {
        case 'newest':
          orderBy.publishedAt = 'desc';
          break;
        case 'oldest':
          orderBy.publishedAt = 'asc';
          break;
        case 'popular':
          orderBy.viewCount = 'desc';
          break;
        case 'trending':
          // 使用创建时间和观看量的组合排序（可自定义调整）
          orderBy.viewCount = 'desc';
          // 可以添加更多排序条件
          break;
        case 'rating':
          orderBy.likeCount = 'desc';
          break;
        default:
          orderBy.publishedAt = 'desc';
      }

      // 查询总数
      const total = await prisma.video.count({ where });

      // 查询视频列表
      const videos = await prisma.video.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              name: true,
              avatarUrl: true,
            },
          },
          programmingLanguage: {
            select: {
              id: true,
              name: true,
              iconUrl: true,
            },
          },
          videoTechnologies: {
            take: 3, // 限制显示的技术数量
            include: {
              technology: {
                select: {
                  id: true,
                  name: true,
                  iconUrl: true,
                },
              },
            },
          },
          series: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      // 格式化响应
      const items = videos.map(video => {
        return {
          id: video.id,
          title: video.title,
          description: video.description,
          thumbnailUrl: video.thumbnailUrl,
          duration: video.duration,
          difficultyLevel: video.difficultyLevel,
          videoType: video.videoType,
          viewCount: video.viewCount,
          likeCount: video.likeCount,
          publishedAt: video.publishedAt,
          creator: video.creator,
          programmingLanguage: video.programmingLanguage,
          technologies: video.videoTechnologies.map(vt => vt.technology),
          series: video.series,
        } as VideoListItem;
      });

      return { items, total };
    });
  }

  /**
   * 创建新视频
   * @param data 视频创建数据
   * @param userId 创建者ID
   * @returns 创建的视频
   */
  async createVideo(data: CreateVideoDto, userId: string): Promise<VideoDetail> {
    return withDbClient(async prisma => {
      const {
        title,
        description,
        thumbnailUrl,
        videoUrl,
        duration,
        visibility,
        difficultyLevel,
        videoType,
        sourceCodeUrl,
        liveDemo,
        prerequisites,
        learningOutcomes,
        seriesId,
        seriesOrder,
        languageId,
        tags = [],
        categoryIds = [],
      } = data;

      // 如果指定了系列，检查系列是否存在并且属于该用户
      if (seriesId) {
        const series = await prisma.series.findUnique({
          where: { id: seriesId },
        });

        if (!series) {
          throw new NotFoundError('系列未找到');
        }

        if (series.creatorId !== userId) {
          throw new ForbiddenError('无权限将视频添加到此系列');
        }
      }

      // 创建视频
      const video = await prisma.video.create({
        data: {
          title,
          description,
          thumbnailUrl: thumbnailUrl || '', // 提供默认值
          videoUrl,
          duration,
          visibility,
          difficultyLevel,
          videoType,
          sourceCodeUrl,
          liveDemo,
          prerequisites,
          learningOutcomes,
          seriesId,
          seriesOrder,
          languageId,
          creatorId: userId,
          publishedAt: visibility === 'PRIVATE' ? null : new Date(),

          // 创建关联的标签
          videoTags: {
            create: tags.map(tagName => ({
              tag: {
                connectOrCreate: {
                  where: {
                    name: tagName,
                  },
                  create: {
                    name: tagName,
                    slug: tagName.toLowerCase().replace(/\s+/g, '-'),
                  },
                },
              },
            })),
          },

          // 创建关联的分类
          videoCategories: {
            create: categoryIds.map(categoryId => ({
              categoryId,
            })),
          },
        },
      });

      // 返回新创建的视频详情
      return this.getVideoById(video.id, userId);
    });
  }

  /**
   * 更新视频
   * @param id 视频ID
   * @param data 更新数据
   * @param userId 当前用户ID
   * @returns 更新后的视频
   */
  async updateVideo(id: string, data: UpdateVideoDto, userId: string): Promise<VideoDetail> {
    return withDbClient(async prisma => {
      // 检查视频是否存在且属于当前用户
      const existingVideo = await prisma.video.findUnique({
        where: { id },
      });

      if (!existingVideo) {
        throw new NotFoundError('视频未找到');
      }

      if (existingVideo.creatorId !== userId) {
        throw new ForbiddenError('无权限更新此视频');
      }

      // 检查系列权限
      if (data.seriesId) {
        const series = await prisma.series.findUnique({
          where: { id: data.seriesId },
        });

        if (!series) {
          throw new NotFoundError('系列未找到');
        }

        if (series.creatorId !== userId) {
          throw new ForbiddenError('无权限将视频添加到此系列');
        }
      }

      // 处理标签更新
      let videoTags;
      if (data.tags) {
        // 先删除现有标签关联
        await prisma.videoTag.deleteMany({
          where: { videoId: id },
        });

        // 创建新的标签关联
        videoTags = {
          create: data.tags.map(tagName => ({
            tag: {
              connectOrCreate: {
                where: {
                  name: tagName,
                },
                create: {
                  name: tagName,
                  slug: tagName.toLowerCase().replace(/\s+/g, '-'),
                },
              },
            },
          })),
        };
      }

      // 处理分类更新
      let videoCategories;
      if (data.categoryIds) {
        // 先删除现有分类关联
        await prisma.videoCategory.deleteMany({
          where: { videoId: id },
        });

        // 创建新的分类关联
        videoCategories = {
          create: data.categoryIds.map(categoryId => ({
            categoryId,
          })),
        };
      }

      // 检查发布状态变更
      const publishedData: any = {};
      if (!existingVideo.publishedAt && data.visibility && data.visibility !== 'PRIVATE') {
        publishedData.publishedAt = new Date();
      } else if (existingVideo.publishedAt && data.visibility === 'PRIVATE') {
        publishedData.publishedAt = null;
      }

      // 移除null和undefined值
      const updateData = removeNullUndefined({
        ...data,
        ...publishedData,
        videoTags,
        videoCategories,
      });

      // 更新视频
      await prisma.video.update({
        where: { id },
        data: updateData,
      });

      // 返回更新后的视频详情
      return this.getVideoById(id, userId);
    });
  }

  /**
   * 删除视频
   * @param id 视频ID
   * @param userId 当前用户ID
   * @returns 是否成功
   */
  async deleteVideo(id: string, userId: string): Promise<boolean> {
    return withDbClient(async prisma => {
      // 检查视频是否存在且属于当前用户
      const video = await prisma.video.findUnique({
        where: { id },
      });

      if (!video) {
        throw new NotFoundError('视频未找到');
      }

      if (video.creatorId !== userId) {
        throw new ForbiddenError('无权限删除此视频');
      }

      // 开始事务删除视频及相关数据
      await prisma.$transaction([
        // 删除相关关联数据
        prisma.videoTag.deleteMany({ where: { videoId: id } }),
        prisma.videoCategory.deleteMany({ where: { videoId: id } }),
        prisma.videoTechnology.deleteMany({ where: { videoId: id } }),
        prisma.chapter.deleteMany({ where: { videoId: id } }),
        prisma.comment.deleteMany({ where: { videoId: id } }),
        prisma.like.deleteMany({ where: { videoId: id } }),
        prisma.savedVideo.deleteMany({ where: { videoId: id } }),
        prisma.watchHistory.deleteMany({ where: { videoId: id } }),
        prisma.videoProgress.deleteMany({ where: { videoId: id } }),
        prisma.resource.deleteMany({ where: { videoId: id } }),
        prisma.codeSnippet.deleteMany({ where: { videoId: id } }),
        prisma.contentAccuracy.deleteMany({ where: { videoId: id } }),
        prisma.question.deleteMany({ where: { videoId: id } }),

        // 最后删除视频本身
        prisma.video.delete({ where: { id } }),
      ]);

      return true;
    });
  }

  /**
   * 更新视频观看进度
   * @param videoId 视频ID
   * @param userId 用户ID
   * @param currentTime 当前播放时间（秒）
   * @param isCompleted 是否已完成观看
   * @returns 更新后的进度信息
   */
  async updateVideoProgress(
    videoId: string,
    userId: string,
    currentTime: number,
    isCompleted?: boolean
  ): Promise<any> {
    return withDbClient(async prisma => {
      // 检查视频是否存在
      const video = await prisma.video.findUnique({
        where: { id: videoId },
      });

      if (!video) {
        throw new NotFoundError('视频未找到');
      }

      // 确定是否完成
      let completed = isCompleted;
      if (completed === undefined && currentTime >= video.duration * 0.9) {
        // 如果观看了90%以上，自动标记为已完成
        completed = true;
      }

      // 计算完成时间
      const completedAt = completed ? new Date() : null;

      // 更新或创建进度记录
      return prisma.videoProgress.upsert({
        where: {
          userId_videoId: {
            userId,
            videoId,
          },
        },
        update: {
          currentTime,
          isCompleted: completed ?? false,
          ...(completed ? { completedAt } : {}),
          lastUpdated: new Date(),
        },
        create: {
          userId,
          videoId,
          currentTime,
          isCompleted: completed ?? false,
          ...(completed ? { completedAt } : {}),
          lastUpdated: new Date(),
        },
      });
    });
  }
}
