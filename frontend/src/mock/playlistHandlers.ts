/**
 * @file playlistHandlers.ts
 * @description 播放列表相关API处理程序
 */

import { HttpResponse, http } from 'msw';
import mockDb from './mockDb';
import { mockDelay } from '../utils/mockInitializer';
import { generateId } from './utils';

// 获取用户播放列表
const getUserPlaylists = http.get('/api/playlists', async ({ request }) => {
  await mockDelay();
  const url = new URL(request.url);
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  // 验证用户
  const userId = mockDb.getUserIdFromToken(token || '');
  if (!userId) {
    return new HttpResponse(
      JSON.stringify({
        success: false,
        message: '未授权',
      }),
      { status: 401 }
    );
  }

  // 获取查询参数
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const search = url.searchParams.get('search') || '';
  const visibility = (url.searchParams.get('visibility') || 'all') as
    | 'public'
    | 'private'
    | 'unlisted'
    | 'all';

  // 获取用户播放列表
  const playlists = mockDb.getUserPlaylists(userId, {
    page,
    limit,
    search,
    visibility,
  });

  return HttpResponse.json({
    success: true,
    data: playlists,
  });
});

// 获取播放列表详情
const getPlaylistDetail = http.get('/api/playlists/:id', async ({ request, params }) => {
  await mockDelay();
  const playlistId = params.id as string;
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  // 验证用户
  const userId = mockDb.getUserIdFromToken(token || '');

  // 获取播放列表详情
  const playlist = mockDb.getPlaylistById(playlistId);

  if (!playlist) {
    return new HttpResponse(
      JSON.stringify({
        success: false,
        message: '播放列表不存在',
      }),
      { status: 404 }
    );
  }

  // 检查权限 - 如果是私有或未上市的播放列表，需要是列表所有者才能查看
  if (playlist.visibility !== 'public' && playlist.userId !== userId) {
    return new HttpResponse(
      JSON.stringify({
        success: false,
        message: '没有权限查看此播放列表',
      }),
      { status: 403 }
    );
  }

  return HttpResponse.json({
    success: true,
    data: playlist,
  });
});

// 获取播放列表中的视频
const getPlaylistVideos = http.get('/api/playlists/:id/videos', async ({ request, params }) => {
  await mockDelay();
  const playlistId = params.id as string;
  const url = new URL(request.url);
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  // 验证用户
  const userId = mockDb.getUserIdFromToken(token || '');

  // 获取播放列表详情
  const playlist = mockDb.getPlaylistById(playlistId);

  if (!playlist) {
    return new HttpResponse(
      JSON.stringify({
        success: false,
        message: '播放列表不存在',
      }),
      { status: 404 }
    );
  }

  // 检查权限 - 如果是私有或未上市的播放列表，需要是列表所有者才能查看
  if (playlist.visibility !== 'public' && playlist.userId !== userId) {
    return new HttpResponse(
      JSON.stringify({
        success: false,
        message: '没有权限查看此播放列表',
      }),
      { status: 403 }
    );
  }

  // 获取查询参数
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');

  // 获取播放列表中的视频
  const videos = mockDb.getPlaylistVideos(playlistId, {
    page,
    limit,
  });

  return HttpResponse.json({
    success: true,
    data: videos,
  });
});

// 创建播放列表
const createPlaylist = http.post('/api/playlists', async ({ request }) => {
  await mockDelay();
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  // 验证用户
  const userId = mockDb.getUserIdFromToken(token || '');
  if (!userId) {
    return new HttpResponse(
      JSON.stringify({
        success: false,
        message: '未授权',
      }),
      { status: 401 }
    );
  }

  // 解析请求体
  const data = (await request.json()) as {
    title?: string;
    description?: string;
    visibility?: 'public' | 'private' | 'unlisted';
    videoIds?: string[];
  };
  const { title, description, visibility, videoIds } = data;

  // 验证必填字段
  if (!title || !visibility) {
    return new HttpResponse(
      JSON.stringify({
        success: false,
        message: '缺少必要参数',
      }),
      { status: 400 }
    );
  }

  // 创建播放列表
  const playlist = mockDb.createPlaylist(userId, {
    title,
    description,
    visibility,
    videoIds,
  });

  return HttpResponse.json({
    success: true,
    data: playlist,
  });
});

// 更新播放列表
const updatePlaylist = http.put('/api/playlists/:id', async ({ request, params }) => {
  await mockDelay();
  const playlistId = params.id as string;
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  // 验证用户
  const userId = mockDb.getUserIdFromToken(token || '');
  if (!userId) {
    return new HttpResponse(
      JSON.stringify({
        success: false,
        message: '未授权',
      }),
      { status: 401 }
    );
  }

  // 解析请求体
  const data = (await request.json()) as {
    title?: string;
    description?: string;
    visibility?: 'public' | 'private' | 'unlisted';
  };
  const { title, description, visibility } = data;

  // 更新播放列表
  const result = mockDb.updatePlaylist(playlistId, userId, {
    title,
    description,
    visibility,
  });

  if (!result.success) {
    return new HttpResponse(
      JSON.stringify({
        success: false,
        message: result.error || '更新失败',
      }),
      { status: 400 }
    );
  }

  return HttpResponse.json({
    success: true,
    data: result.playlist,
  });
});

