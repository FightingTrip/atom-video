/**
 * @file LazyImage.test.ts
 * @description LazyImage 组件的测试用例
 * @author Atom Video Team
 * @date 2025-04-06
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import LazyImage from '../LazyImage.vue';

describe('LazyImage', () => {
  it('应该正确渲染懒加载图片组件', () => {
    const wrapper = mount(LazyImage, {
      props: {
        src: 'https://example.com/image.jpg',
        alt: '测试图片',
      },
    });

    expect(wrapper.find('.lazy-image').exists()).toBe(true);
    expect(wrapper.find('.image-placeholder').exists()).toBe(true);
  });

  it('应该显示加载状态', () => {
    const wrapper = mount(LazyImage, {
      props: {
        src: 'https://example.com/image.jpg',
        alt: '测试图片',
      },
    });

    expect(wrapper.find('.loading-spinner').exists()).toBe(true);
  });

  it('应该显示加载错误状态', async () => {
    const wrapper = mount(LazyImage, {
      props: {
        src: 'https://example.com/image.jpg',
        alt: '测试图片',
      },
    });

    // 模拟图片加载错误
    await wrapper.setData({
      loading: false,
      error: '图片加载失败',
      loaded: false,
    });

    expect(wrapper.find('.error-icon').exists()).toBe(true);
    expect(wrapper.find('.error-text').text()).toBe('图片加载失败');
  });

  it('应该正确显示加载的图片', async () => {
    const wrapper = mount(LazyImage, {
      props: {
        src: 'https://example.com/image.jpg',
        alt: '测试图片',
      },
    });

    // 模拟图片加载成功
    await wrapper.setData({
      loading: false,
      error: null,
      loaded: true,
    });

    const img = wrapper.find('img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe('https://example.com/image.jpg');
    expect(img.attributes('alt')).toBe('测试图片');
  });

  it('应该触发重试事件', async () => {
    const wrapper = mount(LazyImage, {
      props: {
        src: 'https://example.com/image.jpg',
        alt: '测试图片',
      },
    });

    // 模拟图片加载错误
    await wrapper.setData({
      loading: false,
      error: '加载失败',
      loaded: false,
    });

    const retryButton = wrapper.find('.retry-button');
    await retryButton.trigger('click');
    expect(wrapper.emitted('retry')).toBeTruthy();
  });

  it('应该正确应用黑白主题样式', () => {
    const wrapper = mount(LazyImage, {
      props: {
        src: 'https://example.com/image.jpg',
        alt: '测试图片',
      },
    });

    const lazyImage = wrapper.find('.lazy-image');
    expect(lazyImage.classes()).toContain('theme-black');
  });

  it('应该正确处理图片加载进度', async () => {
    const wrapper = mount(LazyImage, {
      props: {
        src: 'https://example.com/image.jpg',
        alt: '测试图片',
      },
    });

    // 模拟加载进度
    await wrapper.setData({ progress: 75 });
    expect(wrapper.find('.progress-bar').attributes('style')).toContain('width: 75%');
  });

  it('应该在移动端视图下调整布局', () => {
    // 模拟移动端视口
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));

    const wrapper = mount(LazyImage, {
      props: {
        src: 'https://example.com/image.jpg',
        alt: '测试图片',
      },
    });

    const lazyImage = wrapper.find('.lazy-image');
    expect(lazyImage.classes()).toContain('mobile-view');
  });
});
