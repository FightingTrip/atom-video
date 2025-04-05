/**
 * @file VideoCardSkeleton.test.ts
 * @description VideoCardSkeleton 组件的测试用例
 * @author Atom Video Team
 * @date 2025-04-06
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import VideoCardSkeleton from '../VideoCardSkeleton.vue';

describe('VideoCardSkeleton', () => {
  it('应该正确渲染骨架屏', () => {
    const wrapper = mount(VideoCardSkeleton);
    expect(wrapper.find('.skeleton-container').exists()).toBe(true);
    expect(wrapper.find('.skeleton-thumbnail').exists()).toBe(true);
    expect(wrapper.find('.skeleton-title').exists()).toBe(true);
    expect(wrapper.find('.skeleton-author').exists()).toBe(true);
    expect(wrapper.find('.skeleton-stats').exists()).toBe(true);
  });

  it('应该根据 rows 属性渲染多个骨架屏', () => {
    const wrapper = mount(VideoCardSkeleton, {
      props: {
        rows: 3,
      },
    });

    const containers = wrapper.findAll('.skeleton-container');
    expect(containers).toHaveLength(3);
  });

  it('应该应用正确的样式类', () => {
    const wrapper = mount(VideoCardSkeleton);
    expect(wrapper.classes()).toContain('video-card-skeleton');
  });

  it('应该具有动画效果', () => {
    const wrapper = mount(VideoCardSkeleton);
    const skeleton = wrapper.find('.skeleton-thumbnail');
    expect(skeleton.classes()).toContain('skeleton-animation');
  });

  it('应该在移动端视图下调整布局', () => {
    // 模拟移动端视口
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));

    const wrapper = mount(VideoCardSkeleton);
    const container = wrapper.find('.skeleton-container');
    expect(container.classes()).toContain('mobile-view');
  });
});
