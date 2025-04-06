import { QueryParams } from '@/services/api/types';
import { VideoComment } from '@/models/Video';

export interface CreateCommentRequest {
  content: string;
  videoId: string;
  parentId?: string;
}

export interface UpdateCommentRequest {
  content: string;
}

export interface CommentQueryParams extends QueryParams {
  videoId?: string;
  userId?: string;
  parentId?: string | null;
}
