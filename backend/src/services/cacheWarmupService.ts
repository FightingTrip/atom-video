import { redisService } from './redisService';
import { prisma } from '../utils/prisma';
import logger from '../utils/logger';

class CacheWarmupService {
  // 预热用户数据
  async warmupUserData() {
    try {
      const users = await prisma.user.findMany({
        take: 100,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          username: true,
          avatar: true,
          bio: true,
        },
      });

      for (const user of users) {
        await redisService.set(
          `user:${user.id}`,
          user,
          3600 // 1小时
        );
      }

      logger.info(`预热用户数据完成: ${users.length} 条`);
    } catch (error) {
      logger.error('预热用户数据失败:', error);
    }
  }

  // 预热视频数据
  async warmupVideoData() {
    try {
      const videos = await prisma.video.findMany({
        take: 100,
        orderBy: { viewCount: 'desc' },
        select: {
          id: true,
          title: true,
          description: true,
          thumbnail: true,
          duration: true,
          viewCount: true,
          likeCount: true,
        },
      });

      for (const video of videos) {
        await redisService.set(
          `video:${video.id}`,
          video,
          3600 // 1小时
        );
      }

      logger.info(`预热视频数据完成: ${videos.length} 条`);
    } catch (error) {
      logger.error('预热视频数据失败:', error);
    }
  }

  // 预热评论数据
  async warmupCommentData() {
    try {
      const comments = await prisma.comment.findMany({
        take: 1000,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      });

      // 按视频ID分组
      const commentsByVideo = comments.reduce(
        (acc, comment) => {
          if (!acc[comment.videoId]) {
            acc[comment.videoId] = [];
          }
          acc[comment.videoId].push(comment);
          return acc;
        },
        {} as Record<string, any[]>
      );

      // 存储每个视频的最新评论
      for (const [videoId, videoComments] of Object.entries(commentsByVideo)) {
        await redisService.set(
          `video:${videoId}:comments`,
          videoComments.slice(0, 10), // 只缓存最新的10条评论
          300 // 5分钟
        );
      }

      logger.info(`预热评论数据完成: ${comments.length} 条`);
    } catch (error) {
      logger.error('预热评论数据失败:', error);
    }
  }

  // 预热热门视频列表
  async warmupHotVideos() {
    try {
      const hotVideos = await prisma.video.findMany({
        take: 20,
        orderBy: { viewCount: 'desc' },
        select: {
          id: true,
          title: true,
          thumbnail: true,
          duration: true,
          viewCount: true,
          likeCount: true,
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      });

      await redisService.set(
        'hot:videos',
        hotVideos,
        300 // 5分钟
      );

      logger.info('预热热门视频列表完成');
    } catch (error) {
      logger.error('预热热门视频列表失败:', error);
    }
  }

  // 执行所有预热任务
  async warmupAll() {
    try {
      logger.info('开始缓存预热...');

      await Promise.all([
        this.warmupUserData(),
        this.warmupVideoData(),
        this.warmupCommentData(),
        this.warmupHotVideos(),
      ]);

      logger.info('缓存预热完成');
    } catch (error) {
      logger.error('缓存预热失败:', error);
    }
  }
}

export const cacheWarmupService = new CacheWarmupService();
