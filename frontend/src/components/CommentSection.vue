<template>
  <div class="space-y-4">
    <!-- 评论输入框 -->
    <div class="flex gap-4">
      <n-avatar :src="userAvatar" :round="true" />
      <div class="flex-grow">
        <n-input v-model:value="commentText" type="textarea" placeholder="添加评论..."
          :autosize="{ minRows: 2, maxRows: 6 }" />
        <div class="flex justify-end mt-2 gap-2">
          <n-button @click="commentText = ''">取消</n-button>
          <n-button type="primary" :disabled="!commentText.trim()" @click="submitComment">
            评论
          </n-button>
        </div>
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="space-y-4">
      <div v-for="comment in comments" :key="comment.id" class="flex gap-4">
        <n-avatar :src="comment.user.avatar" :round="true" />
        <div class="flex-grow">
          <div class="flex items-center gap-2">
            <router-link :to="`/user/${comment.user.id}`" class="font-medium hover:text-blue-500">
              {{ comment.user.nickname }}
            </router-link>
            <span class="text-sm text-gray-500">{{ formatTime(comment.createdAt) }}</span>
          </div>
          <p class="mt-1">{{ comment.content }}</p>
          <div class="flex items-center gap-4 mt-2">
            <button class="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
              <i class="fas fa-thumbs-up"></i>
              {{ formatNumber(comment.likes) }}
            </button>
            <button class="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
              <i class="fas fa-thumbs-down"></i>
            </button>
            <button class="text-sm text-gray-500 hover:text-gray-700">回复</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>