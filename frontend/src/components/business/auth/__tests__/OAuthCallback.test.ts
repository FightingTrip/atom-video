/**
 * @file OAuthCallback.test.ts
 * @description OAuthCallback 组件的测试用例
 * @author Atom Video Team
 * @date 2025-04-06
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { useAuthStore } from '@/stores/auth';
import OAuthCallback from '../OAuthCallback.vue';
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

describe('OAuthCallback', () => {
  let wrapper: any;
  let authStore: any;
  let router: any;

  beforeEach(() => {
    const pinia = createTestingPinia();
    authStore = useAuthStore(pinia);
    router = useRouter();

    wrapper = mount(OAuthCallback, {
      global: {
        plugins: [pinia],
      },
    });
  });

  it('正确渲染 OAuth 回调页面', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.min-h-screen').exists()).toBe(true);
    expect(wrapper.find('h2').text()).toBe('处理登录中...');
  });

  it('显示登录成功状态', async () => {
    // 模拟登录成功
    await wrapper.vm.handleCallback();
    expect(wrapper.find('.text-green-600').exists()).toBe(true);
    expect(wrapper.find('.text-green-600').text()).toBe('登录成功！');
  });

  it('显示登录失败状态', async () => {
    // 模拟登录失败
    vi.mocked(api.post).mockRejectedValueOnce(new Error('登录失败'));
    await wrapper.vm.handleCallback();
    expect(wrapper.find('.text-red-600').exists()).toBe(true);
    expect(wrapper.find('.text-red-600').text()).toBe('登录失败');
  });

  it('处理 OAuth 错误', async () => {
    // 模拟 OAuth 错误
    const error = new Error('access_denied');
    vi.mocked(api.post).mockRejectedValueOnce(error);
    await wrapper.vm.handleCallback();
    expect(wrapper.find('.text-red-600').exists()).toBe(true);
    expect(wrapper.find('.text-red-600').text()).toBe('登录被拒绝');
  });

  it('登录成功后自动跳转到首页', async () => {
    await wrapper.vm.handleCallback();
    expect(router.replace).toHaveBeenCalledWith('/');
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
