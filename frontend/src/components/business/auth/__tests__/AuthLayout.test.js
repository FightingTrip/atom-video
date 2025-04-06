/**
 * @file AuthLayout.test.ts
 * @description AuthLayout 组件的测试用例
 * @author Atom Video Team
 * @date 2025-04-06
 */
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import AuthLayout from '../AuthLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: { template: '<div>Home</div>' },
        },
    ],
});
describe('AuthLayout', () => {
    it('应该正确渲染认证页面布局', () => {
        const wrapper = mount(AuthLayout, {
            global: {
                plugins: [router],
            },
        });
        expect(wrapper.find('.min-h-screen').exists()).toBe(true);
        expect(wrapper.find('nav').exists()).toBe(true);
        expect(wrapper.find('img[alt="Atom Video"]').exists()).toBe(true);
    });
    it('应该包含 Logo 图片', () => {
        const wrapper = mount(AuthLayout, {
            global: {
                plugins: [router],
            },
        });
        const logo = wrapper.find('img[alt="Atom Video"]');
        expect(logo.attributes('src')).toBe('/logo-192.png');
        expect(logo.classes()).toContain('h-8');
    });
    it('Logo 应该链接到首页', () => {
        const wrapper = mount(AuthLayout, {
            global: {
                plugins: [router],
            },
        });
        const logoLink = wrapper.find('router-link');
        expect(logoLink.attributes('to')).toBe('/');
    });
    it('应该包含 router-view 用于显示子路由内容', () => {
        const wrapper = mount(AuthLayout, {
            global: {
                plugins: [router],
            },
        });
        expect(wrapper.find('router-view').exists()).toBe(true);
    });
    it('应该在移动端视图下调整布局', () => {
        // 模拟移动端视口
        global.innerWidth = 500;
        global.dispatchEvent(new Event('resize'));
        const wrapper = mount(AuthLayout, {
            global: {
                plugins: [router],
            },
        });
        expect(wrapper.find('.min-h-screen').classes()).toContain('mobile-view');
    });
    it('应该正确应用黑白主题样式', () => {
        const wrapper = mount(AuthLayout, {
            global: {
                plugins: [router],
            },
        });
        expect(wrapper.find('.min-h-screen').classes()).toContain('theme-black');
    });
});
//# sourceMappingURL=AuthLayout.test.js.map