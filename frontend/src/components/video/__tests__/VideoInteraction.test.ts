/**
 * @file VideoInteraction.test.ts
 * @description VideoInteraction 组件的测试用例
 * @author Atom Video Team
 * @date 2025-04-06
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import VideoInteraction from '../VideoInteraction.vue';

describe('VideoInteraction', () => {
  it('应该正确渲染交互按钮', () => {
    const wrapper = mount(VideoInteraction, {
      props: {
        likes: 100,
        favorites: 50,
        comments: 30,
        isLiked: false,
        isFavorited: false,
      },
    });

    expect(wrapper.find('.like-button').exists()).toBe(true);
    expect(wrapper.find('.favorite-button').exists()).toBe(true);
    expect(wrapper.find('.comment-button').exists()).toBe(true);
  });

  it('应该正确显示交互数量', () => {
    const wrapper = mount(VideoInteraction, {
      props: {
        likes: 1000,
        favorites: 500,
        comments: 300,
        isLiked: false,
        isFavorited: false,
      },
    });

    expect(wrapper.find('.like-count').text()).toBe('1.0k');
    expect(wrapper.find('.favorite-count').text()).toBe('500');
    expect(wrapper.find('.comment-count').text()).toBe('300');
  });

  it('应该正确显示交互状态', () => {
    const wrapper = mount(VideoInteraction, {
      props: {
        likes: 100,
        favorites: 50,
        comments: 30,
        isLiked: true,
        isFavorited: true,
      },
    });

    expect(wrapper.find('.like-button').classes()).toContain('active');
    expect(wrapper.find('.favorite-button').classes()).toContain('active');
  });

  it('应该触发点赞事件', async () => {
    const wrapper = mount(VideoInteraction, {
      props: {
        likes: 100,
        favorites: 50,
        comments: 30,
        isLiked: false,
        isFavorited: false,
      },
    });

    await wrapper.find('.like-button').trigger('click');
    expect(wrapper.emitted('like')).toBeTruthy();
  });

  it('应该触发收藏事件', async () => {
    const wrapper = mount(VideoInteraction, {
      props: {
        likes: 100,
        favorites: 50,
        comments: 30,
        isLiked: false,
        isFavorited: false,
      },
    });

    await wrapper.find('.favorite-button').trigger('click');
    expect(wrapper.emitted('favorite')).toBeTruthy();
  });

  it('应该触发评论事件', async () => {
    const wrapper = mount(VideoInteraction, {
      props: {
        likes: 100,
        favorites: 50,
        comments: 30,
        isLiked: false,
        isFavorited: false,
      },
    });

    await wrapper.find('.comment-button').trigger('click');
    expect(wrapper.emitted('comment')).toBeTruthy();
  });

  it('应该正确处理数字格式化', () => {
    const wrapper = mount(VideoInteraction, {
      props: {
        likes: 1234567,
        favorites: 9999,
        comments: 888,
        isLiked: false,
        isFavorited: false,
      },
    });

    expect(wrapper.find('.like-count').text()).toBe('1.2M');
    expect(wrapper.find('.favorite-count').text()).toBe('9.9k');
    expect(wrapper.find('.comment-count').text()).toBe('888');
  });

  it('应该在移动端视图下调整布局', () => {
    // 模拟移动端视口
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));

    const wrapper = mount(VideoInteraction, {
      props: {
        likes: 100,
        favorites: 50,
        comments: 30,
        isLiked: false,
        isFavorited: false,
      },
    });

    const interactionContainer = wrapper.find('.interaction-container');
    expect(interactionContainer.classes()).toContain('mobile-view');
  });
});
