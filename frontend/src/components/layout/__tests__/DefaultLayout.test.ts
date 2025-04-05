/**
 * @file DefaultLayout.test.ts
 * @description DefaultLayout 组件的测试用例
 * @author Atom Video Team
 * @date 2025-04-06
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { createRouter, createWebHistory } from 'vue-router';
import DefaultLayout from '../DefaultLayout.vue';

// 创建测试用的路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/test',
      component: { template: '<div>测试页面</div>' },
      meta: { showSidebar: true },
    },
    {
      path: '/no-sidebar',
      component: { template: '<div>无侧边栏页面</div>' },
      meta: { showSidebar: false },
    },
  ],
});

describe('DefaultLayout', () => {
  it('应该正确渲染所有布局组件', () => {
    const wrapper = mount(DefaultLayout, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.find('.default-layout').exists()).toBe(true);
    expect(wrapper.find('.layout-content').exists()).toBe(true);
    expect(wrapper.find('.main-content').exists()).toBe(true);
  });

  it('应该根据路由配置显示/隐藏侧边栏', async () => {
    const wrapper = mount(DefaultLayout, {
      global: {
        plugins: [router],
      },
    });

    // 测试显示侧边栏的路由
    await router.push('/test');
    expect(wrapper.find('.main-content').classes()).toContain('with-sidebar');

    // 测试不显示侧边栏的路由
    await router.push('/no-sidebar');
    expect(wrapper.find('.main-content').classes()).not.toContain('with-sidebar');
  });

  it('应该在移动端视图下隐藏侧边栏', () => {
    // 模拟移动端视口
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));

    const wrapper = mount(DefaultLayout, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.find('.main-content').classes()).not.toContain('with-sidebar');
  });

  it('应该正确渲染插槽内容', () => {
    const wrapper = mount(DefaultLayout, {
      global: {
        plugins: [router],
      },
      slots: {
        default: '<div class="test-content">测试内容</div>',
      },
    });

    expect(wrapper.find('.test-content').text()).toBe('测试内容');
  });
});
