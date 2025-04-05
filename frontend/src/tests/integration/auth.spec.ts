import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/auth/Login.vue';
import Register from '@/views/auth/Register.vue';
import ForgotPassword from '@/views/auth/ForgotPassword.vue';
import ResetPassword from '@/views/auth/ResetPassword.vue';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/register',
      component: Register,
    },
    {
      path: '/forgot-password',
      component: ForgotPassword,
    },
    {
      path: '/reset-password',
      component: ResetPassword,
    },
  ],
});

describe('用户认证流程集成测试', () => {
  const mockUser = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    avatar: 'https://example.com/avatar.jpg',
    nickname: '测试用户',
    bio: '这是一个测试用户',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('用户登录', async () => {
    const authStore = useAuthStore();
    vi.spyOn(authStore, 'login').mockResolvedValue({
      user: mockUser,
      token: 'mock-token',
    });

    const wrapper = mount(Login, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
          router,
        ],
      },
    });

    await wrapper.find('.username-input').setValue('testuser');
    await wrapper.find('.password-input').setValue('password123');
    await wrapper.find('.submit-btn').trigger('click');

    expect(authStore.login).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password123',
    });
    expect(authStore.isAuthenticated).toBe(true);
    expect(authStore.user).toEqual(mockUser);
  });

  it('用户注册', async () => {
    const authStore = useAuthStore();
    vi.spyOn(authStore, 'register').mockResolvedValue({
      user: mockUser,
      token: 'mock-token',
    });

    const wrapper = mount(Register, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
          router,
        ],
      },
    });

    const formData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      nickname: '测试用户',
    };

    await wrapper.find('.username-input').setValue(formData.username);
    await wrapper.find('.email-input').setValue(formData.email);
    await wrapper.find('.password-input').setValue(formData.password);
    await wrapper.find('.confirm-password-input').setValue(formData.confirmPassword);
    await wrapper.find('.nickname-input').setValue(formData.nickname);
    await wrapper.find('.submit-btn').trigger('click');

    expect(authStore.register).toHaveBeenCalledWith(formData);
    expect(authStore.isAuthenticated).toBe(true);
    expect(authStore.user).toEqual(mockUser);
  });

  it('忘记密码', async () => {
    const authStore = useAuthStore();
    vi.spyOn(authStore, 'forgotPassword').mockResolvedValue();

    const wrapper = mount(ForgotPassword, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
          router,
        ],
      },
    });

    await wrapper.find('.email-input').setValue('test@example.com');
    await wrapper.find('.submit-btn').trigger('click');

    expect(authStore.forgotPassword).toHaveBeenCalledWith('test@example.com');
  });

  it('重置密码', async () => {
    const authStore = useAuthStore();
    vi.spyOn(authStore, 'resetPassword').mockResolvedValue();

    const wrapper = mount(ResetPassword, {
      props: {
        token: 'mock-token',
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
          router,
        ],
      },
    });

    await wrapper.find('.password-input').setValue('newpassword123');
    await wrapper.find('.confirm-password-input').setValue('newpassword123');
    await wrapper.find('.submit-btn').trigger('click');

    expect(authStore.resetPassword).toHaveBeenCalledWith({
      token: 'mock-token',
      password: 'newpassword123',
    });
  });

  it('用户登出', async () => {
    const authStore = useAuthStore();
    vi.spyOn(authStore, 'logout').mockResolvedValue();

    const wrapper = mount(Login, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: {
                isAuthenticated: true,
                user: mockUser,
              },
            },
          }),
          router,
        ],
      },
    });

    await wrapper.find('.logout-btn').trigger('click');
    expect(authStore.logout).toHaveBeenCalled();
    expect(authStore.isAuthenticated).toBe(false);
    expect(authStore.user).toBeNull();
  });

  it('验证用户会话', async () => {
    const authStore = useAuthStore();
    vi.spyOn(authStore, 'checkSession').mockResolvedValue({
      user: mockUser,
      token: 'mock-token',
    });

    const wrapper = mount(Login, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: {
                token: 'mock-token',
              },
            },
          }),
          router,
        ],
      },
    });

    await wrapper.vm.$nextTick();
    expect(authStore.checkSession).toHaveBeenCalled();
    expect(authStore.isAuthenticated).toBe(true);
    expect(authStore.user).toEqual(mockUser);
  });

  it('处理登录错误', async () => {
    const authStore = useAuthStore();
    const error = new Error('用户名或密码错误');
    vi.spyOn(authStore, 'login').mockRejectedValue(error);

    const wrapper = mount(Login, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
          router,
        ],
      },
    });

    await wrapper.find('.username-input').setValue('testuser');
    await wrapper.find('.password-input').setValue('wrongpassword');
    await wrapper.find('.submit-btn').trigger('click');

    expect(authStore.error).toBe('用户名或密码错误');
    expect(authStore.isAuthenticated).toBe(false);
    expect(authStore.user).toBeNull();
  });
});
