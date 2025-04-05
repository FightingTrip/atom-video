/**
 * @file LanguageSelector.test.ts
 * @description LanguageSelector 组件的测试用例
 * @author Atom Video Team
 * @date 2025-04-06
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { createI18n } from 'vue-i18n';
import LanguageSelector from '../LanguageSelector.vue';

// 创建 i18n 实例
const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  messages: {
    'zh-CN': {
      language: {
        zh: '简体中文',
        en: 'English',
      },
    },
    'en-US': {
      language: {
        zh: '简体中文',
        en: 'English',
      },
    },
  },
});

describe('LanguageSelector', () => {
  it('正确渲染语言选择器组件', () => {
    const wrapper = mount(LanguageSelector, {
      global: {
        plugins: [i18n],
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.language-selector').exists()).toBe(true);
  });

  it('显示当前语言', () => {
    const wrapper = mount(LanguageSelector, {
      global: {
        plugins: [i18n],
      },
    });

    expect(wrapper.find('.current-language').text()).toBe('简体中文');
  });

  it('切换语言', async () => {
    const wrapper = mount(LanguageSelector, {
      global: {
        plugins: [i18n],
      },
    });

    await wrapper.find('.language-option[data-lang="en-US"]').trigger('click');
    expect(i18n.global.locale.value).toBe('en-US');
  });

  it('显示所有支持的语言选项', () => {
    const wrapper = mount(LanguageSelector, {
      global: {
        plugins: [i18n],
      },
    });

    const languageOptions = wrapper.findAll('.language-option');
    expect(languageOptions).toHaveLength(2);
    expect(languageOptions[0].text()).toBe('简体中文');
    expect(languageOptions[1].text()).toBe('English');
  });

  it('响应式布局调整', async () => {
    const wrapper = mount(LanguageSelector, {
      global: {
        plugins: [i18n],
      },
    });

    // 模拟移动端屏幕
    global.innerWidth = 375;
    global.dispatchEvent(new Event('resize'));
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.mobile-layout').exists()).toBe(true);
  });

  it('应用主题样式', async () => {
    const wrapper = mount(LanguageSelector, {
      global: {
        plugins: [i18n],
      },
    });

    // 模拟暗色主题
    document.documentElement.classList.add('dark');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.dark-theme').exists()).toBe(true);
  });
});
