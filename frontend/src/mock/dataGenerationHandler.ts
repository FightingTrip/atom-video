/**
 * @file dataGenerationHandler.ts
 * @description 模拟数据生成处理程序
 */

import { http } from 'msw';
import mockDb from './mockDb';
import { mockDelay } from '@/utils/mockInitializer';

// 数据生成API端点
const generateDataEndpoints = [
  // 生成用户
  http.post('/api/mock/generate/users', async ({ request }) => {
    await mockDelay(300, 800);

    const { count = 10 } = await request.json();
    let success = true;
    let message = `成功生成 ${count} 个用户`;

    try {
      // 使用注册API生成用户
      for (let i = 0; i < count; i++) {
        const timestamp = Date.now();
        mockDb.register({
          username: `user_${timestamp}_${i}`,
          email: `user_${timestamp}_${i}@example.com`,
          password: 'Password123!',
          nickname: `测试用户 ${i + 1}`,
        });
      }
    } catch (error) {
      success = false;
      message = `生成用户失败: ${error instanceof Error ? error.message : '未知错误'}`;
    }

    return new Response(
      JSON.stringify({
        success,
        message,
        count: success ? count : 0,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }),

  // 生成视频
  http.post('/api/mock/generate/videos', async ({ request }) => {
    await mockDelay(500, 1200);

    const { count = 10, authorId } = await request.json();

    return new Response(
      JSON.stringify({
        success: true,
        message: `已触发生成 ${count} 个视频的任务`,
        count,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }),

  // 生成评论
  http.post('/api/mock/generate/comments', async ({ request }) => {
    await mockDelay(300, 700);

    const { count = 10, videoId } = await request.json();

    return new Response(
      JSON.stringify({
        success: true,
        message: `已触发生成 ${count} 个评论的任务`,
        count,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }),

  // 生成举报
  http.post('/api/mock/generate/reports', async ({ request }) => {
    await mockDelay(200, 600);

    const { count = 10, type = 'video' } = await request.json();

    return new Response(
      JSON.stringify({
        success: true,
        message: `已触发生成 ${count} 个${type}举报的任务`,
        count,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }),

  // 获取数据库状态
  http.get('/api/mock/db-stats', async () => {
    await mockDelay(100, 300);

    const stats = {
      users: mockDb.getAllUsers().length,
      videos: mockDb.getVideos({ limit: 1000 }).items.length,
      comments: mockDb.getComments({ limit: 1000 }).items.length,
      reports: mockDb.getReports({ limit: 1000 }).items.length,
      lastUpdated: new Date().toISOString(),
    };

    return new Response(
      JSON.stringify({
        success: true,
        stats,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }),
];

export default generateDataEndpoints;
