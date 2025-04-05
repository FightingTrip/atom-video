/**
 * @file TheFooter.test.ts
 * @description TheFooter 组件的测试用例
 * @author Atom Video Team
 * @date 2025-04-06
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { createRouter, createWebHistory } from 'vue-router';
import TheFooter from '../TheFooter.vue';

// 创建测试用的路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/about',
      component: { template: '<div>关于我们</div>' },
    },
    {
      path: '/help',
      component: { template: '<div>帮助中心</div>' },
    },
  ],
});

describe('TheFooter', () => {
  it('应该正确渲染所有链接组', () => {
    const wrapper = mount(TheFooter, {
      global: {
        plugins: [router],
      },
    });

    const linkGroups = wrapper.findAll('.link-group');
    expect(linkGroups).toHaveLength(4);
    expect(linkGroups[0].find('.link-title').text()).toBe('关于我们');
    expect(linkGroups[1].find('.link-title').text()).toBe('帮助中心');
    expect(linkGroups[2].find('.link-title').text()).toBe('创作者');
    expect(linkGroups[3].find('.link-title').text()).toBe('法律');
  });

  it('应该正确渲染所有链接项', () => {
    const wrapper = mount(TheFooter, {
      global: {
        plugins: [router],
      },
    });

    const linkItems = wrapper.findAll('.link-item');
    expect(linkItems).toHaveLength(16);
  });

  it('应该正确渲染社交媒体链接', () => {
    const wrapper = mount(TheFooter, {
      global: {
        plugins: [router],
      },
    });

    const socialLinks = wrapper.findAll('.social-link');
    expect(socialLinks).toHaveLength(3);
  });

  it('应该正确显示当前年份', () => {
    const wrapper = mount(TheFooter, {
      global: {
        plugins: [router],
      },
    });

    const currentYear = new Date().getFullYear();
    expect(wrapper.find('.copyright').text()).toContain(currentYear.toString());
  });

  it('应该在移动端视图下调整布局', () => {
    // 模拟移动端视口
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));

    const wrapper = mount(TheFooter, {
      global: {
        plugins: [router],
      },
    });

    const footerLinks = wrapper.find('.footer-links');
    expect(footerLinks.classes()).toContain('grid-template-columns: 1fr');
  });

  it('应该正确处理链接点击', async () => {
    const wrapper = mount(TheFooter, {
      global: {
        plugins: [router],
      },
    });

    const aboutLink = wrapper.find('a[href="/about"]');
    await aboutLink.trigger('click');
    expect(router.currentRoute.value.path).toBe('/about');

    const helpLink = wrapper.find('a[href="/help"]');
    await helpLink.trigger('click');
    expect(router.currentRoute.value.path).toBe('/help');
  });
});
