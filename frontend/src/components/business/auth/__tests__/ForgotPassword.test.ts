/**
 * @file ForgotPassword.test.ts
 * @description ForgotPassword 组件的测试用例
 * @author Atom Video Team
 * @date 2025-04-06
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { useAuthStore } from '@/stores/auth';
import ForgotPassword from '../ForgotPassword.vue';
import { useRouter } from 'vue-router';

// Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
  })),
}));

// Mock API
vi.mock('@/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('ForgotPassword', () => {
  let wrapper: any;
  let authStore: any;
  let router: any;

  beforeEach(() => {
    const pinia = createTestingPinia();
    authStore = useAuthStore(pinia);
    router = useRouter();

    wrapper = mount(ForgotPassword, {
      global: {
        plugins: [pinia],
      },
    });
  });

  it('正确渲染忘记密码页面', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.min-h-screen').exists()).toBe(true);
    expect(wrapper.find('h2').text()).toBe('忘记密码');
  });

  it('显示发送成功状态', async () => {
    // 模拟发送成功
    await wrapper.vm.handleSubmit();
    expect(wrapper.find('.text-green-600').exists()).toBe(true);
    expect(wrapper.find('.text-green-600').text()).toBe('重置密码邮件已发送！');
  });

  it('显示发送失败状态', async () => {
    // 模拟发送失败
    vi.mocked(api.post).mockRejectedValueOnce(new Error('发送失败'));
    await wrapper.vm.handleSubmit();
    expect(wrapper.find('.text-red-600').exists()).toBe(true);
    expect(wrapper.find('.text-red-600').text()).toBe('发送失败');
  });

  it('验证邮箱格式', async () => {
    await wrapper.find('input[type="email"]').setValue('invalid-email');
    await wrapper.find('form').trigger('submit');

    expect(wrapper.find('.text-red-600').exists()).toBe(true);
    expect(wrapper.find('.text-red-600').text()).toBe('请输入有效的邮箱地址');
  });

  it('发送成功后自动跳转到登录页', async () => {
    await wrapper.vm.handleSubmit();
    expect(router.replace).toHaveBeenCalledWith('/auth/login');
  });

  it('响应式布局调整', async () => {
    // 模拟移动端屏幕
    global.innerWidth = 375;
    global.dispatchEvent(new Event('resize'));
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.px-4').exists()).toBe(true);
  });

  it('应用主题样式', async () => {
    // 模拟暗色主题
    document.documentElement.classList.add('dark');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.bg-gray-900').exists()).toBe(true);
  });
});
