/**
 * @file TagFilter.test.ts
 * @description TagFilter 组件的测试用例
 * @author Atom Video Team
 * @date 2025-04-06
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { createI18n } from 'vue-i18n';
import { useTagStore } from '@/stores/tag';
import TagFilter from '../TagFilter.vue';

// Mock store
vi.mock('@/stores/tag', () => ({
  useTagStore: vi.fn(() => ({
    tags: [],
    fetchTags: vi.fn(),
    loading: false,
    error: null,
  })),
}));

// 创建 i18n 实例
const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  messages: {
    'zh-CN': {
      tag: {
        search: '搜索标签',
        filter: '筛选',
        sort: '排序',
        select: '选择',
      },
    },
    'en-US': {
      tag: {
        search: 'Search Tags',
        filter: 'Filter',
        sort: 'Sort',
        select: 'Select',
      },
    },
  },
});

describe('TagFilter', () => {
  let wrapper: any;
  let tagStore: any;

  beforeEach(() => {
    const pinia = createTestingPinia();
    tagStore = useTagStore(pinia);

    wrapper = mount(TagFilter, {
      global: {
        plugins: [pinia, i18n],
      },
    });
  });

  it('正确渲染标签筛选组件', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.tag-filter').exists()).toBe(true);
  });

  it('显示搜索输入框', () => {
    expect(wrapper.find('.search-input').exists()).toBe(true);
  });

  it('显示筛选选项', () => {
    expect(wrapper.find('.filter-options').exists()).toBe(true);
    expect(wrapper.find('.sort-options').exists()).toBe(true);
  });

  it('搜索标签', async () => {
    const searchQuery = '测试标签';
    await wrapper.find('.search-input').setValue(searchQuery);
    await wrapper.find('.search-button').trigger('click');

    expect(tagStore.fetchTags).toHaveBeenCalledWith({
      search: searchQuery,
    });
  });

  it('应用筛选条件', async () => {
    await wrapper.find('.usage-filter').setValue('high');
    await wrapper.find('.date-filter').setValue('week');
    await wrapper.find('.apply-filters').trigger('click');

    expect(tagStore.fetchTags).toHaveBeenCalledWith({
      usage: 'high',
      dateRange: 'week',
    });
  });

  it('更改排序方式', async () => {
    await wrapper.find('.sort-select').setValue('usage');
    await wrapper.find('.apply-sort').trigger('click');

    expect(tagStore.fetchTags).toHaveBeenCalledWith({
      sort: 'usage',
    });
  });

  it('多选标签', async () => {
    const mockTags = [
      { id: '1', name: '标签1' },
      { id: '2', name: '标签2' },
      { id: '3', name: '标签3' },
    ];

    tagStore.tags = mockTags;
    await wrapper.vm.$nextTick();

    await wrapper.find('.tag-checkbox[data-id="1"]').setValue(true);
    await wrapper.find('.tag-checkbox[data-id="2"]').setValue(true);

    expect(wrapper.vm.selectedTags).toHaveLength(2);
    expect(wrapper.vm.selectedTags).toContain('1');
    expect(wrapper.vm.selectedTags).toContain('2');
  });

  it('显示加载状态', async () => {
    tagStore.loading = true;
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.loading-spinner').exists()).toBe(true);
  });

  it('显示错误信息', async () => {
    tagStore.error = '加载失败';
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.error-message').exists()).toBe(true);
    expect(wrapper.find('.error-message').text()).toBe('加载失败');
  });

  it('响应式布局调整', async () => {
    // 模拟移动端屏幕
    global.innerWidth = 375;
    global.dispatchEvent(new Event('resize'));
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.mobile-layout').exists()).toBe(true);
  });

  it('应用主题样式', async () => {
    // 模拟暗色主题
    document.documentElement.classList.add('dark');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.dark-theme').exists()).toBe(true);
  });
});
