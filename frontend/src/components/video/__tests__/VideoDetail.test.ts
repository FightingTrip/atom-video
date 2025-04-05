/**
 * @file VideoDetail.test.ts
 * @description VideoDetail 组件的测试用例
 * @author Atom Video Team
 * @date 2025-04-06
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { createRouter, createWebHistory } from 'vue-router';
import VideoDetail from '../VideoDetail.vue';

// 创建测试用的路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/video/:id',
      component: { template: '<div>视频详情</div>' },
    },
  ],
});

// 模拟视频数据
const mockVideo = {
  id: '1',
  title: '测试视频',
  description: '这是一个测试视频',
  videoUrl: 'https://example.com/video.mp4',
  thumbnail: 'https://example.com/thumbnail.jpg',
  duration: 180,
  views: 1000,
  likes: 100,
  favorites: 50,
  createdAt: '2025-04-06T12:00:00Z',
  author: {
    id: '1',
    nickname: '测试用户',
    avatar: 'https://example.com/avatar.jpg',
    description: '这是一个测试用户',
    followersCount: 1000,
    followingCount: 500,
  },
  tags: ['测试', '视频'],
  comments: [
    {
      id: '1',
      content: '这是一条测试评论',
      createdAt: '2025-04-06T12:30:00Z',
      author: {
        id: '2',
        nickname: '评论用户',
        avatar: 'https://example.com/comment-avatar.jpg',
      },
      likes: 10,
      replies: [],
    },
  ],
};

describe('VideoDetail', () => {
  it('应该正确渲染视频详情', () => {
    const wrapper = mount(VideoDetail, {
      global: {
        plugins: [router],
      },
      props: {
        video: mockVideo,
        loading: false,
        error: null,
      },
    });

    expect(wrapper.find('.video-title').text()).toBe(mockVideo.title);
    expect(wrapper.find('.video-description').text()).toBe(mockVideo.description);
    expect(wrapper.find('.video-author').text()).toBe(mockVideo.author.nickname);
  });

  it('应该显示加载状态', () => {
    const wrapper = mount(VideoDetail, {
      global: {
        plugins: [router],
      },
      props: {
        video: null,
        loading: true,
        error: null,
      },
    });

    expect(wrapper.find('.loading-spinner').exists()).toBe(true);
  });

  it('应该显示错误状态', () => {
    const errorMessage = '加载失败，请重试';
    const wrapper = mount(VideoDetail, {
      global: {
        plugins: [router],
      },
      props: {
        video: null,
        loading: false,
        error: errorMessage,
      },
    });

    expect(wrapper.find('.error-message').text()).toBe(errorMessage);
  });

  it('应该正确渲染作者信息', () => {
    const wrapper = mount(VideoDetail, {
      global: {
        plugins: [router],
      },
      props: {
        video: mockVideo,
        loading: false,
        error: null,
      },
    });

    const authorInfo = wrapper.find('.author-info');
    expect(authorInfo.find('.author-name').text()).toBe(mockVideo.author.nickname);
    expect(authorInfo.find('.author-bio').text()).toBe(mockVideo.author.description);
    expect(authorInfo.find('.author-stats').text()).toContain('1.0k 粉丝');
    expect(authorInfo.find('.author-stats').text()).toContain('500 关注');
  });

  it('应该正确渲染标签', () => {
    const wrapper = mount(VideoDetail, {
      global: {
        plugins: [router],
      },
      props: {
        video: mockVideo,
        loading: false,
        error: null,
      },
    });

    const tags = wrapper.findAll('.video-tag');
    expect(tags).toHaveLength(2);
    expect(tags[0].text()).toBe('测试');
    expect(tags[1].text()).toBe('视频');
  });

  it('应该正确渲染评论列表', () => {
    const wrapper = mount(VideoDetail, {
      global: {
        plugins: [router],
      },
      props: {
        video: mockVideo,
        loading: false,
        error: null,
      },
    });

    const comments = wrapper.findAll('.comment-item');
    expect(comments).toHaveLength(1);
    expect(comments[0].find('.comment-content').text()).toBe('这是一条测试评论');
    expect(comments[0].find('.comment-author').text()).toBe('评论用户');
  });

  it('应该正确处理视频交互', async () => {
    const wrapper = mount(VideoDetail, {
      global: {
        plugins: [router],
      },
      props: {
        video: mockVideo,
        loading: false,
        error: null,
      },
    });

    await wrapper.find('.like-button').trigger('click');
    expect(wrapper.emitted('like')).toBeTruthy();

    await wrapper.find('.favorite-button').trigger('click');
    expect(wrapper.emitted('favorite')).toBeTruthy();
  });

  it('应该正确处理评论提交', async () => {
    const wrapper = mount(VideoDetail, {
      global: {
        plugins: [router],
      },
      props: {
        video: mockVideo,
        loading: false,
        error: null,
      },
    });

    const commentInput = wrapper.find('.comment-input');
    await commentInput.setValue('新评论');
    await commentInput.trigger('keydown.enter');
    expect(wrapper.emitted('comment-submit')).toBeTruthy();
  });

  it('应该在移动端视图下调整布局', () => {
    // 模拟移动端视口
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));

    const wrapper = mount(VideoDetail, {
      global: {
        plugins: [router],
      },
      props: {
        video: mockVideo,
        loading: false,
        error: null,
      },
    });

    const detailContainer = wrapper.find('.detail-container');
    expect(detailContainer.classes()).toContain('mobile-view');
  });
});
