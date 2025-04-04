import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { catchAsync } from '../utils/catchAsync';
import { ApiError } from '../utils/ApiError';
import httpStatus from 'http-status';

// 获取视频收藏状态
export const getFavoriteStatus = catchAsync(async (req: Request, res: Response) => {
  const { videoId } = req.params;
  const userId = req.user.id;

  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_videoId: {
        userId,
        videoId,
      },
    },
  });

  const favoriteCount = await prisma.favorite.count({
    where: { videoId },
  });

  res.json({
    isFavorited: !!favorite,
    favoriteCount,
  });
});

// 切换收藏状态
export const toggleFavorite = catchAsync(async (req: Request, res: Response) => {
  const { videoId } = req.params;
  const userId = req.user.id;

  // 检查视频是否存在
  const video = await prisma.video.findUnique({
    where: { id: videoId },
  });

  if (!video) {
    throw new ApiError(httpStatus.NOT_FOUND, '视频不存在');
  }

  const existingFavorite = await prisma.favorite.findUnique({
    where: {
      userId_videoId: {
        userId,
        videoId,
      },
    },
  });

  let isFavorited = false;
  if (existingFavorite) {
    await prisma.favorite.delete({
      where: {
        userId_videoId: {
          userId,
          videoId,
        },
      },
    });
  } else {
    await prisma.favorite.create({
      data: {
        userId,
        videoId,
      },
    });
    isFavorited = true;
  }

  const favoriteCount = await prisma.favorite.count({
    where: { videoId },
  });

  // 更新视频的收藏数
  await prisma.video.update({
    where: { id: videoId },
    data: { favoriteCount },
  });

  res.json({
    isFavorited,
    favoriteCount,
  });
});

// 获取用户收藏的视频列表
export const getUserFavorites = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const [favorites, total] = await Promise.all([
    prisma.favorite.findMany({
      where: { userId },
      include: {
        video: {
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
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.favorite.count({
      where: { userId },
    }),
  ]);

  res.json({
    videos: favorites.map(favorite => favorite.video),
    hasMore: skip + favorites.length < total,
    total,
  });
});
