/**
 * @file VideoPlayer.test.ts
 * @description VideoPlayer 组件的测试用例
 * @author Atom Video Team
 * @date 2025-04-06
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import VideoPlayer from '../VideoPlayer.vue';

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
  },
};

describe('VideoPlayer', () => {
  it('应该正确渲染视频播放器', () => {
    const wrapper = mount(VideoPlayer, {
      props: {
        video: mockVideo,
        autoplay: false,
        controls: true,
      },
    });

    expect(wrapper.find('.video-player').exists()).toBe(true);
    expect(wrapper.find('video').exists()).toBe(true);
  });

  it('应该正确设置视频源', () => {
    const wrapper = mount(VideoPlayer, {
      props: {
        video: mockVideo,
        autoplay: false,
        controls: true,
      },
    });

    const videoElement = wrapper.find('video');
    expect(videoElement.attributes('src')).toBe(mockVideo.videoUrl);
    expect(videoElement.attributes('poster')).toBe(mockVideo.thumbnail);
  });

  it('应该根据 props 设置播放器属性', () => {
    const wrapper = mount(VideoPlayer, {
      props: {
        video: mockVideo,
        autoplay: true,
        controls: false,
        loop: true,
        muted: true,
      },
    });

    const videoElement = wrapper.find('video');
    expect(videoElement.attributes('autoplay')).toBeDefined();
    expect(videoElement.attributes('controls')).toBeUndefined();
    expect(videoElement.attributes('loop')).toBeDefined();
    expect(videoElement.attributes('muted')).toBeDefined();
  });

  it('应该触发播放事件', async () => {
    const wrapper = mount(VideoPlayer, {
      props: {
        video: mockVideo,
        autoplay: false,
        controls: true,
      },
    });

    const videoElement = wrapper.find('video');
    await videoElement.trigger('play');
    expect(wrapper.emitted('play')).toBeTruthy();
  });

  it('应该触发暂停事件', async () => {
    const wrapper = mount(VideoPlayer, {
      props: {
        video: mockVideo,
        autoplay: false,
        controls: true,
      },
    });

    const videoElement = wrapper.find('video');
    await videoElement.trigger('pause');
    expect(wrapper.emitted('pause')).toBeTruthy();
  });

  it('应该触发进度更新事件', async () => {
    const wrapper = mount(VideoPlayer, {
      props: {
        video: mockVideo,
        autoplay: false,
        controls: true,
      },
    });

    const videoElement = wrapper.find('video');
    await videoElement.trigger('timeupdate');
    expect(wrapper.emitted('progress')).toBeTruthy();
  });

  it('应该触发错误事件', async () => {
    const wrapper = mount(VideoPlayer, {
      props: {
        video: mockVideo,
        autoplay: false,
        controls: true,
      },
    });

    const videoElement = wrapper.find('video');
    await videoElement.trigger('error');
    expect(wrapper.emitted('error')).toBeTruthy();
  });

  it('应该正确处理全屏切换', async () => {
    const wrapper = mount(VideoPlayer, {
      props: {
        video: mockVideo,
        autoplay: false,
        controls: true,
      },
    });

    const fullscreenButton = wrapper.find('.fullscreen-button');
    await fullscreenButton.trigger('click');
    expect(wrapper.emitted('fullscreen-change')).toBeTruthy();
  });

  it('应该在移动端视图下调整布局', () => {
    // 模拟移动端视口
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));

    const wrapper = mount(VideoPlayer, {
      props: {
        video: mockVideo,
        autoplay: false,
        controls: true,
      },
    });

    const playerContainer = wrapper.find('.player-container');
    expect(playerContainer.classes()).toContain('mobile-view');
  });
});