// 删除播放列表
const deletePlaylist = http.delete('/api/playlists/:id', async ({ request, params }) => {
  await mockDelay();
  const playlistId = params.id as string;
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  // 验证用户
  const userId = mockDb.getUserIdFromToken(token || '');
  if (!userId) {
    return new HttpResponse(
      JSON.stringify({
        success: false,
        message: '未授权',
      }),
      { status: 401 }
    );
  }

  // 删除播放列表
  const result = mockDb.deletePlaylist(playlistId, userId);

  if (!result.success) {
    return new HttpResponse(
      JSON.stringify({
        success: false,
        message: result.error || '删除失败',
      }),
      { status: 400 }
    );
  }

  return HttpResponse.json({
    success: true,
    message: '播放列表已删除',
  });
});

// 添加视频到播放列表
const addVideoToPlaylist = http.post('/api/playlists/:id/videos', async ({ request, params }) => {
  await mockDelay();
  const playlistId = params.id as string;
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  // 验证用户
  const userId = mockDb.getUserIdFromToken(token || '');
  if (!userId) {
    return new HttpResponse(
      JSON.stringify({
        success: false,
        message: '未授权',
      }),
      { status: 401 }
    );
  }

  // 解析请求体
  const data = (await request.json()) as { videoId?: string };
  const { videoId } = data;

  if (!videoId) {
    return new HttpResponse(
      JSON.stringify({
        success: false,
        message: '缺少视频ID',
      }),
      { status: 400 }
    );
  }

  // 添加视频到播放列表
  const result = mockDb.addVideoToPlaylist(playlistId, videoId, userId);

  if (!result.success) {
    return new HttpResponse(
      JSON.stringify({
        success: false,
        message: result.error || '添加失败',
      }),
      { status: 400 }
    );
  }

  return HttpResponse.json({
    success: true,
    message: '视频已添加到播放列表',
  });
});

// 从播放列表中移除视频
const removeVideoFromPlaylist = http.delete(
  '/api/playlists/:id/videos/:videoId',
  async ({ request, params }) => {
    await mockDelay();
    const playlistId = params.id as string;
    const videoId = params.videoId as string;
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    // 验证用户
    const userId = mockDb.getUserIdFromToken(token || '');
    if (!userId) {
      return new HttpResponse(
        JSON.stringify({
          success: false,
          message: '未授权',
        }),
        { status: 401 }
      );
    }

    // 从播放列表中移除视频
    const result = mockDb.removeVideoFromPlaylist(playlistId, videoId, userId);

    if (!result.success) {
      return new HttpResponse(
        JSON.stringify({
          success: false,
          message: result.error || '移除失败',
        }),
        { status: 400 }
      );
    }

    return HttpResponse.json({
      success: true,
      message: '视频已从播放列表中移除',
    });
  }
);

// 更新视频在播放列表中的位置
const updateVideoPosition = http.put(
  '/api/playlists/:id/videos/:videoId/position',
  async ({ request, params }) => {
    await mockDelay();
    const playlistId = params.id as string;
    const videoId = params.videoId as string;
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    // 验证用户
    const userId = mockDb.getUserIdFromToken(token || '');
    if (!userId) {
      return new HttpResponse(
        JSON.stringify({
          success: false,
          message: '未授权',
        }),
        { status: 401 }
      );
    }

    // 解析请求体
    const data = (await request.json()) as { position?: number };
    const { position } = data;

    if (position === undefined || position < 0) {
      return new HttpResponse(
        JSON.stringify({
          success: false,
          message: '无效的位置参数',
        }),
        { status: 400 }
      );
    }

    // 更新视频位置
    const result = mockDb.updateVideoPosition(playlistId, videoId, position, userId);

    if (!result.success) {
      return new HttpResponse(
        JSON.stringify({
          success: false,
          message: result.error || '更新位置失败',
        }),
        { status: 400 }
      );
    }

    return HttpResponse.json({
      success: true,
      message: '视频位置已更新',
    });
  }
);

