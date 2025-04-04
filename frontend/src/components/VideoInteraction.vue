// 技术栈说明：
// - Vue 3: 使用 Composition API 和
<script setup>  语法
    // - TypeScript: 强类型支持
    // - Tailwind CSS: 样式框架
    // - Pinia: 状态管理

    < template >
  <div class="space-y-4">
    <!-- 互动按钮 -->
    <div class="flex items-center space-x-6">
      <!-- 点赞按钮 -->
      <button 
        @click="toggleLike" 
        class="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
        :class="{ 'text-red-500': isLiked }"
      >
        <i :class="isLiked ? 'fas fa-heart' : 'far fa-heart'"></i>
        <span>{{ formatNumber(likeCount) }}</span>
      </button>

      <!--收藏按钮 -->
    <button 
        @click="toggleFavorite"
  class="flex items-center space-x-2 text-gray-600 hover:text-yellow-500 transition-colors"
        : class="{ 'text-yellow-500': isFavorited }"
    >
    <i:class="isFavorited ? 'fas fa-star' : 'far fa-star'" ></i >
      <span>{{ formatNumber(favoriteCount) }}</span>
      </button >

      < !--分享按钮 -->
    <button 
        @click="showShareModal = true"
  class="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
    >
        <i class="fas fa-share-alt"></i>
        <span>分享</span>
      </button >
    </div >

    < !--评论区域 -->
    <div class="space-y-4">
      <div class="flex items-start space-x-4">
        <img 
          :src="authStore.user?.avatar || '/default-avatar.png'" 
          :alt="authStore.user?.username" 
          class="w-10 h-10 rounded-full"
        />
        <div class="flex-1">
          <textarea
            v-model="commentContent"
            placeholder="添加评论..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            rows="2"
          ></textarea>
          <div class="flex justify-end mt-2">
            <button 
              @click="submitComment" 
              :disabled="!commentContent.trim() || isSubmitting"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? '提交中...' : '评论' }}
            </button>
          </div>
        </div>
      </div>

      <!--评论列表 -->
    <div class="space-y-4">
      <div v-for="comment in comments" :key="comment.id" class="flex space-x-4">
      <img:src="comment.user.avatar || '/default-avatar.png'"
      :alt="comment.user.username"
      class="w-10 h-10 rounded-full"
          />
      <div class="flex-1">
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span class="font-medium">{{ comment.user.username }}</span>
              <span class="text-sm text-gray-500">{{ formatTimeAgo(comment.createdAt) }}</span>
            </div>
            <button
              v-if="comment.user.id === authStore.user?.id"
                  @click="deleteComment(comment.id)"
            class="text-gray-400 hover:text-red-500"
                >
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
        <p class="mt-2 text-gray-700">{{ comment.content }}</p>
      </div>
    </div>
        </div >
      </div >

      < !--加载更多评论 -->
    <div v-if="hasMoreComments" class="text-center">
      <button 
          @click="loadMoreComments"
      :disabled="isLoadingComments"
      class="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
      {{ isLoadingComments? '加载中...': '加载更多评论' }}
    </button>
      </div >
    </div >

    < !--分享模态框 -->
    <div v-if="showShareModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">分享视频</h3>
          <button @click="showShareModal = false" class="text-gray-400 hover:text-gray-500">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="space-y-4">
        <div class="flex items-center space-x-2">
          <input
            type="text" 
              :value="videoUrl"
          readonly
          class="flex-1 px-4 py-2 border border-gray-300 rounded-md"
            />
          <button 
              @click="copyToClipboard"
          class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
          复制链接
        </button>
      </div>
      <div class="flex justify-center space-x-4">
        <button
          v-for="platform in sharePlatforms" 
              :key="platform.name"
        @click="shareToPlatform(platform)"
        class="p-2 rounded-full hover:bg-gray-100"
            >
        <i:class="platform.icon"></i>
    </button>
          </div >
        </div >
      </div >
    </div >
  </div >
