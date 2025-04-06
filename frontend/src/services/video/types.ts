import { QueryParams } from '@/services/api/types';
import { Video, VideoCategory } from '@/models/Video';

export interface VideoUploadRequest {
  title: string;
  description: string;
  category: VideoCategory | string;
  tags: string[];
  videoFile: File;
  thumbnailFile?: File;
  isPublished?: boolean;
}

export interface VideoUpdateRequest {
  title?: string;
  description?: string;
  category?: VideoCategory | string;
  tags?: string[];
  thumbnailFile?: File;
  isPublished?: boolean;
}

export interface VideoQueryParams extends QueryParams {
  category?: string;
  tag?: string;
  userId?: string;
  trending?: boolean;
  featured?: boolean;
}
