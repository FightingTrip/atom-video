/**
 * @file CommentList.test.ts
 * @description CommentList 组件的测试用例
 * @author Atom Video Team
 * @date 2025-04-06
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import CommentList from '../CommentList.vue';

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

describe('CommentList', () => {
  it('应该正确渲染评论列表', () => {
    const wrapper = mount(CommentList, {
      props: {
        comments: mockComments,
        loading: false,
        error: null,
      },
    });

    expect(wrapper.find('.comment-list').exists()).toBe(true);
    const commentItems = wrapper.findAll('.comment-item');
    expect(commentItems).toHaveLength(1);
  });

  it('应该显示加载状态', () => {
    const wrapper = mount(CommentList, {
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
    const wrapper = mount(CommentList, {
      props: {
        comments: [],
        loading: false,
        error: errorMessage,
      },
    });

    expect(wrapper.find('.error-message').text()).toBe(errorMessage);
  });

  it('应该正确渲染评论内容', () => {
    const wrapper = mount(CommentList, {
      props: {
        comments: mockComments,
        loading: false,
        error: null,
      },
    });

    const commentItem = wrapper.find('.comment-item');
    expect(commentItem.find('.comment-content').text()).toBe('这是一条测试评论');
    expect(commentItem.find('.comment-author').text()).toBe('测试用户');
    expect(commentItem.find('.comment-time').exists()).toBe(true);
  });

  it('应该正确渲染回复内容', () => {
    const wrapper = mount(CommentList, {
      props: {
        comments: mockComments,
        loading: false,
        error: null,
      },
    });

    const replyItem = wrapper.find('.reply-item');
    expect(replyItem.find('.reply-content').text()).toBe('这是一条回复');
    expect(replyItem.find('.reply-author').text()).toBe('回复用户');
    expect(replyItem.find('.reply-time').exists()).toBe(true);
  });

  it('应该正确处理评论点赞', async () => {
    const wrapper = mount(CommentList, {
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
    const wrapper = mount(CommentList, {
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

  it('应该正确处理回复展开/收起', async () => {
    const wrapper = mount(CommentList, {
      props: {
        comments: mockComments,
        loading: false,
        error: null,
      },
    });

    const toggleButton = wrapper.find('.toggle-replies');
    await toggleButton.trigger('click');
    expect(wrapper.emitted('toggle-replies')).toBeTruthy();
  });

  it('应该正确处理评论删除', async () => {
    const wrapper = mount(CommentList, {
      props: {
        comments: mockComments,
        loading: false,
        error: null,
      },
    });

    const deleteButton = wrapper.find('.delete-comment');
    await deleteButton.trigger('click');
    expect(wrapper.emitted('delete-comment')).toBeTruthy();
  });

  it('应该在移动端视图下调整布局', () => {
    // 模拟移动端视口
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));

    const wrapper = mount(CommentList, {
      props: {
        comments: mockComments,
        loading: false,
        error: null,
      },
    });

    const commentList = wrapper.find('.comment-list');
    expect(commentList.classes()).toContain('mobile-view');
  });

  it('应该正确格式化时间', () => {
    const wrapper = mount(CommentList, {
      props: {
        comments: mockComments,
        loading: false,
        error: null,
      },
    });

    const commentTime = wrapper.find('.comment-time');
    expect(commentTime.text()).toMatch(/\d{4}-\d{2}-\d{2}/);
  });
});