</template >

    <script setup lang="ts">
      import {ref, computed, onMounted} from 'vue';
      import {useAuthStore} from '@/stores/auth';
      import {useToast} from '@/composables/useToast';
      import api from '@/utils/api';

      interface User {
        id: string;
      username: string;
      avatar?: string;
}

      interface Comment {
        id: string;
      content: string;
      createdAt: string;
      user: User;
}

      interface SharePlatform {
        name: string;
      icon: string;
      url: string;
}

      const props = defineProps<{
  videoId: string;
      initialLikeCount: number;
      initialFavoriteCount: number;
      initialIsLiked: boolean;
      initialIsFavorited: boolean;
}>();

      const authStore = useAuthStore();
      const toast = useToast();

      // 状态管理
      const isLiked = ref(props.initialIsLiked);
      const isFavorited = ref(props.initialIsFavorited);
      const likeCount = ref(props.initialLikeCount);
      const favoriteCount = ref(props.initialFavoriteCount);
      const commentContent = ref('');
      const comments = ref<Comment[]>([]);
      const isSubmitting = ref(false);
      const isLoadingComments = ref(false);
      const hasMoreComments = ref(true);
      const showShareModal = ref(false);
      const currentPage = ref(1);
      const pageSize = 10;

      // 分享平台
      const sharePlatforms = ref<SharePlatform[]>([
      {name: '微信', icon: 'fab fa-weixin', url: 'https://weixin.qq.com/' },
      {name: '微博', icon: 'fab fa-weibo', url: 'https://weibo.com/' },
      {name: 'QQ', icon: 'fab fa-qq', url: 'https://im.qq.com/' },
      {name: 'Twitter', icon: 'fab fa-twitter', url: 'https://twitter.com/' },
      ]);

// 计算属性
const videoUrl = computed(() => {
  return `${window.location.origin}/video/${props.videoId}`;
});

// 方法定义
const toggleLike = async () => {
  if (!authStore.isAuthenticated) {
        toast.error('请先登录');
      return;
  }

      try {
    const response = await api.post(`/videos/${props.videoId}/like`);
      isLiked.value = response.data.isLiked;
      likeCount.value = response.data.likeCount;
      toast.success(isLiked.value ? '已点赞' : '已取消点赞');
  } catch (err: any) {
        toast.error(err.response?.data?.message || '操作失败');
  }
};

const toggleFavorite = async () => {
  if (!authStore.isAuthenticated) {
        toast.error('请先登录');
      return;
  }

      try {
    const response = await api.post(`/videos/${props.videoId}/favorite`);
      isFavorited.value = response.data.isFavorited;
      favoriteCount.value = response.data.favoriteCount;
      toast.success(isFavorited.value ? '已收藏' : '已取消收藏');
  } catch (err: any) {
        toast.error(err.response?.data?.message || '操作失败');
  }
};

const submitComment = async () => {
  if (!authStore.isAuthenticated) {
        toast.error('请先登录');
      return;
  }

      if (!commentContent.value.trim()) return;

      isSubmitting.value = true;
      try {
    const response = await api.post(`/videos/${props.videoId}/comments`, {
        content: commentContent.value,
    });
      comments.value.unshift(response.data);
      commentContent.value = '';
      toast.success('评论成功');
  } catch (err: any) {
        toast.error(err.response?.data?.message || '评论失败');
  } finally {
        isSubmitting.value = false;
  }
};

const loadMoreComments = async () => {
  if (isLoadingComments.value || !hasMoreComments.value) return;

      isLoadingComments.value = true;
      try {
    const response = await api.get(`/videos/${props.videoId}/comments`, {
        params: {
        page: currentPage.value + 1,
      pageSize,
      },
    });
      comments.value.push(...response.data.comments);
      hasMoreComments.value = response.data.hasMore;
      currentPage.value++;
  } catch (err: any) {
        toast.error(err.response?.data?.message || '加载评论失败');
  } finally {
        isLoadingComments.value = false;
  }
};

const deleteComment = async (commentId: string) => {
  try {
        await api.delete(`/videos/${props.videoId}/comments/${commentId}`);
    comments.value = comments.value.filter(comment => comment.id !== commentId);
      toast.success('评论已删除');
  } catch (err: any) {
        toast.error(err.response?.data?.message || '删除评论失败');
  }
};

const copyToClipboard = async () => {
  try {
        await navigator.clipboard.writeText(videoUrl.value);
      toast.success('链接已复制到剪贴板');
  } catch (err) {
        toast.error('复制失败');
  }
};

const shareToPlatform = (platform: SharePlatform) => {
  const shareUrl = `${platform.url}?url=${encodeURIComponent(videoUrl.value)}`;
      window.open(shareUrl, '_blank');
};

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
      return num.toString();
};

const formatTimeAgo = (date: string) => {
  const now = new Date();
      const then = new Date(date);
      const diff = now.getTime() - then.getTime();

      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}天前`;
  if (hours > 0) return `${hours}小时前`;
  if (minutes > 0) return `${minutes}分钟前`;
      return '刚刚';
};

// 初始化
onMounted(async () => {
        await loadMoreComments();
});
</script>