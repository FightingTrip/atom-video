/**
 * @file Login.test.ts
 * @description Login 组件的测试用例
 * @author Atom Video Team
 * @date 2025-04-06
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import Login from '../Login.vue';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import { createI18n } from 'vue-i18n';

// 模拟路由
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: { template: '<div>Home</div>' },
    },
  ],
});

// 模拟 i18n
const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  messages: {
    'zh-CN': {
      auth: {
        signInTitle: '登录',
        signInDesc: '欢迎回来',
        email: '邮箱',
        password: '密码',
        rememberMe: '记住我',
        signIn: '登录',
        processing: '处理中',
        noAccount: '还没有账号？',
        signUp: '立即注册',
        backToHome: '返回首页',
        resetPassword: '重置密码',
        resetPasswordDesc: '请输入您的邮箱地址，我们将发送重置密码链接。',
        cancel: '取消',
        forgotPassword: '忘记密码？',
        emailPlaceholder: '请输入邮箱地址',
        passwordPlaceholder: '请输入密码',
        signInSuccess: '登录成功',
        signInError: '登录失败',
        orUseEmail: '或使用邮箱登录',
      },
    },
  },
});

// 模拟认证 store
const mockAuthStore = {
  login: vi.fn(),
  isAuthenticated: false,
  user: null,
};

describe('Login', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('应该正确渲染登录页面', () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [router, i18n],
        mocks: {
          authStore: mockAuthStore,
        },
      },
    });

    expect(wrapper.find('.auth-background').exists()).toBe(true);
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
  });

  it('应该显示社交登录按钮', () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [router, i18n],
        mocks: {
          authStore: mockAuthStore,
        },
      },
    });

    const socialButtons = wrapper.findAll('.social-btn');
    expect(socialButtons).toHaveLength(2);
    expect(socialButtons[0].text()).toContain('Google');
    expect(socialButtons[1].text()).toContain('GitHub');
  });

  it('应该正确处理表单提交', async () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [router, i18n],
        mocks: {
          authStore: {
            ...mockAuthStore,
            login: vi.fn().mockResolvedValue(true),
          },
        },
      },
    });

    await wrapper.find('input[type="email"]').setValue('test@example.com');
    await wrapper.find('input[type="password"]').setValue('password123');
    await wrapper.find('form').trigger('submit');

    expect(mockAuthStore.login).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('应该显示加载状态', async () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [router, i18n],
        mocks: {
          authStore: {
            ...mockAuthStore,
            login: vi
              .fn()
              .mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100))),
          },
        },
      },
    });

    await wrapper.find('input[type="email"]').setValue('test@example.com');
    await wrapper.find('input[type="password"]').setValue('password123');
    await wrapper.find('form').trigger('submit');

    expect(wrapper.find('.fa-spin').exists()).toBe(true);
  });

  it('应该显示错误消息', async () => {
    const errorMessage = '登录失败';
    const wrapper = mount(Login, {
      global: {
        plugins: [router, i18n],
        mocks: {
          authStore: {
            ...mockAuthStore,
            login: vi.fn().mockRejectedValue(new Error(errorMessage)),
          },
        },
      },
    });

    await wrapper.find('input[type="email"]').setValue('test@example.com');
    await wrapper.find('input[type="password"]').setValue('password123');
    await wrapper.find('form').trigger('submit');

    expect(wrapper.find('.n-message').text()).toBe(errorMessage);
  });

  it('应该切换密码显示状态', async () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [router, i18n],
        mocks: {
          authStore: mockAuthStore,
        },
      },
    });

    const passwordInput = wrapper.find('input[type="password"]');
    const toggleButton = wrapper.find('button[type="button"]');

    expect(passwordInput.attributes('type')).toBe('password');
    await toggleButton.trigger('click');
    expect(passwordInput.attributes('type')).toBe('text');
  });

  it('应该显示忘记密码弹窗', async () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [router, i18n],
        mocks: {
          authStore: mockAuthStore,
        },
      },
    });

    await wrapper.find('a[href="#"]').trigger('click');
    expect(wrapper.find('.n-modal').exists()).toBe(true);
  });

  it('应该在移动端视图下调整布局', () => {
    // 模拟移动端视口
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));

    const wrapper = mount(Login, {
      global: {
        plugins: [router, i18n],
        mocks: {
          authStore: mockAuthStore,
        },
      },
    });

    expect(wrapper.find('.auth-background').classes()).toContain('mobile-view');
  });

  it('应该正确应用黑白主题样式', () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [router, i18n],
        mocks: {
          authStore: mockAuthStore,
        },
      },
    });

    expect(wrapper.find('.auth-background').classes()).toContain('theme-black');
  });
});
