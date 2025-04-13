/**
 * 播放列表相关类型定义
 */

/**
 * 播放列表接口
 */
export interface IPlaylist {
  id: string;
  title: string;
  description?: string;
  isPublic: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 播放列表视频关联
 */
export interface IPlaylistVideo {
  id: string;
  playlistId: string;
  videoId: string;
  order: number;
}
