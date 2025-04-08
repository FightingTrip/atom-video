/**
 * 互动服务模块
 *
 * 提供互动相关功能的业务逻辑
 * @module interaction/services/interaction
 */

import {
  CommentDto,
  CreateCommentDto,
  UpdateCommentDto,
  CommentQueryDto,
  LikeDto,
  SavedVideoDto,
  SubscriptionDto,
  WatchHistoryDto,
  VideoProgressDto,
  UpdateVideoProgressDto,
  HistoryQueryDto,
} from '../models/interaction.model';
import { withDbClient, performTransaction } from '../../common/utils/db-helpers';
import {
  NotFoundError,
  ValidationError,
  ForbiddenError,
  ConflictError,
} from '../../common/utils/app-error';
import { removeNullUndefined } from '../../common/utils/helpers';

/**
 * 互动服务类
 */
export class InteractionService {
  // ======================== 点赞相关 ========================
  
  /**
   * 点赞视频
   * @param userId 用户ID
   * @param videoId 视频ID
   * @returns 点赞记录
   */
  async likeVideo(userId: string, videoId: string): Promise<LikeDto> {
    return performTransaction(async prisma => {
      // 检查视频是否存在
      const video = await prisma.video.findUnique({
        where: { id: videoId }
      });
      
      if (!video) {
        throw new NotFoundError('视频不存在', `没有找到ID为 ${videoId} 的视频`);
      }
      
      // 检查是否已点赞
      const existingLike = await prisma.like.findUnique({
        where: {
          userId_videoId: {
            userId,
            videoId
          }
        }
      });
      
      if (existingLike) {
        throw new ConflictError('已点赞', '您已经点赞过该视频');
      }
      
      // 创建点赞记录
      const like = await prisma.like.create({
        data: {
          userId,
          videoId
        }
      });
      
      // 更新视频点赞数
      await prisma.video.update({
        where: { id: videoId },
        data: {
          likeCount: {
            increment: 1
          }
        }
      });
      
      return {
        id: like.id,
        userId: like.userId,
        videoId: like.videoId,
        createdAt: like.createdAt
      };
    });
  }
  
  /**
   * 取消点赞视频
   * @param userId 用户ID
   * @param videoId 视频ID
   */
  async unlikeVideo(userId: string, videoId: string): Promise<void> {
    return performTransaction(async prisma => {
      // 检查点赞记录是否存在
      const like = await prisma.like.findUnique({
        where: {
          userId_videoId: {
            userId,
            videoId
          }
        }
      });
      
      if (!like) {
        throw new NotFoundError('点赞不存在', '您尚未点赞该视频');
      }
      
      // 删除点赞记录
      await prisma.like.delete({
        where: {
          userId_videoId: {
            userId,
            videoId
          }
        }
      });
      
      // 更新视频点赞数
      await prisma.video.update({
        where: { id: videoId },
        data: {
          likeCount: {
            decrement: 1
          }
        }
      });
    });
  }
  
  /**
   * 检查用户是否已点赞视频
   * @param userId 用户ID
   * @param videoId 视频ID
   * @returns 是否已点赞
   */
  async hasLikedVideo(userId: string, videoId: string): Promise<boolean> {
    return withDbClient(async prisma => {
      const like = await prisma.like.findUnique({
        where: {
          userId_videoId: {
            userId,
            videoId
          }
        }
      });
      
      return !!like;
    });
  }
  
