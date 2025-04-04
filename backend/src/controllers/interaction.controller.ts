import { Request, Response } from 'express';
import { Interaction } from '../models/interaction.model';
import { Video } from '../models/video.model';
import { catchAsync } from '../utils/catchAsync';
import { ApiError } from '../utils/ApiError';
import httpStatus from 'http-status';

// 获取视频互动状态
export const getInteraction = catchAsync(async (req: Request, res: Response) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  const interaction = await Interaction.findOne({
    user: userId,
    video: videoId,
  });

  if (!interaction) {
    return res.json({
      isLiked: false,
      isFavorited: false,
      likeCount: 0,
      favoriteCount: 0,
    });
  }

  const [likeCount, favoriteCount] = await Promise.all([
    Interaction.countDocuments({ video: videoId, isLiked: true }),
    Interaction.countDocuments({ video: videoId, isFavorited: true }),
  ]);

  res.json({
    isLiked: interaction.isLiked,
    isFavorited: interaction.isFavorited,
    likeCount,
    favoriteCount,
  });
});

// 切换点赞状态
export const toggleLike = catchAsync(async (req: Request, res: Response) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  // 检查视频是否存在
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(httpStatus.NOT_FOUND, '视频不存在');
  }

  const interaction = await Interaction.findOneAndUpdate(
    { user: userId, video: videoId },
    { $set: { isLiked: req.body.isLiked } },
    { upsert: true, new: true }
  );

  const likeCount = await Interaction.countDocuments({
    video: videoId,
    isLiked: true,
  });

  res.json({
    isLiked: interaction.isLiked,
    likeCount,
  });
});

// 切换收藏状态
export const toggleFavorite = catchAsync(async (req: Request, res: Response) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  // 检查视频是否存在
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(httpStatus.NOT_FOUND, '视频不存在');
  }

  const interaction = await Interaction.findOneAndUpdate(
    { user: userId, video: videoId },
    { $set: { isFavorited: req.body.isFavorited } },
    { upsert: true, new: true }
  );

  const favoriteCount = await Interaction.countDocuments({
    video: videoId,
    isFavorited: true,
  });

  res.json({
    isFavorited: interaction.isFavorited,
    favoriteCount,
  });
});

// 获取用户收藏的视频列表
export const getFavorites = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const interactions = await Interaction.find({
    user: userId,
    isFavorited: true,
  })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('video')
    .lean();

  const total = await Interaction.countDocuments({
    user: userId,
    isFavorited: true,
  });

  res.json({
    videos: interactions.map(interaction => interaction.video),
    hasMore: skip + interactions.length < total,
    total,
  });
});
