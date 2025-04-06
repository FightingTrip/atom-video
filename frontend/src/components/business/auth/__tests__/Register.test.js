/**
 * @file Register.test.ts
 * @description Register 组件的测试用例
 * @author Atom Video Team
 * @date 2025-04-06
 */
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import Register from '../Register.vue';
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
                signUpTitle: '注册',
                signUpDesc: '创建新账号',
                username: '用户名',
                email: '邮箱',
                password: '密码',
                confirmPassword: '确认密码',
                signUp: '注册',
                processing: '处理中',
                hasAccount: '已有账号？',
                signIn: '立即登录',
                backToHome: '返回首页',
                usernamePlaceholder: '请输入用户名',
                emailPlaceholder: '请输入邮箱地址',
                passwordPlaceholder: '请输入密码',
                confirmPasswordPlaceholder: '请再次输入密码',
                signUpSuccess: '注册成功',
                signUpError: '注册失败',
                passwordsNotMatch: '两次输入的密码不一致',
                passwordTooShort: '密码长度不能少于8位',
                emailRequired: '请先输入邮箱地址',
                codeSent: '验证码已发送',
                codeSendFailed: '验证码发送失败',
                orUseEmail: '或使用邮箱注册',
            },
        },
    },
});
// 模拟认证 store
const mockAuthStore = {
    register: vi.fn(),
    isAuthenticated: false,
    user: null,
};
describe('Register', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });
    it('应该正确渲染注册页面', () => {
        const wrapper = mount(Register, {
            global: {
                plugins: [router, i18n],
                mocks: {
                    authStore: mockAuthStore,
                },
            },
        });
        expect(wrapper.find('.auth-background').exists()).toBe(true);
        expect(wrapper.find('form').exists()).toBe(true);
        expect(wrapper.find('input[type="text"]').exists()).toBe(true);
        expect(wrapper.find('input[type="email"]').exists()).toBe(true);
        expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    });
    it('应该显示社交注册按钮', () => {
        const wrapper = mount(Register, {
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
        const wrapper = mount(Register, {
            global: {
                plugins: [router, i18n],
                mocks: {
                    authStore: {
                        ...mockAuthStore,
                        register: vi.fn().mockResolvedValue(true),
                    },
                },
            },
        });
        await wrapper.find('input[type="text"]').setValue('testuser');
        await wrapper.find('input[type="email"]').setValue('test@example.com');
        await wrapper.find('input[type="password"]').setValue('password123');
        await wrapper.find('input[placeholder="请再次输入密码"]').setValue('password123');
        await wrapper.find('input[placeholder="请输入验证码"]').setValue('123456');
        await wrapper.find('form').trigger('submit');
        expect(mockAuthStore.register).toHaveBeenCalledWith('testuser', 'password123', 'testuser');
    });
    it('应该验证密码匹配', async () => {
        const wrapper = mount(Register, {
            global: {
                plugins: [router, i18n],
                mocks: {
                    authStore: mockAuthStore,
                },
            },
        });
        await wrapper.find('input[type="password"]').setValue('password123');
        await wrapper.find('input[placeholder="请再次输入密码"]').setValue('password456');
        await wrapper.find('form').trigger('submit');
        expect(mockAuthStore.register).not.toHaveBeenCalled();
        expect(wrapper.find('.n-message').text()).toBe('两次输入的密码不一致');
    });
    it('应该验证密码长度', async () => {
        const wrapper = mount(Register, {
            global: {
                plugins: [router, i18n],
                mocks: {
                    authStore: mockAuthStore,
                },
            },
        });
        await wrapper.find('input[type="password"]').setValue('123');
        await wrapper.find('input[placeholder="请再次输入密码"]').setValue('123');
        await wrapper.find('form').trigger('submit');
        expect(mockAuthStore.register).not.toHaveBeenCalled();
        expect(wrapper.find('.n-message').text()).toBe('密码长度不能少于8位');
    });
    it('应该发送验证码并显示倒计时', async () => {
        const wrapper = mount(Register, {
            global: {
                plugins: [router, i18n],
                mocks: {
                    authStore: mockAuthStore,
                },
            },
        });
        await wrapper.find('input[type="email"]').setValue('test@example.com');
        await wrapper.find('button[type="button"]').trigger('click');
        expect(wrapper.find('button[type="button"]').text()).toBe('60s');
        expect(wrapper.find('.n-message').text()).toBe('验证码已发送');
        // 模拟时间流逝
        for (let i = 0; i < 60; i++) {
            await vi.advanceTimersByTime(1000);
        }
        expect(wrapper.find('button[type="button"]').text()).toBe('发送验证码');
    });
    it('应该在移动端视图下调整布局', () => {
        // 模拟移动端视口
        global.innerWidth = 500;
        global.dispatchEvent(new Event('resize'));
        const wrapper = mount(Register, {
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
        const wrapper = mount(Register, {
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
//# sourceMappingURL=Register.test.js.map