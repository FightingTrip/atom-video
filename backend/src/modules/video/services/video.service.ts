/**
 * 视频服务模块
 *
 * 提供视频相关的业务逻辑实现
 * @module video/services/video
 */

import {
  VideoDetail,
  VideoListItem,
  VideoSearchDto,
  CreateVideoDto,
  UpdateVideoDto,
  buildVideoWhereClause,
} from '../models/video.model';
import {
  getPrismaClient,
  withDbClient,
  getPaginationParams,
  performTransaction,
} from '../../common/utils/db-helpers';
import { NotFoundError, ForbiddenError, ValidationError } from '../../common/utils/app-error';
import { removeNullUndefined } from '../../common/utils/helpers';
import { UserRole } from '../../common/middleware/auth.middleware';

/**
 * 视频服务类
 * 管理视频相关的业务逻辑操作
 */
export class VideoService {
  /**
   * 获取视频详情
   * @param id 视频ID
   * @param userId 当前用户ID（可选）
   * @returns 视频详情
   * @throws NotFoundError 视频不存在
   * @throws ForbiddenError 用户无权访问该视频
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

      // 增加视频浏览量
      await prisma.video.update({
        where: { id },
        data: { views: { increment: 1 } },
      });

      // 格式化视频标签
      const tags = video.videoTags.map(vt => vt.tag);

      // 格式化技术栈
      const technologies = video.videoTechnologies.map(vt => vt.technology);

      // 如果视频属于系列，获取系列信息和下一个视频
      let seriesData = null;

      if (video.seriesId) {
        const seriesInfo = await prisma.series.findUnique({
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

        if (seriesInfo) {
          const series = {
            id: seriesInfo.id,
            title: seriesInfo.title,
            videosCount: seriesInfo.videos.length,
          };

          // 查找下一个视频
          let nextVideo = undefined;
          if (video.seriesOrder !== null) {
            const nextVideoInSeries = seriesInfo.videos.find(
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

          seriesData = { series, nextVideo };
        }
      }

      // 获取用户特定信息（如点赞、保存、观看进度）
      let isLiked = false;
      let isSaved = false;
      let watchProgress = null;

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
        const progress = await prisma.videoProgress.findFirst({
          where: {
            videoId: id,
            userId,
          },
        });

        if (progress) {
          watchProgress = {
            currentTime: progress.currentTime,
            isCompleted: progress.isCompleted,
            watchedAt: progress.updatedAt,
          };
        }
      }

      // 返回格式化后的视频详情
      const videoDetail: VideoDetail = {
        id: video.id,
        title: video.title,
        description: video.description || '',
        thumbnailUrl: video.thumbnailUrl || '',
        videoUrl: video.videoUrl,
        duration: video.duration,
        views: video.views,
        likesCount: video.likesCount,
        commentsCount: video.commentsCount,
        visibility: video.visibility,
        createdAt: video.createdAt,
        updatedAt: video.updatedAt,
        creator: {
          id: video.creator.id,
          username: video.creator.username,
          name: video.creator.name || video.creator.username,
          avatarUrl: video.creator.avatarUrl || '',
          isVerified: video.creator.isVerified || false,
        },
        isLiked,
        isSaved,
        tags,
        technologies,
        programmingLanguage: video.programmingLanguage
          ? {
              id: video.programmingLanguage.id,
              name: video.programmingLanguage.name,
              iconUrl: video.programmingLanguage.iconUrl || '',
            }
          : undefined,
        difficulty: video.difficulty || 'INTERMEDIATE',
        series: video.seriesId
          ? {
              id: video.seriesId,
              title: seriesData?.series.title || '',
            }
          : undefined,
        watchProgress,
        chapters: video.chapters,
        codeSnippets: video.codeSnippets,
        resources: video.resources,
        contentAccuracy: video.contentAccuracy,
        seriesData,
      };

      return videoDetail;
    });
  }

  /**
   * 获取视频列表
   * @param params 搜索参数
   * @param userId 当前用户ID（可选）
   * @returns 视频列表和总数
   */
  async getVideos(
    params: VideoSearchDto,
    userId?: string
  ): Promise<{ items: VideoListItem[]; total: number }> {
    return withDbClient(async prisma => {
      // 构建查询条件
      const where = buildVideoWhereClause(params);

      // 获取分页参数
      const { skip, take } = getPaginationParams(params.page, params.pageSize);

      // 构建排序条件
      let orderBy: any = { createdAt: 'desc' };
      if (params.sortBy) {
        switch (params.sortBy) {
          case 'views':
            orderBy = { views: 'desc' };
            break;
          case 'likesCount':
            orderBy = { likesCount: 'desc' };
            break;
          case 'trending':
            // trending算法可能更复杂，这里简化处理
            orderBy = [{ views: 'desc' }, { likesCount: 'desc' }];
            break;
          default:
            orderBy = { createdAt: 'desc' };
        }
      }

      // 查询视频总数
      const total = await prisma.video.count({ where });

      // 查询视频列表
      const videos = await prisma.video.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              name: true,
              avatarUrl: true,
              isVerified: true,
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
          programmingLanguage: {
            select: {
              id: true,
              name: true,
              iconUrl: true,
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

      // 获取用户特定信息
      let userLikes: Record<string, boolean> = {};
      let userSaved: Record<string, boolean> = {};

      if (userId && videos.length > 0) {
        const videoIds = videos.map(v => v.id);

        // 获取用户点赞信息
        const likes = await prisma.like.findMany({
          where: {
            videoId: { in: videoIds },
            userId,
          },
          select: {
            videoId: true,
          },
        });

        userLikes = likes.reduce(
          (acc, like) => {
            acc[like.videoId] = true;
            return acc;
          },
          {} as Record<string, boolean>
        );

        // 获取用户保存信息
        const saved = await prisma.savedVideo.findMany({
          where: {
            videoId: { in: videoIds },
            userId,
          },
          select: {
            videoId: true,
          },
        });

        userSaved = saved.reduce(
          (acc, save) => {
            acc[save.videoId] = true;
            return acc;
          },
          {} as Record<string, boolean>
        );
      }

      // 格式化视频列表
      const items: VideoListItem[] = videos.map(video => ({
        id: video.id,
        title: video.title,
        description: video.description || '',
        thumbnailUrl: video.thumbnailUrl || '',
        duration: video.duration,
        views: video.views,
        likesCount: video.likesCount,
        commentsCount: video.commentsCount,
        visibility: video.visibility,
        createdAt: video.createdAt,
        updatedAt: video.updatedAt,
        creator: {
          id: video.creator.id,
          username: video.creator.username,
          name: video.creator.name || video.creator.username,
          avatarUrl: video.creator.avatarUrl || '',
          isVerified: video.creator.isVerified || false,
        },
        isLiked: userLikes[video.id] || false,
        isSaved: userSaved[video.id] || false,
        tags: video.videoTags.map(vt => vt.tag),
        technologies: video.videoTechnologies.map(vt => vt.technology),
        programmingLanguage: video.programmingLanguage
          ? {
              id: video.programmingLanguage.id,
              name: video.programmingLanguage.name,
              iconUrl: video.programmingLanguage.iconUrl || '',
            }
          : undefined,
        difficulty: video.difficulty || 'INTERMEDIATE',
        series: video.series
          ? {
              id: video.series.id,
              title: video.series.title,
            }
          : undefined,
      }));

      return { items, total };
    });
  }

  /**
   * 创建新视频
   * @param data 视频数据
   * @param userId 创建者ID
   * @returns 创建的视频
   * @throws ValidationError 数据验证失败
   */
  async createVideo(data: CreateVideoDto, userId: string): Promise<VideoDetail> {
    return performTransaction(async prisma => {
      // 验证用户是否存在
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundError('用户不存在');
      }

      // 如果指定了系列，验证系列是否存在
      if (data.seriesId) {
        const series = await prisma.series.findUnique({
          where: { id: data.seriesId },
        });

        if (!series) {
          throw new NotFoundError('指定的系列不存在');
        }

        // 验证系列所有者
        if (series.creatorId !== userId && user.role !== UserRole.ADMIN) {
          throw new ForbiddenError('无权将视频添加到此系列');
        }
      }

      // 创建视频基础信息
      const video = await prisma.video.create({
        data: {
          title: data.title,
          description: data.description || '',
          thumbnailUrl: data.thumbnailUrl || '',
          videoUrl: data.videoUrl,
          duration: data.duration,
          visibility: data.visibility || 'PUBLIC',
          difficulty: data.difficulty || 'INTERMEDIATE',
          creatorId: userId,
          seriesId: data.seriesId || null,
          seriesOrder: data.seriesId && data.seriesOrder !== undefined ? data.seriesOrder : null,
          programmingLanguageId: data.programmingLanguageId || null,
        },
      });

      // 处理标签
      if (data.tags && data.tags.length > 0) {
        for (const tagName of data.tags) {
          // 查找或创建标签
          let tag = await prisma.techTag.findFirst({
            where: {
              name: {
                equals: tagName,
                mode: 'insensitive',
              },
            },
          });

          if (!tag) {
            // 创建slug (URL友好的标识符)
            const slug = tagName
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '');

            tag = await prisma.techTag.create({
              data: {
                name: tagName,
                slug,
              },
            });
          }

          // 关联标签和视频
          await prisma.videoTag.create({
            data: {
              videoId: video.id,
              tagId: tag.id,
            },
          });
        }
      }

      // 处理技术栈
      if (data.technologies && data.technologies.length > 0) {
        for (const techId of data.technologies) {
          // 验证技术是否存在
          const tech = await prisma.technology.findUnique({
            where: { id: techId },
          });

          if (tech) {
            // 关联技术和视频
            await prisma.videoTechnology.create({
              data: {
                videoId: video.id,
                technologyId: techId,
              },
            });
          }
        }
      }

      // 处理章节
      if (data.chapters && data.chapters.length > 0) {
        for (const chapter of data.chapters) {
          await prisma.chapter.create({
            data: {
              title: chapter.title,
              startTime: chapter.startTime,
              endTime: chapter.endTime,
              order: chapter.order,
              videoId: video.id,
            },
          });
        }
      }

      // 处理资源
      if (data.resources && data.resources.length > 0) {
        for (const resource of data.resources) {
          await prisma.resource.create({
            data: {
              title: resource.title,
              resourceType: resource.resourceType,
              url: resource.url,
              videoId: video.id,
            },
          });
        }
      }

      // 返回创建的视频详情
      return this.getVideoById(video.id, userId);
    });
  }

