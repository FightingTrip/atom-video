<!-- 
  MockMigrationStatus组件
  用于显示模拟数据库的迁移状态和提供迁移操作
-->
<template>
  <div class="migration-status-card">
    <h3 class="text-lg font-semibold mb-2">数据库迁移状态</h3>

    <div class="mb-4">
      <div class="flex items-center justify-between mb-1">
        <span>当前版本:</span>
        <span
          :class="{ 'text-green-600': currentVersion >= latestVersion, 'text-amber-500': currentVersion < latestVersion }"
          class="font-mono">
          v{{ currentVersion }}
        </span>
      </div>
      <div class="flex items-center justify-between">
        <span>最新版本:</span>
        <span class="font-mono">v{{ latestVersion }}</span>
      </div>
    </div>

    <div class="space-y-2">
      <button @click="runMigration"
        class="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        :disabled="isLoading || currentVersion >= latestVersion">
        <span v-if="isLoading">迁移中...</span>
        <span v-else-if="currentVersion >= latestVersion">已是最新版本</span>
        <span v-else>运行迁移</span>
      </button>

      <button @click="resetMigration"
        class="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
        :disabled="isLoading">
        重置迁移状态
      </button>
    </div>

    <div class="mt-4 text-xs text-gray-500">
      <p v-if="lastMigrationTime">上次迁移: {{ formatTime(lastMigrationTime) }}</p>
      <p v-if="migrationMessage" :class="{ 'text-green-600': migrationSuccess, 'text-red-600': !migrationSuccess }">
        {{ migrationMessage }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import {
    CURRENT_MIGRATION_VERSION,
    checkNeedsMigration,
    runMigrations,
    resetMigrationStatus
  } from '@/utils/mockDbMigration';

  // 状态
  const currentVersion = ref(0);
  const latestVersion = ref(CURRENT_MIGRATION_VERSION);
  const isLoading = ref(false);
  const migrationMessage = ref('');
  const migrationSuccess = ref(true);
  const lastMigrationTime = ref<number | null>(null);

  // 初始化
  onMounted(() => {
    loadCurrentVersion();
  });

  // 加载当前版本
  function loadCurrentVersion() {
    const version = localStorage.getItem('mock_db_version');
    currentVersion.value = version ? parseInt(version) : 0;

    const lastTime = localStorage.getItem('mock_db_migration_time');
    lastMigrationTime.value = lastTime ? parseInt(lastTime) : null;
  }

  // 运行迁移
  async function runMigration() {
    if (isLoading.value) return;

    isLoading.value = true;
    migrationMessage.value = '';

    try {
      const result = await runMigrations();
      migrationSuccess.value = result;

      if (result) {
        migrationMessage.value = '迁移成功完成';
        // 更新时间戳
        const now = Date.now();
        localStorage.setItem('mock_db_migration_time', now.toString());
        lastMigrationTime.value = now;
      } else {
        migrationMessage.value = '迁移过程中出现错误';
      }

      // 重新加载版本
      loadCurrentVersion();
    } catch (error) {
      console.error('迁移失败:', error);
      migrationSuccess.value = false;
      migrationMessage.value = `迁移失败: ${error instanceof Error ? error.message : '未知错误'}`;
    } finally {
      isLoading.value = false;
    }
  }

  // 重置迁移状态
  function resetMigration() {
    if (isLoading.value) return;

    resetMigrationStatus();
    localStorage.removeItem('mock_db_migration_time');
    migrationMessage.value = '已重置迁移状态';
    loadCurrentVersion();
  }

  // 格式化时间
  function formatTime(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
  }
</script>

<style scoped>
  .migration-status-card {
    @apply p-4 bg-white rounded-lg shadow-md border border-gray-200;
  }
</style>