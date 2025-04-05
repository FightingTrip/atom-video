/**
 * @file TheHeader.test.ts
 * @description TheHeader 组件的测试用例
 * @author Atom Video Team
 * @date 2025-04-06
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { createRouter, createWebHistory } from 'vue-router';
import { createTestingPinia } from '@pinia/testing';
import TheHeader from '../TheHeader.vue';

// 创建测试用的路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: { template: '<div>首页</div>' },
    },
    {
      path: '/discover',
      component: { template: '<div>发现</div>' },
    },
  ],
});

// 创建测试用的 Pinia store
const pinia = createTestingPinia({
  createSpy: vi.fn,
  initialState: {
    user: {
      profile: {
        id: '1',
        username: 'testuser',
        nickname: '测试用户',
        avatar: 'https://example.com/avatar.jpg',
      },
    },
  },
});

describe('TheHeader', () => {
  it('应该正确渲染所有导航项', () => {
    const wrapper = mount(TheHeader, {
      global: {
        plugins: [router, pinia],
      },
    });

    const navItems = wrapper.findAll('.nav-item');
    expect(navItems).toHaveLength(4);
    expect(navItems[0].text()).toBe('首页');
    expect(navItems[1].text()).toBe('发现');
    expect(navItems[2].text()).toBe('关注');
    expect(navItems[3].text()).toBe('上传');
  });

  it('应该根据当前路由高亮对应的导航项', async () => {
    const wrapper = mount(TheHeader, {
      global: {
        plugins: [router, pinia],
      },
    });

    await router.push('/');
    expect(wrapper.find('.nav-item.active').text()).toBe('首页');

    await router.push('/discover');
    expect(wrapper.find('.nav-item.active').text()).toBe('发现');
  });

  it('应该在移动端视图下隐藏搜索框', () => {
    // 模拟移动端视口
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));

    const wrapper = mount(TheHeader, {
      global: {
        plugins: [router, pinia],
      },
    });

    expect(wrapper.find('.search-box').exists()).toBe(false);
  });

  it('应该在未登录状态下显示登录注册按钮', () => {
    const wrapper = mount(TheHeader, {
      global: {
        plugins: [router, createTestingPinia()],
      },
    });

    expect(wrapper.find('.user-menu').text()).toContain('登录');
    expect(wrapper.find('.user-menu').text()).toContain('注册');
  });

  it('应该在登录状态下显示用户头像和下拉菜单', () => {
    const wrapper = mount(TheHeader, {
      global: {
        plugins: [router, pinia],
      },
    });

    expect(wrapper.find('.n-avatar').exists()).toBe(true);
    expect(wrapper.find('.n-dropdown').exists()).toBe(true);
  });

  it('应该正确处理搜索功能', async () => {
    const wrapper = mount(TheHeader, {
      global: {
        plugins: [router, pinia],
      },
    });

    const searchInput = wrapper.find('.n-input input');
    await searchInput.setValue('测试视频');
    await searchInput.trigger('keydown.enter');

    expect(router.currentRoute.value.path).toBe('/search');
    expect(router.currentRoute.value.query.q).toBe('测试视频');
  });
});
