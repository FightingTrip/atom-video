export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  views: number;
  likes: number;
  published: boolean;
  publishedAt: string;
  userId: string;
  username: string;
  userAvatar: string;
  tags: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface VideoStats {
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

export enum VideoCategory {
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
  REACT = 'react',
  VUE = 'vue',
  ANGULAR = 'angular',
  NODE = 'node',
  PYTHON = 'python',
  JAVA = 'java',
  GO = 'go',
  RUST = 'rust',
  DEVOPS = 'devops',
  DATABASES = 'databases',
  MACHINE_LEARNING = 'machine-learning',
  OTHER = 'other',
}

export interface VideoComment {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  username: string;
  userAvatar: string;
  likes: number;
  replies?: VideoComment[];
}

export interface VideoQueryParams {
  search?: string;
  category?: VideoCategory;
  sortBy?: 'newest' | 'popular' | 'trending';
  page?: number;
  limit?: number;
  userId?: string;
}
