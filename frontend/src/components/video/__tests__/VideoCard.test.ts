/**
 * @file VideoCard.test.ts
 * @description VideoCard 组件的测试用例
 * @author Atom Video Team
 * @date 2025-04-06
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import VideoCard from '../VideoCard.vue';

// 模拟视频数据
const mockVideo = {
  id: '1',
  title: '测试视频标题',
  description: '这是一个测试视频描述',
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
  },
  tags: ['测试', '视频'],
};

describe('VideoCard', () => {
  it('应该正确渲染视频信息', () => {
    const wrapper = mount(VideoCard, {
      props: {
        video: mockVideo,
      },
    });

    expect(wrapper.find('.video-title').text()).toBe('测试视频标题');
    expect(wrapper.find('.video-author').text()).toBe('测试用户');
    expect(wrapper.find('.video-views').text()).toBe('1.0k 次观看');
    expect(wrapper.find('.video-likes').text()).toBe('100');
    expect(wrapper.find('.video-favorites').text()).toBe('50');
  });

  it('应该正确格式化视频时长', () => {
    const wrapper = mount(VideoCard, {
      props: {
        video: {
          ...mockVideo,
          duration: 3665, // 1小时1分5秒
        },
      },
    });

    expect(wrapper.find('.video-duration').text()).toBe('1:01:05');
  });

  it('应该正确渲染标签', () => {
    const wrapper = mount(VideoCard, {
      props: {
        video: mockVideo,
      },
    });

    const tags = wrapper.findAll('.video-tag');
    expect(tags).toHaveLength(2);
    expect(tags[0].text()).toBe('测试');
    expect(tags[1].text()).toBe('视频');
  });

  it('应该在缩略图加载失败时显示默认图片', async () => {
    const wrapper = mount(VideoCard, {
      props: {
        video: mockVideo,
      },
    });

    const thumbnail = wrapper.find('.video-thumbnail img');
    await thumbnail.trigger('error');
    expect(thumbnail.attributes('src')).toBe('/images/default-thumbnail.jpg');
  });

  it('应该触发点击事件', async () => {
    const wrapper = mount(VideoCard, {
      props: {
        video: mockVideo,
      },
    });

    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
  });

  it('应该正确处理交互按钮点击', async () => {
    const wrapper = mount(VideoCard, {
      props: {
        video: mockVideo,
      },
    });

    const likeButton = wrapper.find('.video-likes');
    const favoriteButton = wrapper.find('.video-favorites');

    await likeButton.trigger('click');
    expect(wrapper.emitted('like')).toBeTruthy();

    await favoriteButton.trigger('click');
    expect(wrapper.emitted('favorite')).toBeTruthy();
  });

  it('应该正确格式化数字', () => {
    const wrapper = mount(VideoCard, {
      props: {
        video: {
          ...mockVideo,
          views: 1234567,
          likes: 9999,
          favorites: 888,
        },
      },
    });

    expect(wrapper.find('.video-views').text()).toBe('1.2M 次观看');
    expect(wrapper.find('.video-likes').text()).toBe('9.9k');
    expect(wrapper.find('.video-favorites').text()).toBe('888');
  });
});
