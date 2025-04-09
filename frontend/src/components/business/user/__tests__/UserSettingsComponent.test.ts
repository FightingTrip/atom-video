/**
 * @file UserSettingsComponent.test.ts
 * @description 用户设置组件测试
 * @author Atom Video Team
 * @date 2025-04-08
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { createI18n } from 'vue-i18n';
import UserSettingsComponent from '../UserSettingsComponent.vue';

// 模拟 i18n
const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  messages: {
    'zh-CN': {
      settings: {
        title: '账号设置',
        basicInfo: '基本信息',
        security: '安全设置',
        notifications: '通知设置',
        save: '保存设置',
        deleteAccount: '删除账号',
      },
    },
  },
});

// 模拟用户数据
const mockUser = {
  id: '1',
  username: 'testuser',
  bio: '测试用户简介',
  avatarUrl: 'https://example.com/avatar.jpg',
  notifications: {
    email: true,
    push: true,
  },
};

describe('UserSettingsComponent', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(UserSettingsComponent, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              user: {
                user: mockUser,
              },
            },
          }),
          i18n,
        ],
      },
    });
  });

  // 渲染测试
  it('正确渲染所有设置部分', () => {
    expect(wrapper.find('.page-title').text()).toBe('账号设置');
    expect(wrapper.find('.section-title').text()).toBe('基本信息');
    expect(wrapper.find('input[id="username"]').exists()).toBe(true);
    expect(wrapper.find('textarea[id="bio"]').exists()).toBe(true);
    expect(wrapper.find('input[id="currentPassword"]').exists()).toBe(true);
    expect(wrapper.find('input[id="newPassword"]').exists()).toBe(true);
    expect(wrapper.find('input[id="confirmPassword"]').exists()).toBe(true);
  });

  // 表单验证测试
  it('用户名不能为空', async () => {
    await wrapper.setData({
      form: {
        ...wrapper.vm.form,
        username: '',
      },
    });
    await wrapper.vm.validateForm();
    expect(wrapper.vm.errors.username).toBe('请输入用户名');
  });

  it('个人简介不能超过200个字符', async () => {
    await wrapper.setData({
      form: {
        ...wrapper.vm.form,
        bio: 'a'.repeat(201),
      },
    });
    await wrapper.vm.validateForm();
    expect(wrapper.vm.errors.bio).toBe('个人简介不能超过200个字符');
  });

  it('修改密码时需要输入当前密码', async () => {
    await wrapper.setData({
      form: {
        ...wrapper.vm.form,
        newPassword: 'newpassword',
        currentPassword: '',
      },
    });
    await wrapper.vm.validateForm();
    expect(wrapper.vm.errors.currentPassword).toBe('请输入当前密码');
  });

  it('新密码不能少于8个字符', async () => {
    await wrapper.setData({
      form: {
        ...wrapper.vm.form,
        newPassword: 'short',
        currentPassword: 'currentpassword',
      },
    });
    await wrapper.vm.validateForm();
    expect(wrapper.vm.errors.newPassword).toBe('新密码不能少于8个字符');
  });

  it('两次输入的密码必须一致', async () => {
    await wrapper.setData({
      form: {
        ...wrapper.vm.form,
        newPassword: 'newpassword',
        confirmPassword: 'different',
        currentPassword: 'currentpassword',
      },
    });
    await wrapper.vm.validateForm();
    expect(wrapper.vm.errors.confirmPassword).toBe('两次输入的密码不一致');
  });

  // 功能测试
  it('点击保存按钮时调用保存方法', async () => {
    const saveSpy = vi.spyOn(wrapper.vm, 'handleSave');
    await wrapper.find('button').trigger('click');
    expect(saveSpy).toHaveBeenCalled();
  });

  it('点击删除账号按钮时显示确认对话框', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm');
    await wrapper.find('button[type="danger"]').trigger('click');
    expect(confirmSpy).toHaveBeenCalledWith('确定要删除账号吗？此操作不可恢复。');
  });

  // 数据加载测试
  it('组件挂载时加载用户信息', async () => {
    expect(wrapper.vm.form.username).toBe(mockUser.username);
    expect(wrapper.vm.form.bio).toBe(mockUser.bio);
    expect(wrapper.vm.form.avatarUrl).toBe(mockUser.avatarUrl);
    expect(wrapper.vm.form.notifications).toEqual(mockUser.notifications);
  });

  // 错误处理测试
  it('加载用户信息失败时显示错误信息', async () => {
    const error = new Error('加载失败');
    vi.spyOn(wrapper.vm, 'fetchUserProfile').mockRejectedValue(error);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.error).toBe('加载用户信息失败');
  });

  it('保存设置失败时显示错误信息', async () => {
    const error = new Error('保存失败');
    vi.spyOn(wrapper.vm, 'updateUserProfile').mockRejectedValue(error);
    await wrapper.vm.handleSave();
    expect(wrapper.vm.error).toBe('保存设置失败');
  });
});