// 设置播放列表缩略图
const setPlaylistThumbnail = http.put(
  '/api/playlists/:id/thumbnail',
  async ({ request, params }) => {
    await mockDelay();
    const playlistId = params.id as string;
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    // 验证用户
    const userId = mockDb.getUserIdFromToken(token || '');
    if (!userId) {
      return new HttpResponse(
        JSON.stringify({
          success: false,
          message: '未授权',
        }),
        { status: 401 }
      );
    }

    // 解析请求体
    const data = (await request.json()) as { thumbnailUrl?: string };
    const { thumbnailUrl } = data;

    if (!thumbnailUrl) {
      return new HttpResponse(
        JSON.stringify({
          success: false,
          message: '缺少缩略图URL',
        }),
        { status: 400 }
      );
    }

    // 设置播放列表缩略图
    const result = mockDb.setPlaylistThumbnail(playlistId, thumbnailUrl, userId);

    if (!result.success) {
      return new HttpResponse(
        JSON.stringify({
          success: false,
          message: result.error || '设置缩略图失败',
        }),
        { status: 400 }
      );
    }

    return HttpResponse.json({
      success: true,
      message: '播放列表缩略图已更新',
    });
  }
);

// 分享播放列表
const sharePlaylist = http.post('/api/playlists/:id/share', async ({ request, params }) => {
  await mockDelay();
  const playlistId = params.id as string;
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  // 验证用户
  const userId = mockDb.getUserIdFromToken(token || '');
  if (!userId) {
    return new HttpResponse(
      JSON.stringify({
        success: false,
        message: '未授权',
      }),
      { status: 401 }
    );
  }

  // 获取播放列表详情
  const playlist = mockDb.getPlaylistById(playlistId);

  if (!playlist) {
    return new HttpResponse(
      JSON.stringify({
        success: false,
        message: '播放列表不存在',
      }),
      { status: 404 }
    );
  }

  // 检查权限 - 只有所有者才能分享
  if (playlist.userId !== userId) {
    return new HttpResponse(
      JSON.stringify({
        success: false,
        message: '没有权限分享此播放列表',
      }),
      { status: 403 }
    );
  }

  // 解析分享对象
  const data = (await request.json()) as {
    shareType: 'link' | 'social';
    platform?: 'wechat' | 'weibo' | 'qq';
    emailAddresses?: string[];
  };

  // 如果是私有播放列表，自动转为未列出状态
  if (playlist.visibility === 'private') {
    mockDb.updatePlaylist(playlistId, userId, { visibility: 'unlisted' });
  }

  // 生成分享链接（实际应用中可能是创建短链接）
  const shareLink = `https://atomvideo.com/playlist/${playlistId}`;

  // 记录分享活动 - 使用公共API而不是直接访问db
  const activity = {
    id: generateId('a-'),
    userId,
    action: '分享了播放列表',
    target: playlist.title,
    targetId: playlist.id,
    timestamp: new Date().toISOString(),
    type: 'video',
  };

  // 注：在实际项目中应添加一个公共方法来添加活动记录
  // 暂时注释掉直接访问db的代码
  // mockDb.db.activities.push(activity);

  return HttpResponse.json({
    success: true,
    data: {
      shareLink,
      platform: data.platform,
      shareType: data.shareType,
    },
  });
});

// 批量更新播放列表中视频的位置
const updatePlaylistVideoPositions = http.post(
  '/api/playlists/:id/videos/positions',
  async ({ request, params }) => {
    await mockDelay();
    const playlistId = params.id as string;
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    // 验证用户
    const userId = mockDb.getUserIdFromToken(token || '');
    if (!userId) {
      return new HttpResponse(
        JSON.stringify({
          success: false,
          message: '未授权',
        }),
        { status: 401 }
      );
    }

    // 解析请求体
    const data = (await request.json()) as {
      videoPositions?: Array<{ videoId: string; position: number }>;
    };
    const { videoPositions } = data;

    if (!videoPositions || !Array.isArray(videoPositions) || videoPositions.length === 0) {
      return new HttpResponse(
        JSON.stringify({
          success: false,
          message: '无效的视频位置参数',
        }),
        { status: 400 }
      );
    }

    // 检查参数是否有效
    for (const item of videoPositions) {
      if (!item.videoId || item.position === undefined || item.position < 0) {
        return new HttpResponse(
          JSON.stringify({
            success: false,
            message: '无效的视频位置数据',
          }),
          { status: 400 }
        );
      }
    }

    // 逐个更新视频位置
    const results = [];
    for (const { videoId, position } of videoPositions) {
      const result = mockDb.updateVideoPosition(playlistId, videoId, position, userId);
      results.push({ videoId, result });

      if (!result.success) {
        return new HttpResponse(
          JSON.stringify({
            success: false,
            message: result.error || `更新视频 ${videoId} 位置失败`,
            failedVideo: videoId,
          }),
          { status: 400 }
        );
      }
    }

    return HttpResponse.json({
      success: true,
      message: '视频位置已批量更新',
    });
  }
);

// 导出所有播放列表处理程序
export const playlistHandlers = [
  getUserPlaylists,
  getPlaylistDetail,
  getPlaylistVideos,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  updateVideoPosition,
  updatePlaylistVideoPositions,
  setPlaylistThumbnail,
  sharePlaylist,
];

export default playlistHandlers;
