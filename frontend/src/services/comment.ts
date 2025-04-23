import { http } from '@/utils/http';
import type { Comment, Reply, CommentService, Author } from '@/types';
import { localStorageSupport } from '@/utils/storageUtils';

// 判断是否为mock模式
const isMockMode = import.meta.env.VITE_USE_MOCK !== 'false';

// 用于持久化存储评论的key
const COMMENTS_STORAGE_KEY = 'atom-video-mock-comments';
const REPLIES_STORAGE_KEY = 'atom-video-mock-replies';
const COMMENT_LIKES_KEY = 'atom-video-comment-likes';

class CommentServiceImpl implements CommentService {
  private comments: Record<string, Comment[]> = {};
  private replies: Record<string, Reply[]> = {};
  private commentLikes: Set<string> = new Set();

  constructor() {
    if (isMockMode) {
      this.loadFromStorage();
    }
  }

  // 从本地存储加载数据
  private loadFromStorage() {
    if (localStorageSupport()) {
      const commentsJson = localStorage.getItem(COMMENTS_STORAGE_KEY);
      const repliesJson = localStorage.getItem(REPLIES_STORAGE_KEY);
      const likesJson = localStorage.getItem(COMMENT_LIKES_KEY);

      if (commentsJson) {
        this.comments = JSON.parse(commentsJson);
      }

      if (repliesJson) {
        this.replies = JSON.parse(repliesJson);
      }

      if (likesJson) {
        this.commentLikes = new Set(JSON.parse(likesJson));
      }
    }
  }

  // 保存到本地存储
  private saveToStorage() {
    if (localStorageSupport()) {
      localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(this.comments));
      localStorage.setItem(REPLIES_STORAGE_KEY, JSON.stringify(this.replies));
      localStorage.setItem(COMMENT_LIKES_KEY, JSON.stringify([...this.commentLikes]));
    }
  }

  async getComments(
    videoId: string,
    page = 1,
    limit = 20
  ): Promise<{
    comments: Comment[];
    hasMore: boolean;
  }> {
    if (isMockMode) {
      const videoComments = this.comments[videoId] || [];
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedComments = videoComments.slice(start, end);

      return {
        comments: paginatedComments,
        hasMore: end < videoComments.length,
      };
    }

    const { data } = await http.get(`/api/videos/${videoId}/comments`, {
      params: { page, limit },
    });
    return data;
  }

  async getReplies(
    commentId: string,
    page = 1,
    limit = 20
  ): Promise<{
    replies: Reply[];
    hasMore: boolean;
  }> {
    if (isMockMode) {
      const commentReplies = this.replies[commentId] || [];
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedReplies = commentReplies.slice(start, end);

      return {
        replies: paginatedReplies,
        hasMore: end < commentReplies.length,
      };
    }

    const { data } = await http.get(`/api/comments/${commentId}/replies`, {
      params: { page, limit },
    });
    return data;
  }

  async addComment(videoId: string, content: string): Promise<Comment> {
    if (isMockMode) {
      const userNickname = localStorage.getItem('current-user-nickname') || '当前用户';
      const userAvatar =
        localStorage.getItem('current-user-avatar') || 'https://i.pravatar.cc/150?u=default';

      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        content,
        createdAt: new Date().toISOString(),
        videoTitle: '',
        user: {
          nickname: userNickname,
          avatar: userAvatar,
        },
        likes: 0,
        author: {
          id: 'current-user',
          nickname: userNickname,
          username: userNickname, // 使用昵称作为用户名
          avatar: userAvatar,
          verified: false,
        },
        replyCount: 0,
      };

      if (!this.comments[videoId]) {
        this.comments[videoId] = [];
      }

      this.comments[videoId].unshift(newComment);
      this.saveToStorage();

      return newComment;
    }

    const { data } = await http.post(`/api/videos/${videoId}/comments`, {
      content,
    });
    return data;
  }

  async addReply(commentId: string, content: string): Promise<Reply> {
    if (isMockMode) {
      const userNickname = localStorage.getItem('current-user-nickname') || '当前用户';
      const userAvatar =
        localStorage.getItem('current-user-avatar') || 'https://i.pravatar.cc/150?u=default';

      const newReply: Reply = {
        id: `reply-${Date.now()}`,
        content,
        createdAt: new Date().toISOString(),
        likes: 0,
        author: {
          id: 'current-user',
          nickname: userNickname,
          username: userNickname, // 使用昵称作为用户名
          avatar: userAvatar,
          verified: false,
        },
        isLiked: false,
        parentId: commentId,
      };

      if (!this.replies[commentId]) {
        this.replies[commentId] = [];
      }

      this.replies[commentId].unshift(newReply);

      // 更新评论的回复数
      for (const videoId in this.comments) {
        const comment = this.comments[videoId].find(c => c.id === commentId);
        if (comment) {
          comment.replyCount = (comment.replyCount || 0) + 1;
          break;
        }
      }

      this.saveToStorage();

      return newReply;
    }

    const { data } = await http.post(`/api/comments/${commentId}/replies`, {
      content,
    });
    return data;
  }

  async likeComment(commentId: string): Promise<boolean> {
    if (isMockMode) {
      const liked = this.commentLikes.has(commentId);

      if (liked) {
        this.commentLikes.delete(commentId);

        // 更新评论的点赞数
        for (const videoId in this.comments) {
          const comment = this.comments[videoId].find(c => c.id === commentId);
          if (comment) {
            comment.likes = comment.likes !== undefined ? Math.max(0, comment.likes - 1) : 0;
            break;
          }
        }
      } else {
        this.commentLikes.add(commentId);

        // 更新评论的点赞数
        for (const videoId in this.comments) {
          const comment = this.comments[videoId].find(c => c.id === commentId);
          if (comment) {
            comment.likes = (comment.likes || 0) + 1;
            break;
          }
        }
      }

      this.saveToStorage();
      return !liked;
    }

    const { data } = await http.post(`/api/comments/${commentId}/like`);
    return data;
  }

  async likeReply(replyId: string): Promise<boolean> {
    if (isMockMode) {
      const liked = this.commentLikes.has(replyId);

      if (liked) {
        this.commentLikes.delete(replyId);

        // 更新回复的点赞数
        for (const commentId in this.replies) {
          const reply = this.replies[commentId].find(r => r.id === replyId);
          if (reply) {
            reply.likes = Math.max(0, reply.likes - 1);
            break;
          }
        }
      } else {
        this.commentLikes.add(replyId);

        // 更新回复的点赞数
        for (const commentId in this.replies) {
          const reply = this.replies[commentId].find(r => r.id === replyId);
          if (reply) {
            reply.likes += 1;
            break;
          }
        }
      }

      this.saveToStorage();
      return !liked;
    }

    const { data } = await http.post(`/api/replies/${replyId}/like`);
    return data;
  }

  // 检查评论或回复是否已点赞
  isLiked(id: string): boolean {
    if (isMockMode) {
      return this.commentLikes.has(id);
    }
    return false;
  }

  // 获取视频评论总数
  getCommentCount(videoId: string): number {
    if (isMockMode) {
      const comments = this.comments[videoId] || [];
      return comments.length;
    }
    return 0;
  }
}

// 添加工具函数用于检查localStorage支持
export const commentService = new CommentServiceImpl();
