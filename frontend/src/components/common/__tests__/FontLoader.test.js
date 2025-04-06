/**
 * @file FontLoader.test.ts
 * @description FontLoader 组件的测试用例
 * @author Atom Video Team
 * @date 2025-04-06
 */
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import FontLoader from '../FontLoader.vue';
describe('FontLoader', () => {
    it('应该正确渲染字体加载器', () => {
        const wrapper = mount(FontLoader, {
            props: {
                fontFamily: 'TestFont',
                fontUrl: 'https://example.com/font.woff2',
            },
        });
        expect(wrapper.find('.font-loader').exists()).toBe(true);
        expect(wrapper.find('.loading-spinner').exists()).toBe(true);
        expect(wrapper.find('.loading-text').text()).toBe('正在加载字体...');
    });
    it('应该显示加载进度', async () => {
        const wrapper = mount(FontLoader, {
            props: {
                fontFamily: 'TestFont',
                fontUrl: 'https://example.com/font.woff2',
            },
        });
        // 模拟加载进度
        await wrapper.setData({ progress: 50 });
        expect(wrapper.find('.progress-bar').attributes('style')).toContain('width: 50%');
    });
    it('应该显示加载成功状态', async () => {
        const wrapper = mount(FontLoader, {
            props: {
                fontFamily: 'TestFont',
                fontUrl: 'https://example.com/font.woff2',
            },
        });
        // 模拟加载成功
        await wrapper.setData({
            loading: false,
            error: null,
            loaded: true,
        });
        expect(wrapper.find('.success-icon').exists()).toBe(true);
        expect(wrapper.find('.success-text').text()).toBe('字体加载成功');
    });
    it('应该显示加载错误状态', async () => {
        const errorMessage = '字体加载失败';
        const wrapper = mount(FontLoader, {
            props: {
                fontFamily: 'TestFont',
                fontUrl: 'https://example.com/font.woff2',
            },
        });
        // 模拟加载错误
        await wrapper.setData({
            loading: false,
            error: errorMessage,
            loaded: false,
        });
        expect(wrapper.find('.error-icon').exists()).toBe(true);
        expect(wrapper.find('.error-text').text()).toBe(errorMessage);
        expect(wrapper.find('.retry-button').exists()).toBe(true);
    });
    it('应该触发重试事件', async () => {
        const wrapper = mount(FontLoader, {
            props: {
                fontFamily: 'TestFont',
                fontUrl: 'https://example.com/font.woff2',
            },
        });
        // 模拟加载错误
        await wrapper.setData({
            loading: false,
            error: '加载失败',
            loaded: false,
        });
        const retryButton = wrapper.find('.retry-button');
        await retryButton.trigger('click');
        expect(wrapper.emitted('retry')).toBeTruthy();
    });
    it('应该在移动端视图下调整布局', () => {
        // 模拟移动端视口
        global.innerWidth = 500;
        global.dispatchEvent(new Event('resize'));
        const wrapper = mount(FontLoader, {
            props: {
                fontFamily: 'TestFont',
                fontUrl: 'https://example.com/font.woff2',
            },
        });
        const fontLoader = wrapper.find('.font-loader');
        expect(fontLoader.classes()).toContain('mobile-view');
    });
    it('应该正确应用黑白主题样式', () => {
        const wrapper = mount(FontLoader, {
            props: {
                fontFamily: 'TestFont',
                fontUrl: 'https://example.com/font.woff2',
            },
        });
        const fontLoader = wrapper.find('.font-loader');
        expect(fontLoader.classes()).toContain('theme-black');
    });
});
//# sourceMappingURL=FontLoader.test.js.map