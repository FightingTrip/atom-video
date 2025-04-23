<template>
  <div class="mock-database-status">
    <n-card title="模拟数据库状态" :bordered="false">
      <div class="header">
        <n-tag type="success" v-if="initialized">已初始化</n-tag>
        <n-tag type="error" v-else>未初始化</n-tag>

        <div class="actions">
          <n-button size="small" @click="refreshStatus">刷新</n-button>
          <n-button size="small" type="primary" @click="initDatabase" :loading="loading" v-if="!initialized">
            初始化
          </n-button>
          <n-button size="small" type="warning" @click="resetDatabase" :loading="loading" v-else>
            重置
          </n-button>
        </div>
      </div>

      <n-divider />

      <div class="database-info" v-if="initialized">
        <n-descriptions label-placement="left" bordered>
          <n-descriptions-item label="用户总数">{{ stats.totalUsers }}</n-descriptions-item>
          <n-descriptions-item label="视频总数">{{ stats.totalVideos }}</n-descriptions-item>
          <n-descriptions-item label="评论总数">{{ stats.totalComments }}</n-descriptions-item>
          <n-descriptions-item label="创作者数量">{{ stats.totalCreators }}</n-descriptions-item>
          <n-descriptions-item label="待审核视频">{{ stats.pendingVideos }}</n-descriptions-item>
          <n-descriptions-item label="待处理举报">{{ stats.pendingReports }}</n-descriptions-item>
        </n-descriptions>
      </div>

      <div class="database-actions">
        <n-space vertical>
          <n-collapse>
            <n-collapse-item title="生成模拟数据" name="generate">
              <n-form ref="formRef" :model="form" label-placement="left" label-width="auto">
                <n-form-item label="用户数量" path="userCount">
                  <n-input-number v-model:value="form.userCount" :min="0" :max="100" />
                </n-form-item>
                <n-form-item label="视频数量" path="videoCount">
                  <n-input-number v-model:value="form.videoCount" :min="0" :max="200" />
                </n-form-item>
                <n-form-item label="评论数量" path="commentCount">
                  <n-input-number v-model:value="form.commentCount" :min="0" :max="500" />
                </n-form-item>
                <n-form-item label="举报数量" path="reportCount">
                  <n-input-number v-model:value="form.reportCount" :min="0" :max="100" />
                </n-form-item>
                <n-form-item>
                  <n-button type="primary" @click="generateData" :loading="loading">生成数据</n-button>
                </n-form-item>
              </n-form>
            </n-collapse-item>
          </n-collapse>
        </n-space>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { useMessage } from 'naive-ui';
  import { isMockDatabaseInitialized, initMockDatabase, resetMockDatabase } from '@/utils/mockInitializer';

  const message = useMessage();
  const initialized = ref(false);
  const loading = ref(false);
  const stats = reactive({
    totalUsers: 0,
    totalVideos: 0,
    totalComments: 0,
    totalCreators: 0,
    pendingVideos: 0,
    pendingReports: 0,
  });

  const form = reactive({
    userCount: 10,
    videoCount: 20,
    commentCount: 50,
    reportCount: 10,
  });

  // 检查数据库初始化状态
  const checkInitStatus = () => {
    initialized.value = isMockDatabaseInitialized();
  };

  // 刷新状态信息
  const refreshStatus = async () => {
    checkInitStatus();
    if (initialized.value) {
      await fetchDatabaseStats();
    }
    message.success('状态已刷新');
  };

  // 初始化数据库
  const initDatabase = async () => {
    try {
      loading.value = true;
      await initMockDatabase();
      initialized.value = true;
      await fetchDatabaseStats();
      message.success('数据库初始化成功');
    } catch (error) {
      message.error('数据库初始化失败');
      console.error('初始化失败:', error);
    } finally {
      loading.value = false;
    }
  };

  // 重置数据库
  const resetDatabase = async () => {
    try {
      loading.value = true;
      resetMockDatabase();
      initialized.value = false;
      message.success('数据库已重置，页面将在3秒后刷新');
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      message.error('数据库重置失败');
      console.error('重置失败:', error);
    } finally {
      loading.value = false;
    }
  };

  // 获取数据库统计信息
  const fetchDatabaseStats = async () => {
    try {
      // 实现模拟数据库统计信息获取
      // 这里可以调用mockDb的方法获取统计信息
      const response = await fetch('/api/admin/dashboard/stats');
      const data = await response.json();

      stats.totalUsers = data.totalUsers || 0;
      stats.totalVideos = data.totalVideos || 0;
      stats.totalComments = data.totalComments || 0;
      stats.totalCreators = data.totalCreators || 0;
      stats.pendingVideos = data.pendingVideos || 0;
      stats.pendingReports = data.pendingReports || 0;
    } catch (error) {
      console.error('获取统计信息失败:', error);
    }
  };

  // 生成模拟数据
  const generateData = async () => {
    try {
      loading.value = true;

      // 实现生成模拟数据的逻辑
      // 这里可以调用mockDb的方法生成数据
      const response = await fetch('/api/mock/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userCount: form.userCount,
          videoCount: form.videoCount,
          commentCount: form.commentCount,
          reportCount: form.reportCount
        })
      });

      if (response.ok) {
        message.success('数据生成成功');
        await fetchDatabaseStats();
      } else {
        message.error('数据生成失败');
      }
    } catch (error) {
      message.error('数据生成失败');
      console.error('生成失败:', error);
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    checkInitStatus();
    if (initialized.value) {
      fetchDatabaseStats();
    }
  });
</script>

<style scoped>
  .mock-database-status {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .actions {
    display: flex;
    gap: 8px;
  }

  .database-info {
    margin-bottom: 20px;
  }

  .database-actions {
    margin-top: 20px;
  }
</style>