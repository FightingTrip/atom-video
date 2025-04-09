  <div class="header-right">
    <!-- 语言切换器 -->
    <LanguageSelectorComponent class="language-selector-container" />

    <!-- 上传按钮 -->
    <n-button v-if="isAuthenticated" type="primary" @click="handleUpload">
      <template #icon>
        <n-icon>
          <CloudUploadOutline />
        </n-icon>
      </template>
上传视频
</n-button>

<!-- 用户菜单 -->
<UserMenu />
</div>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { NButton, NIcon } from 'naive-ui';
  import { CloudUploadOutline } from '@vicons/ionicons5';
  import UserMenu from '@/components/business/user/UserMenu.vue';
  import LanguageSelectorComponent from '@/components/business/user/LanguageSelectorComponent.vue';
  import { useAuthStore } from '@/stores/auth';
</script>

<style scoped>

  /* 添加样式 */
  .header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .language-selector-container {
    display: flex;
    align-items: center;
  }

  /* 确保在移动端也能显示 */
  @media (max-width: 768px) {
    .header-right {
      gap: 0.5rem;
    }
  }
</style> 