  /**
   * 更新视频
   * @param id 视频ID
   * @param data 更新数据
   * @param userId 用户ID
   * @returns 更新后的视频
   * @throws NotFoundError 视频不存在
   * @throws ForbiddenError 用户无权更新该视频
   */
  async updateVideo(id: string, data: UpdateVideoDto, userId: string): Promise<VideoDetail> {
    return performTransaction(async prisma => {
      // 验证视频是否存在
      const video = await prisma.video.findUnique({
        where: { id },
        include: {
          videoTags: true,
          videoTechnologies: true,
          chapters: true,
          resources: true,
        },
      });

      if (!video) {
        throw new NotFoundError('视频不存在');
      }

      // 验证权限
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundError('用户不存在');
      }

      if (video.creatorId !== userId && user.role !== UserRole.ADMIN) {
        throw new ForbiddenError('无权更新该视频');
      }

      // 更新视频基础信息
      const updateData: any = {};

      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.thumbnailUrl !== undefined) updateData.thumbnailUrl = data.thumbnailUrl;
      if (data.videoUrl !== undefined) updateData.videoUrl = data.videoUrl;
      if (data.duration !== undefined) updateData.duration = data.duration;
      if (data.visibility !== undefined) updateData.visibility = data.visibility;
      if (data.difficulty !== undefined) updateData.difficulty = data.difficulty;
      if (data.programmingLanguageId !== undefined)
        updateData.programmingLanguageId = data.programmingLanguageId || null;

      // 更新系列信息
      if (data.seriesId !== undefined) {
        updateData.seriesId = data.seriesId || null;

        if (data.seriesId) {
          // 验证系列是否存在
          const series = await prisma.series.findUnique({
            where: { id: data.seriesId },
          });

          if (!series) {
            throw new NotFoundError('指定的系列不存在');
          }

          // 验证系列所有者
          if (series.creatorId !== userId && user.role !== UserRole.ADMIN) {
            throw new ForbiddenError('无权将视频添加到此系列');
          }
        }
      }

      // 更新系列顺序
      if (data.seriesOrder !== undefined && updateData.seriesId !== null) {
        updateData.seriesOrder = data.seriesOrder;
      }

      // 更新视频基础信息
      await prisma.video.update({
        where: { id },
        data: updateData,
      });

      // 更新标签
      if (data.tags !== undefined) {
        // 删除旧标签关联
        await prisma.videoTag.deleteMany({
          where: { videoId: id },
        });

        // 添加新标签
        if (data.tags && data.tags.length > 0) {
          for (const tagName of data.tags) {
            // 查找或创建标签
            let tag = await prisma.techTag.findFirst({
              where: {
                name: {
                  equals: tagName,
                  mode: 'insensitive',
                },
              },
            });

            if (!tag) {
              // 创建slug (URL友好的标识符)
              const slug = tagName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

              tag = await prisma.techTag.create({
                data: {
                  name: tagName,
                  slug,
                },
              });
            }

            // 关联标签和视频
            await prisma.videoTag.create({
              data: {
                videoId: id,
                tagId: tag.id,
              },
            });
          }
        }
      }

      // 更新技术栈
      if (data.technologies !== undefined) {
        // 删除旧技术关联
        await prisma.videoTechnology.deleteMany({
          where: { videoId: id },
        });

        // 添加新技术
        if (data.technologies && data.technologies.length > 0) {
          for (const techId of data.technologies) {
            // 验证技术是否存在
            const tech = await prisma.technology.findUnique({
              where: { id: techId },
            });

            if (tech) {
              // 关联技术和视频
              await prisma.videoTechnology.create({
                data: {
                  videoId: id,
                  technologyId: techId,
                },
              });
            }
          }
        }
      }

      // 更新章节
      if (data.chapters !== undefined) {
        // 删除旧章节
        await prisma.chapter.deleteMany({
          where: { videoId: id },
        });

        // 添加新章节
        if (data.chapters && data.chapters.length > 0) {
          for (const chapter of data.chapters) {
            await prisma.chapter.create({
              data: {
                title: chapter.title,
                startTime: chapter.startTime,
                endTime: chapter.endTime,
                order: chapter.order,
                videoId: id,
              },
            });
          }
        }
      }

      // 更新资源
      if (data.resources !== undefined) {
        // 删除旧资源
        await prisma.resource.deleteMany({
          where: { videoId: id },
        });

        // 添加新资源
        if (data.resources && data.resources.length > 0) {
          for (const resource of data.resources) {
            await prisma.resource.create({
              data: {
                title: resource.title,
                resourceType: resource.resourceType,
                url: resource.url,
                videoId: id,
              },
            });
          }
        }
      }

      // 返回更新后的视频详情
      return this.getVideoById(id, userId);
    });
  }

  /**
   * 删除视频
   * @param id 视频ID
   * @param userId 用户ID
   * @throws NotFoundError 视频不存在
   * @throws ForbiddenError 用户无权删除该视频
   */
  async deleteVideo(id: string, userId: string): Promise<void> {
    return performTransaction(async prisma => {
      // 验证视频是否存在
      const video = await prisma.video.findUnique({
        where: { id },
      });

      if (!video) {
        throw new NotFoundError('视频不存在');
      }

      // 验证权限
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundError('用户不存在');
      }

      if (video.creatorId !== userId && user.role !== UserRole.ADMIN) {
        throw new ForbiddenError('无权删除该视频');
      }

      // 级联删除相关数据
      // 删除标签关联
      await prisma.videoTag.deleteMany({
        where: { videoId: id },
      });

      // 删除技术关联
      await prisma.videoTechnology.deleteMany({
        where: { videoId: id },
      });

      // 删除章节
      await prisma.chapter.deleteMany({
        where: { videoId: id },
      });

      // 删除资源
      await prisma.resource.deleteMany({
        where: { videoId: id },
      });

      // 删除点赞
      await prisma.like.deleteMany({
        where: { videoId: id },
      });

      // 删除评论点赞
      await prisma.commentLike.deleteMany({
        where: {
          comment: {
            videoId: id,
          },
        },
      });

      // 删除评论
      await prisma.comment.deleteMany({
        where: { videoId: id },
      });

      // 删除保存
      await prisma.savedVideo.deleteMany({
        where: { videoId: id },
      });

      // 删除观看进度
      await prisma.videoProgress.deleteMany({
        where: { videoId: id },
      });

      // 删除视频
      await prisma.video.delete({
        where: { id },
      });
    });
  }

  /**
   * 更新视频观看进度
   * @param videoId 视频ID
   * @param userId 用户ID
   * @param currentTime 当前播放时间
   * @param isCompleted 是否已完成观看
   * @returns 更新后的进度信息
   * @throws NotFoundError 视频不存在
   */
  async updateVideoProgress(
    videoId: string,
    userId: string,
    currentTime: number,
    isCompleted?: boolean
  ) {
    return withDbClient(async prisma => {
      // 验证视频是否存在
      const video = await prisma.video.findUnique({
        where: { id: videoId },
      });

      if (!video) {
        throw new NotFoundError('视频不存在');
      }

      // 确定是否完成观看
      let videoCompleted = isCompleted;
      if (videoCompleted === undefined && currentTime > 0 && video.duration > 0) {
        // 如果播放进度超过95%，自动标记为已完成
        videoCompleted = currentTime >= video.duration * 0.95;
      }

      // 查找现有进度记录
      const existingProgress = await prisma.videoProgress.findFirst({
        where: {
          videoId,
          userId,
        },
      });

      // 更新或创建进度记录
      if (existingProgress) {
        return prisma.videoProgress.update({
          where: { id: existingProgress.id },
          data: {
            currentTime,
            isCompleted: videoCompleted || false,
          },
        });
      } else {
        return prisma.videoProgress.create({
          data: {
            videoId,
            userId,
            currentTime,
            isCompleted: videoCompleted || false,
          },
        });
      }
    });
  }
}
