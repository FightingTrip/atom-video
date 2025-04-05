/**
 * @file TagCloud.test.ts
 * @description TagCloud 组件的测试用例
 * @author Atom Video Team
 * @date 2025-04-06
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TagCloud from '../TagCloud.vue';

// 模拟标签数据
const mockTags = [
  { id: '1', name: '标签1', count: 10 },
  { id: '2', name: '标签2', count: 20 },
  { id: '3', name: '标签3', count: 15 },
];

describe('TagCloud', () => {
  it('应该正确渲染标签云', () => {
    const wrapper = mount(TagCloud, {
      props: {
        tags: mockTags,
      },
    });

    expect(wrapper.find('.tag-cloud').exists()).toBe(true);
    const tagItems = wrapper.findAll('.tag-item');
    expect(tagItems).toHaveLength(3);
  });

  it('应该正确显示标签名称和数量', () => {
    const wrapper = mount(TagCloud, {
      props: {
        tags: mockTags,
      },
    });

    const tagItems = wrapper.findAll('.tag-item');
    expect(tagItems[0].find('.tag-name').text()).toBe('标签1');
    expect(tagItems[0].find('.tag-count').text()).toBe('10');
  });

  it('应该根据数量设置不同的标签大小', () => {
    const wrapper = mount(TagCloud, {
      props: {
        tags: mockTags,
      },
    });

    const tagItems = wrapper.findAll('.tag-item');
    const maxCount = Math.max(...mockTags.map(tag => tag.count));
    const maxTag = tagItems.find(item => item.find('.tag-count').text() === maxCount.toString());

    expect(maxTag.classes()).toContain('tag-large');
  });

  it('应该触发标签点击事件', async () => {
    const wrapper = mount(TagCloud, {
      props: {
        tags: mockTags,
      },
    });

    const firstTag = wrapper.find('.tag-item');
    await firstTag.trigger('click');
    expect(wrapper.emitted('tag-click')).toBeTruthy();
  });

  it('应该在移动端视图下调整布局', () => {
    // 模拟移动端视口
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));

    const wrapper = mount(TagCloud, {
      props: {
        tags: mockTags,
      },
    });

    const tagCloud = wrapper.find('.tag-cloud');
    expect(tagCloud.classes()).toContain('mobile-view');
  });

  it('应该正确应用黑白主题样式', () => {
    const wrapper = mount(TagCloud, {
      props: {
        tags: mockTags,
      },
    });

    const tagCloud = wrapper.find('.tag-cloud');
    expect(tagCloud.classes()).toContain('theme-black');
  });
});
