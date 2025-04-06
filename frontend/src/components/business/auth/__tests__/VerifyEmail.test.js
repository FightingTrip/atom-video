/**
 * @file VerifyEmail.test.ts
 * @description VerifyEmail 组件的测试用例
 * @author Atom Video Team
 * @date 2025-04-06
 */
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { useAuthStore } from '@/stores/auth';
import VerifyEmail from '../VerifyEmail.vue';
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
describe('VerifyEmail', () => {
    let wrapper;
    let authStore;
    let router;
    beforeEach(() => {
        const pinia = createTestingPinia();
        authStore = useAuthStore(pinia);
        router = useRouter();
        wrapper = mount(VerifyEmail, {
            global: {
                plugins: [pinia],
            },
        });
    });
    it('正确渲染邮箱验证页面', () => {
        expect(wrapper.exists()).toBe(true);
        expect(wrapper.find('.min-h-screen').exists()).toBe(true);
        expect(wrapper.find('h2').text()).toBe('验证邮箱');
    });
    it('显示验证成功状态', async () => {
        // 模拟验证成功
        await wrapper.vm.verifyEmail();
        expect(wrapper.find('.text-green-600').exists()).toBe(true);
        expect(wrapper.find('.text-green-600').text()).toBe('邮箱验证成功！');
    });
    it('显示验证失败状态', async () => {
        // 模拟验证失败
        vi.mocked(api.post).mockRejectedValueOnce(new Error('验证失败'));
        await wrapper.vm.verifyEmail();
        expect(wrapper.find('.text-red-600').exists()).toBe(true);
        expect(wrapper.find('.text-red-600').text()).toBe('验证失败');
    });
    it('支持重新发送验证邮件', async () => {
        const resendButton = wrapper.find('button[type="button"]');
        await resendButton.trigger('click');
        expect(wrapper.find('.text-green-600').exists()).toBe(true);
        expect(wrapper.find('.text-green-600').text()).toBe('验证邮件已重新发送');
    });
    it('验证成功后自动跳转到登录页', async () => {
        await wrapper.vm.verifyEmail();
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
//# sourceMappingURL=VerifyEmail.test.js.map