  /**
   * 获取用户点赞的视频列表
   * @param userId 用户ID
   * @param limit 数量限制
   * @param offset 偏移量
   * @returns 视频列表
   */
  async getLikedVideos(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ videos: any[]; total: number }> {
    return withDbClient(async prisma => {
      // 查询用户点赞的视频
      const likes = await prisma.like.findMany({
        where: { userId },
        include: {
          video: {
            include: {
              creator: true,
              videoTags: {
                include: {
                  tag: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      });
      
      // 计算总数
      const total = await prisma.like.count({
        where: { userId }
      });
      
      // 转换为视频对象列表
      const videos = likes.map(like => {
        const video = like.video;
        return {
          id: video.id,
          title: video.title,
          description: video.description,
          thumbnailUrl: video.thumbnailUrl,
          duration: video.duration,
          views: video.viewCount,
          likesCount: video.likeCount,
          commentsCount: video.commentCount,
          visibility: video.visibility,
          createdAt: video.createdAt,
          updatedAt: video.updatedAt,
          creator: {
            id: video.creator.id,
            username: video.creator.username,
            name: video.creator.name,
            avatarUrl: video.creator.avatarUrl,
            isVerified: video.creator.isVerified
          },
          isLiked: true,
          tags: video.videoTags.map(vt => ({
            id: vt.tag.id,
            name: vt.tag.name,
            slug: vt.tag.slug
          }))
        };
      });
      
      return { videos, total };
    });
  }
  
  // ======================== 评论相关 ========================
  
  /**
   * 创建评论
   * @param userId 用户ID
   * @param dto 创建评论数据
   * @returns 创建的评论
   */
  async createComment(userId: string, dto: CreateCommentDto): Promise<CommentDto> {
    return performTransaction(async prisma => {
      const { content, videoId, parentId } = dto;
      
      // 检查视频是否存在
      const video = await prisma.video.findUnique({
        where: { id: videoId }
      });
      
      if (!video) {
        throw new NotFoundError('视频不存在', `没有找到ID为 ${videoId} 的视频`);
      }
      
      // 检查父评论是否存在（如果有）
      if (parentId) {
        const parentComment = await prisma.comment.findUnique({
          where: { id: parentId }
        });
        
        if (!parentComment) {
          throw new NotFoundError('父评论不存在', `没有找到ID为 ${parentId} 的评论`);
        }
        
        if (parentComment.parentId) {
          throw new ValidationError('嵌套回复限制', '仅支持一级回复，不能回复已经是回复的评论');
        }
        
        if (parentComment.videoId !== videoId) {
          throw new ValidationError('评论错误', '回复的评论必须属于同一视频');
        }
      }
      
      // 创建评论
      const comment = await prisma.comment.create({
        data: {
          content,
          authorId: userId,
          videoId,
          parentId,
          isEdited: false
        },
        include: {
          author: true
        }
      });
      
      // 更新视频评论数
      await prisma.video.update({
        where: { id: videoId },
        data: {
          commentCount: {
            increment: 1
          }
        }
      });
      
      return {
        id: comment.id,
        content: comment.content,
        isEdited: comment.isEdited,
        authorId: comment.authorId,
        author: comment.author ? {
          id: comment.author.id,
          username: comment.author.username,
          name: comment.author.name,
          avatarUrl: comment.author.avatarUrl,
          isVerified: comment.author.isVerified
        } : undefined,
        videoId: comment.videoId,
        parentId: comment.parentId,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        likesCount: 0,
        isLiked: false
      };
    });
  }
  
  /**
   * 获取视频评论
   * @param dto 评论查询参数
   * @param userId 当前用户ID（可选）
   * @returns 评论列表和总数
   */
  async getVideoComments(
    dto: CommentQueryDto,
    userId?: string
  ): Promise<{ comments: CommentDto[]; total: number }> {
    const { videoId, parentId, limit = 20, offset = 0, sort = 'newest' } = dto;
    
    return withDbClient(async prisma => {
      // 构造排序规则
      let orderBy: any;
      
      switch (sort) {
        case 'newest':
          orderBy = { createdAt: 'desc' };
          break;
        case 'oldest':
          orderBy = { createdAt: 'asc' };
          break;
        case 'popular':
          orderBy = { commentLikes: { _count: 'desc' } };
          break;
        default:
          orderBy = { createdAt: 'desc' };
      }
      
      // 查询评论
      const comments = await prisma.comment.findMany({
        where: {
          videoId,
          parentId: parentId || null // 如果parentId未提供，则查询顶层评论
        },
        include: {
          author: true,
          _count: {
            select: { commentLikes: true }
          },
          replies: parentId ? undefined : {
            include: {
              author: true,
              _count: {
                select: { commentLikes: true }
              }
            },
            orderBy: { createdAt: 'asc' },
            take: 3 // 每个顶层评论最多显示3条回复
          }
        },
        orderBy,
        skip: offset,
        take: limit
      });
      
      // 查询总数
      const total = await prisma.comment.count({
        where: {
          videoId,
          parentId: parentId || null
        }
      });
      
      // 如果有登录用户，检查用户是否点赞了每条评论
      const commentDtos = await Promise.all(
        comments.map(async comment => {
          let isLiked = false;
          
          if (userId) {
            const like = await prisma.commentLike.findUnique({
              where: {
                userId_commentId: {
                  userId,
                  commentId: comment.id
                }
              }
            });
            
            isLiked = !!like;
          }
          
          const commentDto: CommentDto = {
            id: comment.id,
            content: comment.content,
            isEdited: comment.isEdited,
            authorId: comment.authorId,
            author: comment.author ? {
              id: comment.author.id,
              username: comment.author.username,
              name: comment.author.name,
              avatarUrl: comment.author.avatarUrl,
              isVerified: comment.author.isVerified
            } : undefined,
            videoId: comment.videoId,
            parentId: comment.parentId,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
            likesCount: comment._count.commentLikes,
            isLiked
          };
          
          // 处理回复（如果有）
          if (comment.replies && comment.replies.length > 0) {
            const repliesWithLikes = await Promise.all(
              comment.replies.map(async reply => {
                let replyIsLiked = false;
                
                if (userId) {
                  const replyLike = await prisma.commentLike.findUnique({
                    where: {
                      userId_commentId: {
                        userId,
                        commentId: reply.id
                      }
                    }
                  });
                  
                  replyIsLiked = !!replyLike;
                }
                
                return {
                  id: reply.id,
                  content: reply.content,
                  isEdited: reply.isEdited,
                  authorId: reply.authorId,
                  author: reply.author ? {
                    id: reply.author.id,
                    username: reply.author.username,
                    name: reply.author.name,
                    avatarUrl: reply.author.avatarUrl,
                    isVerified: reply.author.isVerified
                  } : undefined,
                  videoId: reply.videoId,
                  parentId: reply.parentId,
                  createdAt: reply.createdAt,
                  updatedAt: reply.updatedAt,
                  likesCount: reply._count.commentLikes,
                  isLiked: replyIsLiked
                };
              })
            );
            
            commentDto.replies = repliesWithLikes;
          }
          
          return commentDto;
        })
      );
      
      return { comments: commentDtos, total };
    });
  }
  
  /**
   * 更新评论
   * @param commentId 评论ID
   * @param userId 用户ID
   * @param dto 更新数据
   * @returns 更新后的评论
   */
  async updateComment(
    commentId: string,
    userId: string,
    dto: UpdateCommentDto
  ): Promise<CommentDto> {
    return performTransaction(async prisma => {
      // 检查评论是否存在
      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        include: {
          author: true,
          _count: {
            select: { commentLikes: true }
          }
        }
      });
      
      if (!comment) {
        throw new NotFoundError('评论不存在', `没有找到ID为 ${commentId} 的评论`);
      }
      
      // 检查用户是否是评论作者
      if (comment.authorId !== userId) {
        throw new ForbiddenError('权限不足', '您只能编辑自己的评论');
      }
      
      // 更新评论
      const updatedComment = await prisma.comment.update({
        where: { id: commentId },
        data: {
          content: dto.content,
          isEdited: true,
          updatedAt: new Date()
        },
        include: {
          author: true,
          _count: {
            select: { commentLikes: true }
          }
        }
      });
      
      // 检查用户是否点赞了该评论
      const like = await prisma.commentLike.findUnique({
        where: {
          userId_commentId: {
            userId,
            commentId
          }
        }
      });
      
      return {
        id: updatedComment.id,
        content: updatedComment.content,
        isEdited: updatedComment.isEdited,
        authorId: updatedComment.authorId,
        author: updatedComment.author ? {
          id: updatedComment.author.id,
          username: updatedComment.author.username,
          name: updatedComment.author.name,
          avatarUrl: updatedComment.author.avatarUrl,
          isVerified: updatedComment.author.isVerified
        } : undefined,
        videoId: updatedComment.videoId,
        parentId: updatedComment.parentId,
        createdAt: updatedComment.createdAt,
        updatedAt: updatedComment.updatedAt,
        likesCount: updatedComment._count.commentLikes,
        isLiked: !!like
      };
    });
  }
  
  /**
   * 删除评论
   * @param commentId 评论ID
   * @param userId 用户ID
   * @param isAdmin 是否管理员
   */
  async deleteComment(
    commentId: string,
    userId: string,
    isAdmin: boolean = false
  ): Promise<void> {
    return performTransaction(async prisma => {
      // 检查评论是否存在
      const comment = await prisma.comment.findUnique({
        where: { id: commentId }
      });
      
      if (!comment) {
        throw new NotFoundError('评论不存在', `没有找到ID为 ${commentId} 的评论`);
      }
      
      // 检查权限（作者或管理员）
      if (comment.authorId !== userId && !isAdmin) {
        throw new ForbiddenError('权限不足', '您只能删除自己的评论');
      }
      
      // 删除子评论（如果有）
      await prisma.comment.deleteMany({
        where: { parentId: commentId }
      });
      
      // 删除评论点赞
      await prisma.commentLike.deleteMany({
        where: { commentId }
      });
      
      // 删除评论
      await prisma.comment.delete({
        where: { id: commentId }
      });
      
      // 更新视频评论计数
      const repliesCount = await prisma.comment.count({
        where: { parentId: commentId }
      });
      
      await prisma.video.update({
        where: { id: comment.videoId },
        data: {
          commentCount: {
            decrement: repliesCount + 1 // 子评论数+主评论
          }
        }
      });
    });
  }
  
  /**
   * 点赞评论
   * @param userId 用户ID
   * @param commentId 评论ID
   */
  async likeComment(userId: string, commentId: string): Promise<void> {
    return performTransaction(async prisma => {
      // 检查评论是否存在
      const comment = await prisma.comment.findUnique({
        where: { id: commentId }
      });
      
      if (!comment) {
        throw new NotFoundError('评论不存在', `没有找到ID为 ${commentId} 的评论`);
      }
      
      // 检查是否已点赞
      const existingLike = await prisma.commentLike.findUnique({
        where: {
          userId_commentId: {
            userId,
            commentId
          }
        }
      });
      
      if (existingLike) {
        throw new ConflictError('已点赞', '您已经点赞过该评论');
      }
      
      // 创建点赞记录
      await prisma.commentLike.create({
        data: {
          userId,
          commentId
        }
      });
    });
  }
  
  /**
   * 取消点赞评论
   * @param userId 用户ID
   * @param commentId 评论ID
   */
  async unlikeComment(userId: string, commentId: string): Promise<void> {
    return performTransaction(async prisma => {
      // 检查点赞记录是否存在
      const like = await prisma.commentLike.findUnique({
        where: {
          userId_commentId: {
            userId,
            commentId
          }
        }
      });
      
      if (!like) {
        throw new NotFoundError('点赞不存在', '您尚未点赞该评论');
      }
      
      // 删除点赞记录
      await prisma.commentLike.delete({
        where: {
          userId_commentId: {
            userId,
            commentId
          }
        }
      });
    });
  }
  
  // ======================== 收藏相关 ========================
  
  /**
   * 收藏视频
   * @param userId 用户ID
   * @param videoId 视频ID
   * @returns 收藏记录
   */
  async saveVideo(userId: string, videoId: string): Promise<SavedVideoDto> {
    return performTransaction(async prisma => {
      // 检查视频是否存在
      const video = await prisma.video.findUnique({
        where: { id: videoId }
      });
      
      if (!video) {
        throw new NotFoundError('视频不存在', `没有找到ID为 ${videoId} 的视频`);
      }
      
      // 检查是否已收藏
      const existingSave = await prisma.savedVideo.findUnique({
        where: {
          userId_videoId: {
            userId,
            videoId
          }
        }
      });
      
      if (existingSave) {
        throw new ConflictError('已收藏', '您已经收藏过该视频');
      }
      
      // 创建收藏记录
      const savedVideo = await prisma.savedVideo.create({
        data: {
          userId,
          videoId
        }
      });
      
      return {
        id: savedVideo.id,
        userId: savedVideo.userId,
        videoId: savedVideo.videoId,
        createdAt: savedVideo.createdAt
      };
    });
  }
  
  /**
   * 取消收藏视频
   * @param userId 用户ID
   * @param videoId 视频ID
   */
  async unsaveVideo(userId: string, videoId: string): Promise<void> {
    return performTransaction(async prisma => {
      // 检查收藏记录是否存在
      const savedVideo = await prisma.savedVideo.findUnique({
        where: {
          userId_videoId: {
            userId,
            videoId
          }
        }
      });
      
      if (!savedVideo) {
        throw new NotFoundError('收藏不存在', '您尚未收藏该视频');
      }
      
      // 删除收藏记录
      await prisma.savedVideo.delete({
        where: {
          userId_videoId: {
            userId,
            videoId
          }
        }
      });
    });
  }
  
  /**
   * 检查用户是否已收藏视频
   * @param userId 用户ID
   * @param videoId 视频ID
   * @returns 是否已收藏
   */
  async hasSavedVideo(userId: string, videoId: string): Promise<boolean> {
    return withDbClient(async prisma => {
      const savedVideo = await prisma.savedVideo.findUnique({
        where: {
          userId_videoId: {
            userId,
            videoId
          }
        }
      });
      
      return !!savedVideo;
    });
  }
  
  /**
   * 获取用户收藏的视频列表
   * @param userId 用户ID
   * @param limit 数量限制
   * @param offset 偏移量
   * @returns 视频列表
   */
  async getSavedVideos(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ videos: any[]; total: number }> {
    return withDbClient(async prisma => {
      // 查询用户收藏的视频
      const savedVideos = await prisma.savedVideo.findMany({
        where: { userId },
        include: {
          video: {
            include: {
              creator: true,
              videoTags: {
                include: {
                  tag: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      });
      
      // 计算总数
      const total = await prisma.savedVideo.count({
        where: { userId }
      });
      
      // 检查用户是否点赞了这些视频
      const videos = await Promise.all(
        savedVideos.map(async savedVideo => {
          const video = savedVideo.video;
          
          // 检查是否点赞
          const like = await prisma.like.findUnique({
            where: {
              userId_videoId: {
                userId,
                videoId: video.id
              }
            }
          });
          
          return {
            id: video.id,
            title: video.title,
            description: video.description,
            thumbnailUrl: video.thumbnailUrl,
            duration: video.duration,
            views: video.viewCount,
            likesCount: video.likeCount,
            commentsCount: video.commentCount,
            visibility: video.visibility,
            createdAt: video.createdAt,
            updatedAt: video.updatedAt,
            creator: {
              id: video.creator.id,
              username: video.creator.username,
              name: video.creator.name,
              avatarUrl: video.creator.avatarUrl,
              isVerified: video.creator.isVerified
            },
            isLiked: !!like,
            isSaved: true,
            tags: video.videoTags.map(vt => ({
              id: vt.tag.id,
              name: vt.tag.name,
              slug: vt.tag.slug
            }))
          };
        })
      );
      
      return { videos, total };
    });
  }
} 