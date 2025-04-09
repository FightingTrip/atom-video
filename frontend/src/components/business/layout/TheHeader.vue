  <div class="header-right">
    <!-- 语言切换器 -->
    <LanguageSelector />

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
  import LanguageSelector from '@/components/business/user/LanguageSelector.vue';
  import { useAuthStore } from '@/stores/auth';
</script> 