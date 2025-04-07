<!-- 视频资源组件 -->
<template>
  <div class="video-resources" v-if="video?.sourceCodeUrl || video?.liveDemo">
    <h3>相关资源</h3>
    <div class="resource-links">
      <a v-if="video.sourceCodeUrl" :href="video.sourceCodeUrl" target="_blank" class="resource-link">
        <el-icon>
          <Document />
        </el-icon>
        源代码
      </a>
      <a v-if="video.liveDemo" :href="video.liveDemo" target="_blank" class="resource-link">
        <el-icon>
          <Monitor />
        </el-icon>
        在线演示
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Document, Monitor } from '@element-plus/icons-vue';
  import type { IVideo } from '@atom-video/shared-types';

  defineProps<{
    video: IVideo | null;
  }>();
</script>

<style scoped>
  .video-resources {
    margin-bottom: 24px;
    padding: 16px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  h3 {
    margin: 0 0 16px;
    font-size: 18px;
    color: #333;
  }

  .resource-links {
    display: flex;
    gap: 16px;
    margin-top: 16px;
  }

  .resource-link {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #409eff;
    text-decoration: none;
    transition: color 0.3s;
  }

  .resource-link:hover {
    color: #66b1ff;
  }

  .resource-link .el-icon {
    font-size: 16px;
  }
</style>