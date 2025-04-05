/**
 * @file BlankLayout.test.ts
 * @description BlankLayout 组件的测试用例
 * @author Atom Video Team
 * @date 2025-04-06
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import BlankLayout from '../BlankLayout.vue';

describe('BlankLayout', () => {
  it('应该正确渲染插槽内容', () => {
    const wrapper = mount(BlankLayout, {
      slots: {
        default: '<div class="test-content">测试内容</div>',
      },
    });

    expect(wrapper.find('.test-content').text()).toBe('测试内容');
  });

  it('应该应用正确的样式类', () => {
    const wrapper = mount(BlankLayout);
    expect(wrapper.classes()).toContain('blank-layout');
  });

  it('应该具有最小高度', () => {
    const wrapper = mount(BlankLayout);
    const style = window.getComputedStyle(wrapper.element);
    expect(style.minHeight).toBe('100vh');
  });
});
