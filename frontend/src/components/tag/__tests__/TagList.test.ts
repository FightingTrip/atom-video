/**
 * @file TagList.test.ts
 * @description TagList 组件的测试用例
 * @author Atom Video Team
 * @date 2025-04-06
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TagList from '../TagList.vue';

// 模拟标签数据
const mockTags = [
  { id: '1', name: '标签1', count: 10, description: '标签1的描述' },
  { id: '2', name: '标签2', count: 20, description: '标签2的描述' },
  { id: '3', name: '标签3', count: 15, description: '标签3的描述' },
];

describe('TagList', () => {
  it('应该正确渲染标签列表', () => {
    const wrapper = mount(TagList, {
      props: {
        tags: mockTags,
      },
    });

    expect(wrapper.find('.tag-list').exists()).toBe(true);
    const tagItems = wrapper.findAll('.tag-item');
    expect(tagItems).toHaveLength(3);
  });

  it('应该正确显示标签信息', () => {
    const wrapper = mount(TagList, {
      props: {
        tags: mockTags,
      },
    });

    const firstTag = wrapper.find('.tag-item');
    expect(firstTag.find('.tag-name').text()).toBe('标签1');
    expect(firstTag.find('.tag-count').text()).toBe('10');
    expect(firstTag.find('.tag-description').text()).toBe('标签1的描述');
  });

  it('应该触发标签点击事件', async () => {
    const wrapper = mount(TagList, {
      props: {
        tags: mockTags,
      },
    });

    const firstTag = wrapper.find('.tag-item');
    await firstTag.trigger('click');
    expect(wrapper.emitted('tag-click')).toBeTruthy();
  });

  it('应该支持标签搜索', async () => {
    const wrapper = mount(TagList, {
      props: {
        tags: mockTags,
      },
    });

    const searchInput = wrapper.find('.search-input');
    await searchInput.setValue('标签1');
    expect(wrapper.find('.tag-item').find('.tag-name').text()).toBe('标签1');
  });

  it('应该支持标签排序', async () => {
    const wrapper = mount(TagList, {
      props: {
        tags: mockTags,
      },
    });

    const sortButton = wrapper.find('.sort-button');
    await sortButton.trigger('click');
    const tagItems = wrapper.findAll('.tag-item');
    expect(tagItems[0].find('.tag-count').text()).toBe('20');
  });

  it('应该在移动端视图下调整布局', () => {
    // 模拟移动端视口
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));

    const wrapper = mount(TagList, {
      props: {
        tags: mockTags,
      },
    });

    const tagList = wrapper.find('.tag-list');
    expect(tagList.classes()).toContain('mobile-view');
  });

  it('应该正确应用黑白主题样式', () => {
    const wrapper = mount(TagList, {
      props: {
        tags: mockTags,
      },
    });

    const tagList = wrapper.find('.tag-list');
    expect(tagList.classes()).toContain('theme-black');
  });
});
