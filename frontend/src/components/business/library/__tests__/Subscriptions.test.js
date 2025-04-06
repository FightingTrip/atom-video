/**
 * @file Subscriptions.test.ts
 * @description Subscriptions 组件的测试用例
 * @author Atom Video Team
 * @date 2025-04-06
 */
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { useUserStore } from '@/stores/user';
import Subscriptions from '../Subscriptions.vue';
// Mock store
vi.mock('@/stores/user', () => ({
    useUserStore: vi.fn(() => ({
        fetchSubscriptions: vi.fn(),
        subscriptions: [],
        loading: false,
        error: null,
    })),
}));
describe('Subscriptions', () => {
    let wrapper;
    let userStore;
    beforeEach(() => {
        const pinia = createTestingPinia();
        userStore = useUserStore(pinia);
        wrapper = mount(Subscriptions, {
            global: {
                plugins: [pinia],
            },
        });
    });
    it('正确渲染订阅页面', () => {
        expect(wrapper.exists()).toBe(true);
        expect(wrapper.find('.space-y-4').exists()).toBe(true);
        expect(wrapper.find('h1').text()).toBe('我的订阅');
    });
    it('加载订阅频道列表', async () => {
        const mockSubscriptions = [
            {
                id: '1',
                name: '测试频道1',
                description: '测试描述1',
                avatar: 'http://example.com/avatar1.jpg',
                subscribers: 1000,
                videos: 50,
                views: 10000,
                subscribedAt: '2025-04-06T00:00:00Z',
            },
        ];
        userStore.subscriptions = mockSubscriptions;
        await wrapper.vm.$nextTick();
        expect(wrapper.find('.subscription-list').exists()).toBe(true);
        expect(wrapper.findAll('.subscription-item')).toHaveLength(1);
    });
    it('显示加载状态', async () => {
        userStore.loading = true;
        await wrapper.vm.$nextTick();
        expect(wrapper.find('.loading-spinner').exists()).toBe(true);
    });
    it('显示错误信息', async () => {
        userStore.error = '加载失败';
        await wrapper.vm.$nextTick();
        expect(wrapper.find('.error-message').exists()).toBe(true);
        expect(wrapper.find('.error-message').text()).toBe('加载失败');
    });
    it('支持频道分类筛选', async () => {
        await wrapper.find('.category-select').setValue('教育');
        expect(userStore.fetchSubscriptions).toHaveBeenCalledWith({
            category: '教育',
            page: 1,
            limit: 12,
        });
    });
    it('支持频道排序', async () => {
        await wrapper.find('.sort-select').setValue('subscribedAt');
        expect(userStore.fetchSubscriptions).toHaveBeenCalledWith({
            sort: 'subscribedAt',
            page: 1,
            limit: 12,
        });
    });
    it('支持频道搜索', async () => {
        await wrapper.find('.search-input').setValue('测试频道');
        await wrapper.find('.search-button').trigger('click');
        expect(userStore.fetchSubscriptions).toHaveBeenCalledWith({
            search: '测试频道',
            page: 1,
            limit: 12,
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
//# sourceMappingURL=Subscriptions.test.js.map