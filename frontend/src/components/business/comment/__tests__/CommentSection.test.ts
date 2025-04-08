/**
 * @file CommentSection.test.ts
 * @description CommentSection 组件的测试用例
 * @author Atom Video Team
 * @date 2025-04-06
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import CommentSection from '../CommentSection.vue';

// 模拟评论数据
const mockComments = [
  {
    id: '1',
    content: '这是一条测试评论',
    createdAt: '2025-04-06T12:30:00Z',
    author: {
      id: '1',
      nickname: '测试用户',
      avatar: 'https://example.com/avatar.jpg',
    },
    likes: 10,
    replies: [
      {
        id: '2',
        content: '这是一条回复',
        createdAt: '2025-04-06T12:35:00Z',
        author: {
          id: '2',
          nickname: '回复用户',
          avatar: 'https://example.com/reply-avatar.jpg',
        },
        likes: 5,
        replies: [],
      },
    ],
  },
];

describe('CommentSection', () => {
  it('应该正确渲染评论区域', () => {
    const wrapper = mount(CommentSection, {
      props: {
        comments: mockComments,
        loading: false,
        error: null,
      },
    });

    expect(wrapper.find('.comment-section').exists()).toBe(true);
    expect(wrapper.find('.comment-input').exists()).toBe(true);
    expect(wrapper.find('.comment-list').exists()).toBe(true);
  });

  it('应该显示加载状态', () => {
    const wrapper = mount(CommentSection, {
      props: {
        comments: [],
        loading: true,
        error: null,
      },
    });

    expect(wrapper.find('.loading-spinner').exists()).toBe(true);
  });

  it('应该显示错误状态', () => {
    const errorMessage = '加载失败，请重试';
    const wrapper = mount(CommentSection, {
      props: {
        comments: [],
        loading: false,
        error: errorMessage,
      },
    });

    expect(wrapper.find('.error-message').text()).toBe(errorMessage);
  });

  it('应该正确渲染评论列表', () => {
    const wrapper = mount(CommentSection, {
      props: {
        comments: mockComments,
        loading: false,
        error: null,
      },
    });

    const commentItems = wrapper.findAll('.comment-item');
    expect(commentItems).toHaveLength(1);
    expect(commentItems[0].find('.comment-content').text()).toBe('这是一条测试评论');
    expect(commentItems[0].find('.comment-author').text()).toBe('测试用户');
  });

  it('应该正确渲染回复列表', () => {
    const wrapper = mount(CommentSection, {
      props: {
        comments: mockComments,
        loading: false,
        error: null,
      },
    });

    const replyItems = wrapper.findAll('.reply-item');
    expect(replyItems).toHaveLength(1);
    expect(replyItems[0].find('.reply-content').text()).toBe('这是一条回复');
    expect(replyItems[0].find('.reply-author').text()).toBe('回复用户');
  });

  it('应该正确处理评论提交', async () => {
    const wrapper = mount(CommentSection, {
      props: {
        comments: mockComments,
        loading: false,
        error: null,
      },
    });

    const commentInput = wrapper.find('.comment-input');
    await commentInput.setValue('新评论');
    await commentInput.trigger('keydown.enter');
    expect(wrapper.emitted('comment-submit')).toBeTruthy();
  });

  it('应该正确处理回复提交', async () => {
    const wrapper = mount(CommentSection, {
      props: {
        comments: mockComments,
        loading: false,
        error: null,
      },
    });

    const replyInput = wrapper.find('.reply-input');
    await replyInput.setValue('新回复');
    await replyInput.trigger('keydown.enter');
    expect(wrapper.emitted('reply-submit')).toBeTruthy();
  });

  it('应该正确处理评论点赞', async () => {
    const wrapper = mount(CommentSection, {
      props: {
        comments: mockComments,
        loading: false,
        error: null,
      },
    });

    const likeButton = wrapper.find('.comment-like');
    await likeButton.trigger('click');
    expect(wrapper.emitted('comment-like')).toBeTruthy();
  });

  it('应该正确处理回复点赞', async () => {
    const wrapper = mount(CommentSection, {
      props: {
        comments: mockComments,
        loading: false,
        error: null,
      },
    });

    const replyLikeButton = wrapper.find('.reply-like');
    await replyLikeButton.trigger('click');
    expect(wrapper.emitted('reply-like')).toBeTruthy();
  });

  it('应该在移动端视图下调整布局', () => {
    // 模拟移动端视口
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));

    const wrapper = mount(CommentSection, {
      props: {
        comments: mockComments,
        loading: false,
        error: null,
      },
    });

    const commentSection = wrapper.find('.comment-section');
    expect(commentSection.classes()).toContain('mobile-view');
  });
});
