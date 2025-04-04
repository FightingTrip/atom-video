import { Request, Response } from 'express';
import { Comment, IComment } from '../models/comment.model';
import { Video } from '../models/video.model';
import { catchAsync } from '../utils/catchAsync';
import { ApiError } from '../utils/ApiError';
import httpStatus from 'http-status';

// 获取视频评论列表
export const getComments = catchAsync(async (req: Request, res: Response) => {
  const { videoId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const comments = await Comment.find({ video: videoId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'username avatar')
    .lean();

  const total = await Comment.countDocuments({ video: videoId });

  res.json({
    comments,
    hasMore: skip + comments.length < total,
    total,
  });
});

// 创建评论
export const createComment = catchAsync(async (req: Request, res: Response) => {
  const { videoId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  // 检查视频是否存在
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(httpStatus.NOT_FOUND, '视频不存在');
  }

  const comment = await Comment.create({
    content,
    video: videoId,
    user: userId,
  });

  await comment.populate('user', 'username avatar');

  res.status(httpStatus.CREATED).json(comment);
});

// 删除评论
export const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const { videoId, commentId } = req.params;
  const userId = req.user._id;

  const comment = await Comment.findOne({
    _id: commentId,
    video: videoId,
  });

  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, '评论不存在');
  }

  // 检查是否是评论作者或视频作者
  if (comment.user.toString() !== userId.toString() && req.user.role !== 'admin') {
    throw new ApiError(httpStatus.FORBIDDEN, '无权删除此评论');
  }

  await comment.deleteOne();

  res.status(httpStatus.NO_CONTENT).send();
});

// 更新评论
export const updateComment = catchAsync(async (req: Request, res: Response) => {
  const { videoId, commentId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  const comment = await Comment.findOne({
    _id: commentId,
    video: videoId,
  });

  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, '评论不存在');
  }

  // 检查是否是评论作者
  if (comment.user.toString() !== userId.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, '无权修改此评论');
  }

  comment.content = content;
  await comment.save();

  await comment.populate('user', 'username avatar');

  res.json(comment);
});
