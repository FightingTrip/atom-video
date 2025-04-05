/**
 * @file TheSidebar.test.ts
 * @description TheSidebar 组件的测试用例
 * @author Atom Video Team
 * @date 2025-04-06
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { createRouter, createWebHistory } from 'vue-router';
import { createTestingPinia } from '@pinia/testing';
import TheSidebar from '../TheSidebar.vue';

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
        bio: '这是一段个人简介',
      },
    },
  },
});

describe('TheSidebar', () => {
  it('应该正确渲染所有菜单项', () => {
    const wrapper = mount(TheSidebar, {
      global: {
        plugins: [router, pinia],
      },
    });

    const navItems = wrapper.findAll('.nav-item');
    expect(navItems).toHaveLength(6);
    expect(navItems[0].text()).toContain('首页');
    expect(navItems[1].text()).toContain('发现');
    expect(navItems[2].text()).toContain('关注');
    expect(navItems[3].text()).toContain('上传');
    expect(navItems[4].text()).toContain('收藏夹');
    expect(navItems[5].text()).toContain('设置');
  });

  it('应该根据当前路由高亮对应的菜单项', async () => {
    const wrapper = mount(TheSidebar, {
      global: {
        plugins: [router, pinia],
      },
    });

    await router.push('/');
    expect(wrapper.find('.nav-item.active').text()).toContain('首页');

    await router.push('/discover');
    expect(wrapper.find('.nav-item.active').text()).toContain('发现');
  });

  it('应该在折叠状态下隐藏文本', async () => {
    const wrapper = mount(TheSidebar, {
      global: {
        plugins: [router, pinia],
      },
    });

    const collapseBtn = wrapper.find('.collapse-btn');
    await collapseBtn.trigger('click');

    const navItems = wrapper.findAll('.nav-item');
    navItems.forEach(item => {
      expect(item.find('span').exists()).toBe(false);
    });
  });

  it('应该在登录状态下显示用户信息', () => {
    const wrapper = mount(TheSidebar, {
      global: {
        plugins: [router, pinia],
      },
    });

    const userInfo = wrapper.find('.user-info');
    expect(userInfo.exists()).toBe(true);
    expect(wrapper.find('.username').text()).toBe('测试用户');
    expect(wrapper.find('.user-bio').text()).toBe('这是一段个人简介');
  });

  it('应该在未登录状态下隐藏用户信息', () => {
    const wrapper = mount(TheSidebar, {
      global: {
        plugins: [router, createTestingPinia()],
      },
    });

    expect(wrapper.find('.user-info').exists()).toBe(false);
  });

  it('应该在移动端视图下默认隐藏', () => {
    // 模拟移动端视口
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));

    const wrapper = mount(TheSidebar, {
      global: {
        plugins: [router, pinia],
      },
    });

    expect(wrapper.find('.the-sidebar').classes()).not.toContain('is-collapsed');
  });
});
