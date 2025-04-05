/**
 * @file UserMenu.test.ts
 * @description UserMenu 组件的测试用例
 * @author Atom Video Team
 * @date 2025-04-06
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { createI18n } from 'vue-i18n';
import { useUserStore } from '@/stores/user';
import UserMenu from '../UserMenu.vue';

// Mock store
vi.mock('@/stores/user', () => ({
  useUserStore: vi.fn(() => ({
    user: null,
    isAuthenticated: false,
    logout: vi.fn(),
  })),
}));

// 创建 i18n 实例
const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  messages: {
    'zh-CN': {
      user: {
        login: '登录',
        register: '注册',
        profile: '个人资料',
        settings: '设置',
        logout: '退出登录',
      },
    },
    'en-US': {
      user: {
        login: 'Login',
        register: 'Register',
        profile: 'Profile',
        settings: 'Settings',
        logout: 'Logout',
      },
    },
  },
});

describe('UserMenu', () => {
  let wrapper: any;
  let userStore: any;

  beforeEach(() => {
    const pinia = createTestingPinia();
    userStore = useUserStore(pinia);

    wrapper = mount(UserMenu, {
      global: {
        plugins: [pinia, i18n],
      },
    });
  });

  it('正确渲染用户菜单组件', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.user-menu').exists()).toBe(true);
  });

  it('未登录时显示登录/注册按钮', () => {
    userStore.isAuthenticated = false;
    expect(wrapper.find('.login-button').exists()).toBe(true);
    expect(wrapper.find('.register-button').exists()).toBe(true);
  });

  it('登录后显示用户信息', async () => {
    userStore.isAuthenticated = true;
    userStore.user = {
      id: '1',
      username: 'test',
      avatar: 'http://example.com/avatar.jpg',
    };
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.user-avatar').exists()).toBe(true);
    expect(wrapper.find('.username').text()).toBe('test');
  });

  it('展开/收起下拉菜单', async () => {
    userStore.isAuthenticated = true;
    await wrapper.vm.$nextTick();

    await wrapper.find('.menu-trigger').trigger('click');
    expect(wrapper.find('.menu-dropdown').exists()).toBe(true);

    await wrapper.find('.menu-trigger').trigger('click');
    expect(wrapper.find('.menu-dropdown').exists()).toBe(false);
  });

  it('显示菜单选项', async () => {
    userStore.isAuthenticated = true;
    await wrapper.vm.$nextTick();

    await wrapper.find('.menu-trigger').trigger('click');
    const menuItems = wrapper.findAll('.menu-item');
    expect(menuItems).toHaveLength(4);
    expect(menuItems[0].text()).toBe('个人资料');
    expect(menuItems[1].text()).toBe('设置');
    expect(menuItems[2].text()).toBe('退出登录');
  });

  it('处理退出登录', async () => {
    userStore.isAuthenticated = true;
    await wrapper.vm.$nextTick();

    await wrapper.find('.menu-trigger').trigger('click');
    await wrapper.find('.logout-button').trigger('click');
    expect(userStore.logout).toHaveBeenCalled();
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
