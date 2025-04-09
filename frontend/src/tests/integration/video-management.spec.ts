import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { createRouter, createWebHistory } from 'vue-router';
import Upload from '@/pages/video/Upload.vue';
import VideoDetail from '@/pages/video/VideoDetail.vue';
import VideoListComponent from '@/pages/video/VideoListComponent.vue';
import { useVideoStore } from '@/stores/video';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/upload',
      component: Upload,
    },
    {
      path: '/video/:id',
      component: VideoDetail,
    },
    {
      path: '/videos',
      component: VideoListComponent,
    },
  ],
});

describe('视频管理流程集成测试', () => {
  const mockVideo = {
    id: '1',
    title: '测试视频',
    description: '这是一个测试视频',
    coverUrl: 'https://example.com/cover.jpg',
    duration: 120,
    views: 1000,
    likes: 100,
    favorites: 50,
    createdAt: '2024-01-01T00:00:00Z',
    author: {
      id: '1',
      username: 'testuser',
      avatar: 'https://example.com/avatar.jpg',
      nickname: '测试用户',
    },
    tags: ['测试', '视频'],
    category: '测试分类',
    isLiked: false,
    isFavorited: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('上传视频', async () => {
    const videoStore = useVideoStore();
    vi.spyOn(videoStore, 'uploadVideo').mockResolvedValue(mockVideo);

    const wrapper = mount(Upload, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: {
                isAuthenticated: true,
              },
            },
          }),
          router,
        ],
      },
    });

    const formData = {
      title: '测试视频',
      description: '这是一个测试视频',
      category: '测试分类',
      tags: ['测试', '视频'],
      coverFile: new File([''], 'cover.jpg'),
      videoFile: new File([''], 'video.mp4'),
    };

    await wrapper.find('.title-input').setValue(formData.title);
    await wrapper.find('.description-input').setValue(formData.description);
    await wrapper.find('.category-select').setValue(formData.category);
    await wrapper.find('.tags-input').setValue(formData.tags.join(','));
    await wrapper.find('.cover-input').setValue(formData.coverFile);
    await wrapper.find('.video-input').setValue(formData.videoFile);
    await wrapper.find('.submit-btn').trigger('click');

    expect(videoStore.uploadVideo).toHaveBeenCalledWith(
      expect.objectContaining({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: formData.tags,
      })
    );
  });

  it('编辑视频信息', async () => {
    const videoStore = useVideoStore();
    vi.spyOn(videoStore, 'getVideoDetail').mockResolvedValue(mockVideo);
    vi.spyOn(videoStore, 'updateVideo').mockResolvedValue({
      ...mockVideo,
      title: '更新后的标题',
      description: '更新后的描述',
    });

    const wrapper = mount(VideoDetail, {
      props: {
        id: '1',
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: {
                isAuthenticated: true,
                user: {
                  id: '1',
                },
              },
            },
          }),
          router,
        ],
      },
    });

    await wrapper.vm.$nextTick();
    await wrapper.find('.edit-btn').trigger('click');
    await wrapper.find('.title-input').setValue('更新后的标题');
    await wrapper.find('.description-input').setValue('更新后的描述');
    await wrapper.find('.save-btn').trigger('click');

    expect(videoStore.updateVideo).toHaveBeenCalledWith('1', {
      title: '更新后的标题',
      description: '更新后的描述',
    });
  });

  it('删除视频', async () => {
    const videoStore = useVideoStore();
    vi.spyOn(videoStore, 'deleteVideo').mockResolvedValue();

    const wrapper = mount(VideoDetail, {
      props: {
        id: '1',
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: {
                isAuthenticated: true,
                user: {
                  id: '1',
                },
              },
            },
          }),
          router,
        ],
      },
    });

    await wrapper.vm.$nextTick();
    await wrapper.find('.delete-btn').trigger('click');
    expect(videoStore.deleteVideo).toHaveBeenCalledWith('1');
  });

  it('管理视频列表', async () => {
    const videoStore = useVideoStore();
    vi.spyOn(videoStore, 'getUserVideos').mockResolvedValue([mockVideo]);

    const wrapper = mount(VideoListComponent, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: {
                isAuthenticated: true,
                user: {
                  id: '1',
                },
              },
            },
          }),
          router,
        ],
      },
    });

    await wrapper.vm.$nextTick();
    expect(videoStore.getUserVideos).toHaveBeenCalledWith('1');
    expect(wrapper.findAll('.video-card')).toHaveLength(1);
  });

  it('未登录用户尝试上传视频', async () => {
    const wrapper = mount(Upload, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: {
                isAuthenticated: false,
              },
            },
          }),
          router,
        ],
      },
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find('.login-prompt').exists()).toBe(true);
  });

  it('非作者尝试编辑视频', async () => {
    const wrapper = mount(VideoDetail, {
      props: {
        id: '1',
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: {
                isAuthenticated: true,
                user: {
                  id: '2',
                },
              },
            },
          }),
          router,
        ],
      },
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find('.edit-btn').exists()).toBe(false);
  });
});
