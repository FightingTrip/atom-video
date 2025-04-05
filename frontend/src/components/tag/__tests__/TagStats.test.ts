/**
 * @file TagStats.test.ts
 * @description TagStats 组件的测试用例
 * @author Atom Video Team
 * @date 2025-04-06
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TagStats from '../TagStats.vue';

// 模拟统计数据
const mockStats = {
  totalTags: 100,
  totalUsage: 5000,
  averageUsage: 50,
  topTags: [
    { id: '1', name: '标签1', count: 200 },
    { id: '2', name: '标签2', count: 150 },
    { id: '3', name: '标签3', count: 100 },
  ],
};

describe('TagStats', () => {
  it('应该正确渲染标签统计', () => {
    const wrapper = mount(TagStats, {
      props: {
        stats: mockStats,
      },
    });

    expect(wrapper.find('.tag-stats').exists()).toBe(true);
    expect(wrapper.find('.stats-grid').exists()).toBe(true);
  });

  it('应该正确显示统计信息', () => {
    const wrapper = mount(TagStats, {
      props: {
        stats: mockStats,
      },
    });

    expect(wrapper.find('.total-tags').text()).toBe('100');
    expect(wrapper.find('.total-usage').text()).toBe('5000');
    expect(wrapper.find('.average-usage').text()).toBe('50');
  });

  it('应该正确显示热门标签', () => {
    const wrapper = mount(TagStats, {
      props: {
        stats: mockStats,
      },
    });

    const topTags = wrapper.findAll('.top-tag');
    expect(topTags).toHaveLength(3);
    expect(topTags[0].find('.tag-name').text()).toBe('标签1');
    expect(topTags[0].find('.tag-count').text()).toBe('200');
  });

  it('应该触发标签点击事件', async () => {
    const wrapper = mount(TagStats, {
      props: {
        stats: mockStats,
      },
    });

    const firstTag = wrapper.find('.top-tag');
    await firstTag.trigger('click');
    expect(wrapper.emitted('tag-click')).toBeTruthy();
  });

  it('应该支持时间范围选择', async () => {
    const wrapper = mount(TagStats, {
      props: {
        stats: mockStats,
      },
    });

    const timeRangeSelect = wrapper.find('.time-range-select');
    await timeRangeSelect.setValue('week');
    expect(wrapper.emitted('time-range-change')).toBeTruthy();
  });

  it('应该在移动端视图下调整布局', () => {
    // 模拟移动端视口
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));

    const wrapper = mount(TagStats, {
      props: {
        stats: mockStats,
      },
    });

    const tagStats = wrapper.find('.tag-stats');
    expect(tagStats.classes()).toContain('mobile-view');
  });

  it('应该正确应用黑白主题样式', () => {
    const wrapper = mount(TagStats, {
      props: {
        stats: mockStats,
      },
    });

    const tagStats = wrapper.find('.tag-stats');
    expect(tagStats.classes()).toContain('theme-black');
  });
});
