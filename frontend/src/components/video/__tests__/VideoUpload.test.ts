/**
 * @file VideoUpload.test.ts
 * @description VideoUpload 组件的测试用例
 * @author Atom Video Team
 * @date 2025-04-06
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import VideoUpload from '../VideoUpload.vue';

describe('VideoUpload', () => {
  it('应该正确渲染上传组件', () => {
    const wrapper = mount(VideoUpload);
    expect(wrapper.find('.upload-container').exists()).toBe(true);
    expect(wrapper.find('.upload-area').exists()).toBe(true);
    expect(wrapper.find('.upload-form').exists()).toBe(true);
  });

  it('应该正确处理文件选择', async () => {
    const wrapper = mount(VideoUpload);
    const fileInput = wrapper.find('input[type="file"]');

    // 模拟文件选择
    const file = new File(['test'], 'test.mp4', { type: 'video/mp4' });
    await fileInput.trigger('change', { target: { files: [file] } });

    expect(wrapper.find('.video-preview').exists()).toBe(true);
  });

  it('应该验证文件类型', async () => {
    const wrapper = mount(VideoUpload);
    const fileInput = wrapper.find('input[type="file"]');

    // 模拟选择非视频文件
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    await fileInput.trigger('change', { target: { files: [file] } });

    expect(wrapper.find('.error-message').text()).toContain('只支持视频文件');
  });

  it('应该验证文件大小', async () => {
    const wrapper = mount(VideoUpload);
    const fileInput = wrapper.find('input[type="file"]');

    // 模拟选择超大文件
    const largeFile = new File(['x'.repeat(1024 * 1024 * 1024)], 'large.mp4', {
      type: 'video/mp4',
    });
    await fileInput.trigger('change', { target: { files: [largeFile] } });

    expect(wrapper.find('.error-message').text()).toContain('文件大小不能超过');
  });

  it('应该正确处理表单提交', async () => {
    const wrapper = mount(VideoUpload);
    const form = wrapper.find('.upload-form');

    // 填写表单
    await form.find('input[name="title"]').setValue('测试视频');
    await form.find('textarea[name="description"]').setValue('这是一个测试视频');
    await form.find('select[name="category"]').setValue('entertainment');
    await form.find('input[name="tags"]').setValue('测试,视频');

    // 提交表单
    await form.trigger('submit');
    expect(wrapper.emitted('submit')).toBeTruthy();
  });

  it('应该验证必填字段', async () => {
    const wrapper = mount(VideoUpload);
    const form = wrapper.find('.upload-form');

    // 不填写标题直接提交
    await form.trigger('submit');
    expect(wrapper.find('.error-message').text()).toContain('请输入视频标题');
  });

  it('应该显示上传进度', async () => {
    const wrapper = mount(VideoUpload);
    const fileInput = wrapper.find('input[type="file"]');

    // 模拟文件选择
    const file = new File(['test'], 'test.mp4', { type: 'video/mp4' });
    await fileInput.trigger('change', { target: { files: [file] } });

    expect(wrapper.find('.upload-progress').exists()).toBe(true);
  });

  it('应该处理上传错误', async () => {
    const wrapper = mount(VideoUpload);
    const fileInput = wrapper.find('input[type="file"]');

    // 模拟文件选择
    const file = new File(['test'], 'test.mp4', { type: 'video/mp4' });
    await fileInput.trigger('change', { target: { files: [file] } });

    // 模拟上传失败
    await wrapper.vm.handleUploadError(new Error('上传失败'));
    expect(wrapper.find('.error-message').text()).toContain('上传失败');
  });

  it('应该处理封面图片上传', async () => {
    const wrapper = mount(VideoUpload);
    const coverInput = wrapper.find('input[type="file"][accept="image/*"]');

    // 模拟选择封面图片
    const imageFile = new File(['test'], 'cover.jpg', { type: 'image/jpeg' });
    await coverInput.trigger('change', { target: { files: [imageFile] } });

    expect(wrapper.find('.cover-preview').exists()).toBe(true);
  });

  it('应该在移动端视图下调整布局', () => {
    // 模拟移动端视口
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));

    const wrapper = mount(VideoUpload);
    const uploadContainer = wrapper.find('.upload-container');
    expect(uploadContainer.classes()).toContain('mobile-view');
  });
});
