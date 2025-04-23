/**
 * @file comment/index.ts
 * @description 评论相关服务
 * @author Atom Video Team
 * @date 2025-04-09
 */

import { Comment } from '@/types';
import { getMockDB } from '@/mock/mockDb';
import { v4 as uuidv4 } from 'uuid';

/**
 * 获取视频评论列表
 * @param videoId 视频ID
 * @param options 查询选项
 * @returns 评论列表及总数
 */
export const getVideoComments = async (
  videoId: string,
  options: {
    page?: number;
    limit?: number;
    sort?: 'latest' | 'popular';
  } = {}
) => {
  try {
    const { page = 1, limit = 10, sort = 'latest' } = options;
    const db = await getMockDB();

    // 获取视频的所有顶级评论（不包含回复）
    let comments = db.comments
      .filter(comment => comment.videoId === videoId && !comment.parentId)
      .map(comment => {
        // 为每个评论添加子评论（回复）
        const replies = db.comments
          .filter(reply => reply.parentId === comment.id)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return {
          ...comment,
          replies,
          author: db.users.find(user => user.id === comment.authorId),
        };
      });

    // 按照排序方式排序
    if (sort === 'latest') {
      comments = comments.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sort === 'popular') {
      comments = comments.sort((a, b) => b.likes - a.likes);
    }

    // 分页
    const total = comments.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedComments = comments.slice(startIndex, endIndex);

    return {
      comments: paginatedComments,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error('获取视频评论失败:', error);
    throw error;
  }
};

/**
 * 添加评论
 * @param params 评论参数
 * @returns 新增的评论
 */
export const addComment = async (params: {
  videoId: string;
  content: string;
  authorId: string;
}) => {
  try {
    const { videoId, content, authorId } = params;
    const db = await getMockDB();

    // 验证用户存在
    const user = db.users.find(user => user.id === authorId);
    if (!user) {
      throw new Error('用户不存在');
    }

    // 验证视频存在
    const video = db.videos.find(video => video.id === videoId);
    if (!video) {
      throw new Error('视频不存在');
    }

    // 创建新评论
    const newComment: Comment = {
      id: uuidv4(),
      videoId,
      content,
      authorId,
      likes: 0,
      dislikes: 0,
      createdAt: new Date().toISOString(),
      replies: [],
      author: user,
    };

    // 将评论添加到数据库
    db.comments.push(newComment);

    // 更新视频评论数
    video.comments = (video.comments || 0) + 1;

    return newComment;
  } catch (error) {
    console.error('添加评论失败:', error);
    throw error;
  }
};

/**
 * 回复评论
 * @param params 回复参数
 * @returns 新增的回复
 */
export const replyToComment = async (params: {
  videoId: string;
  commentId: string;
  content: string;
  authorId: string;
}) => {
  try {
    const { videoId, commentId, content, authorId } = params;
    const db = await getMockDB();

    // 验证用户存在
    const user = db.users.find(user => user.id === authorId);
    if (!user) {
      throw new Error('用户不存在');
    }

    // 验证视频存在
    const video = db.videos.find(video => video.id === videoId);
    if (!video) {
      throw new Error('视频不存在');
    }

    // 验证父评论存在
    const parentComment = db.comments.find(comment => comment.id === commentId);
    if (!parentComment) {
      throw new Error('父评论不存在');
    }

    // 创建新回复
    const newReply: Comment = {
      id: uuidv4(),
      videoId,
      parentId: commentId,
      content,
      authorId,
      likes: 0,
      dislikes: 0,
      createdAt: new Date().toISOString(),
      author: user,
    };

    // 将回复添加到数据库
    db.comments.push(newReply);

    // 更新视频评论数
    video.comments = (video.comments || 0) + 1;

    return newReply;
  } catch (error) {
    console.error('回复评论失败:', error);
    throw error;
  }
};

/**
 * 点赞/取消点赞评论
 * @param commentId 评论ID
 * @param userId 用户ID
 * @returns 是否成功
 */
export const toggleCommentLike = async (commentId: string, userId: string) => {
  try {
    const db = await getMockDB();

    // 验证用户存在
    const user = db.users.find(user => user.id === userId);
    if (!user) {
      throw new Error('用户不存在');
    }

    // 验证评论存在
    const comment = db.comments.find(comment => comment.id === commentId);
    if (!comment) {
      throw new Error('评论不存在');
    }

    // 查找用户是否已点赞该评论
    const likeIndex = db.userLikes.findIndex(
      like => like.userId === userId && like.targetId === commentId && like.type === 'comment'
    );

    // 如果已点赞，则取消点赞
    if (likeIndex !== -1) {
      db.userLikes.splice(likeIndex, 1);
      comment.likes -= 1;
      return { liked: false, likes: comment.likes };
    }

    // 如果未点赞，则添加点赞
    db.userLikes.push({
      id: uuidv4(),
      userId,
      targetId: commentId,
      type: 'comment',
      createdAt: new Date().toISOString(),
    });

    comment.likes += 1;

    return { liked: true, likes: comment.likes };
  } catch (error) {
    console.error('点赞/取消点赞评论失败:', error);
    throw error;
  }
};

/**
 * 检查用户是否点赞了评论
 * @param commentId 评论ID
 * @param userId 用户ID
 * @returns 是否已点赞
 */
export const checkCommentLiked = async (commentId: string, userId: string) => {
  try {
    if (!userId) return false;

    const db = await getMockDB();

    // 查找用户是否已点赞该评论
    const isLiked = db.userLikes.some(
      like => like.userId === userId && like.targetId === commentId && like.type === 'comment'
    );

    return isLiked;
  } catch (error) {
    console.error('检查评论点赞状态失败:', error);
    return false;
  }
};

/**
 * 删除评论
 * @param commentId 评论ID
 * @param userId 用户ID
 * @returns 是否成功
 */
export const deleteComment = async (commentId: string, userId: string) => {
  try {
    const db = await getMockDB();

    // 验证用户存在
    const user = db.users.find(user => user.id === userId);
    if (!user) {
      throw new Error('用户不存在');
    }

    // 验证评论存在
    const commentIndex = db.comments.findIndex(comment => comment.id === commentId);
    if (commentIndex === -1) {
      throw new Error('评论不存在');
    }

    const comment = db.comments[commentIndex];

    // 检查用户是否有权限删除该评论
    if (comment.authorId !== userId && !user.isAdmin) {
      throw new Error('无权限删除该评论');
    }

    // 查找所有回复
    const replies = db.comments.filter(c => c.parentId === commentId);

    // 删除所有回复及其点赞记录
    for (const reply of replies) {
      // 删除回复的所有点赞记录
      db.userLikes = db.userLikes.filter(
        like => !(like.targetId === reply.id && like.type === 'comment')
      );

      // 从评论列表中删除回复
      const replyIndex = db.comments.findIndex(c => c.id === reply.id);
      if (replyIndex !== -1) {
        db.comments.splice(replyIndex, 1);
      }
    }

    // 删除评论的所有点赞记录
    db.userLikes = db.userLikes.filter(
      like => !(like.targetId === commentId && like.type === 'comment')
    );

    // 从评论列表中删除评论
    db.comments.splice(commentIndex, 1);

    // 更新视频评论数
    const video = db.videos.find(video => video.id === comment.videoId);
    if (video) {
      video.comments = Math.max(0, (video.comments || 0) - 1 - replies.length);
    }

    return true;
  } catch (error) {
    console.error('删除评论失败:', error);
    throw error;
  }
};
