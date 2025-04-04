import { PrismaClient, Video } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import logger from '../utils/logger';
import { processVideo } from '../utils/video';
import { uploadToStorage } from '../utils/storage';

const prisma = new PrismaClient();

export class VideoService {
  // 创建视频
  static async createVideo(
    userId: string,
    title: string,
    description: string,
    file: Express.Multer.File
  ): Promise<Video> {
    try {
      // 处理视频文件
      const { videoPath, thumbnailPath, duration } = await processVideo(file);

      // 上传到存储
      const videoUrl = await uploadToStorage(videoPath, 'videos');
      const thumbnailUrl = await uploadToStorage(thumbnailPath, 'thumbnails');

      // 创建视频记录
      const video = await prisma.video.create({
        data: {
          title,
          description,
          url: videoUrl,
          thumbnailUrl,
          duration,
          userId,
        },
      });

      return video;
    } catch (error) {
      logger.error('创建视频失败:', error);
      throw error;
    }
  }

  // 获取视频详情
  static async getVideoById(id: string): Promise<Video> {
    try {
      const video = await prisma.video.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
          comments: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  avatar: true,
                },
              },
            },
          },
          likes: true,
        },
      });

      if (!video) {
        throw new AppError(404, '视频不存在');
      }

      return video;
    } catch (error) {
      logger.error('获取视频详情失败:', error);
      throw error;
    }
  }

  // 更新视频信息
  static async updateVideo(id: string, userId: string, data: Partial<Video>): Promise<Video> {
    try {
      const video = await prisma.video.findUnique({
        where: { id },
      });

      if (!video) {
        throw new AppError(404, '视频不存在');
      }

      if (video.userId !== userId) {
        throw new AppError(403, '无权修改此视频');
      }

      const updatedVideo = await prisma.video.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });

      return updatedVideo;
    } catch (error) {
      logger.error('更新视频信息失败:', error);
      throw error;
    }
  }

  // 删除视频
  static async deleteVideo(id: string, userId: string): Promise<void> {
    try {
      const video = await prisma.video.findUnique({
        where: { id },
      });

      if (!video) {
        throw new AppError(404, '视频不存在');
      }

      if (video.userId !== userId) {
        throw new AppError(403, '无权删除此视频');
      }

      await prisma.video.delete({
        where: { id },
      });
    } catch (error) {
      logger.error('删除视频失败:', error);
      throw error;
    }
  }

  // 获取视频列表
  static async getVideos(page: number = 1, limit: number = 10, userId?: string) {
    try {
      const where = userId ? { userId } : {};

      const [videos, total] = await Promise.all([
        prisma.video.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
            likes: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.video.count({ where }),
      ]);

      return {
        videos,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      logger.error('获取视频列表失败:', error);
      throw error;
    }
  }

  // 点赞/取消点赞视频
  static async toggleLike(videoId: string, userId: string): Promise<boolean> {
    try {
      const existingLike = await prisma.like.findUnique({
        where: {
          userId_videoId: {
            userId,
            videoId,
          },
        },
      });

      if (existingLike) {
        // 取消点赞
        await prisma.like.delete({
          where: {
            userId_videoId: {
              userId,
              videoId,
            },
          },
        });
        return false;
      } else {
        // 添加点赞
        await prisma.like.create({
          data: {
            userId,
            videoId,
          },
        });
        return true;
      }
    } catch (error) {
      logger.error('点赞操作失败:', error);
      throw error;
    }
  }
}
