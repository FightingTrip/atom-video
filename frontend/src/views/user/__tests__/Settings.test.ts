/**
 * @file Settings.test.ts
 * @description Settings 组件的测试用例
 * @author Atom Video Team
 * @date 2025-04-06
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { createI18n } from 'vue-i18n';
import { useUserStore } from '@/stores/user';
import Settings from '../Settings.vue';

// Mock store
vi.mock('@/stores/user', () => ({
  useUserStore: vi.fn(() => ({
    user: null,
    updateUserSettings: vi.fn(),
    updatePassword: vi.fn(),
    updateEmail: vi.fn(),
  })),
}));

// 创建 i18n 实例
const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  messages: {
    'zh-CN': {
      settings: {
        title: '设置',
        account: '账号设置',
        preferences: '偏好设置',
        security: '安全设置',
        privacy: '隐私设置',
      },
    },
    'en-US': {
      settings: {
        title: 'Settings',
        account: 'Account Settings',
        preferences: 'Preferences',
        security: 'Security',
        privacy: 'Privacy',
      },
    },
  },
});

describe('Settings', () => {
  let wrapper: any;
  let userStore: any;

  beforeEach(() => {
    const pinia = createTestingPinia();
    userStore = useUserStore(pinia);

    wrapper = mount(Settings, {
      global: {
        plugins: [pinia, i18n],
      },
    });
  });

  it('正确渲染设置页面', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.settings-page').exists()).toBe(true);
  });

  it('显示所有设置选项', () => {
    expect(wrapper.find('.account-settings').exists()).toBe(true);
    expect(wrapper.find('.preferences-settings').exists()).toBe(true);
    expect(wrapper.find('.security-settings').exists()).toBe(true);
    expect(wrapper.find('.privacy-settings').exists()).toBe(true);
  });

  it('更新账号设置', async () => {
    const newUsername = 'newusername';
    await wrapper.find('.username-input').setValue(newUsername);
    await wrapper.find('.save-account-settings').trigger('click');

    expect(userStore.updateUserSettings).toHaveBeenCalledWith({
      username: newUsername,
    });
  });

  it('更新密码', async () => {
    const newPassword = 'newpassword123';
    const confirmPassword = 'newpassword123';
    await wrapper.find('.current-password').setValue('oldpassword');
    await wrapper.find('.new-password').setValue(newPassword);
    await wrapper.find('.confirm-password').setValue(confirmPassword);
    await wrapper.find('.update-password').trigger('click');

    expect(userStore.updatePassword).toHaveBeenCalledWith({
      currentPassword: 'oldpassword',
      newPassword,
    });
  });

  it('更新邮箱', async () => {
    const newEmail = 'newemail@example.com';
    await wrapper.find('.email-input').setValue(newEmail);
    await wrapper.find('.update-email').trigger('click');

    expect(userStore.updateEmail).toHaveBeenCalledWith(newEmail);
  });

  it('更新偏好设置', async () => {
    await wrapper.find('.language-select').setValue('en-US');
    await wrapper.find('.theme-select').setValue('dark');
    await wrapper.find('.notification-toggle').setValue(true);
    await wrapper.find('.save-preferences').trigger('click');

    expect(userStore.updateUserSettings).toHaveBeenCalledWith({
      language: 'en-US',
      theme: 'dark',
      notifications: true,
    });
  });

  it('更新安全设置', async () => {
    await wrapper.find('.two-factor-toggle').setValue(true);
    await wrapper.find('.save-security').trigger('click');

    expect(userStore.updateUserSettings).toHaveBeenCalledWith({
      twoFactorEnabled: true,
    });
  });

  it('更新隐私设置', async () => {
    await wrapper.find('.profile-visibility').setValue('private');
    await wrapper.find('.video-visibility').setValue('public');
    await wrapper.find('.save-privacy').trigger('click');

    expect(userStore.updateUserSettings).toHaveBeenCalledWith({
      profileVisibility: 'private',
      videoVisibility: 'public',
    });
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
