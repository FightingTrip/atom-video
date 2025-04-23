<!-- 
  MockDevTools组件
  用于在开发环境中提供模拟数据库的管理工具
-->
<template>
  <div v-if="isVisible" class="mock-dev-tools">
    <div class="header">
      <h2>模拟数据开发工具</h2>
      <button @click="toggleTools" class="close-button">关闭</button>
    </div>

    <div class="body">
      <div class="tabs">
        <button class="tab-button" :class="{ active: activeTab === 'status' }" @click="activeTab = 'status'">
          状态
        </button>
        <button class="tab-button" :class="{ active: activeTab === 'data' }" @click="activeTab = 'data'">
          数据
        </button>
        <button class="tab-button" :class="{ active: activeTab === 'migration' }" @click="activeTab = 'migration'">
          迁移
        </button>
      </div>

      <div class="tab-content">
        <div v-if="activeTab === 'status'">
          <MockDatabaseStatus />
        </div>

        <div v-if="activeTab === 'data'">
          <div class="data-tools">
            <h3 class="text-lg font-medium mb-3">数据工具</h3>
            <div class="grid grid-cols-2 gap-4">
              <button @click="generateData('users')" class="action-button">
                生成用户
              </button>
              <button @click="generateData('videos')" class="action-button">
                生成视频
              </button>
              <button @click="generateData('comments')" class="action-button">
                生成评论
              </button>
              <button @click="generateData('reports')" class="action-button">
                生成举报
              </button>
              <button @click="generateData('all')" class="action-button green">
                全部生成
              </button>
              <button @click="clearData" class="action-button red">
                清除数据
              </button>
            </div>

            <div class="mt-3">
              <label class="block text-sm mb-1">数量</label>
              <input v-model="generateCount" type="number" min="1" max="100" class="w-full p-2 border rounded" />
            </div>

            <div v-if="dataMessage" class="mt-3 p-2 bg-gray-100 rounded text-sm">
              {{ dataMessage }}
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'migration'">
          <MockMigrationStatus />
        </div>
      </div>
    </div>
  </div>

  <div v-else class="mock-dev-tools-toggle">
    <button @click="toggleTools" class="toggle-button">
      开发工具
    </button>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import MockDatabaseStatus from './MockDatabaseStatus.vue';
  import MockMigrationStatus from './MockMigrationStatus.vue';
  import mockDb from '@/mock/mockDb';
  import { mockDelay } from '@/utils/mockInitializer';
  import axios from 'axios';

  const isVisible = ref(false);
  const activeTab = ref('status');
  const generateCount = ref(10);
  const dataMessage = ref('');

  function toggleTools() {
    isVisible.value = !isVisible.value;
  }

  // 生成模拟数据
  async function generateData(type: 'users' | 'videos' | 'comments' | 'reports' | 'all') {
    const count = generateCount.value;
    dataMessage.value = `正在生成${count}条${type === 'all' ? '所有类型' : type}数据...`;

    try {
      // 如果是全部类型，则依次生成各类型数据
      if (type === 'all') {
        await generateData('users');
        await generateData('videos');
        await generateData('comments');
        await generateData('reports');
        return;
      }

      // 调用相应的数据生成API
      const response = await axios.post(`/api/mock/generate/${type}`, { count });

      if (response.data.success) {
        dataMessage.value = response.data.message || `成功处理${type}数据生成请求!`;
      } else {
        throw new Error(response.data.message || '数据生成失败');
      }

      setTimeout(() => {
        dataMessage.value = '';
      }, 3000);
    } catch (error) {
      dataMessage.value = `生成数据失败: ${error instanceof Error ? error.message : '未知错误'}`;
    }
  }

  // 清除数据
  async function clearData() {
    dataMessage.value = '正在清除数据...';

    try {
      // 模拟API调用延迟
      await mockDelay(500, 1000);

      // 提示重置数据库 - 模拟实现
      dataMessage.value = '数据已清除，请刷新页面重新初始化模拟数据库。';

      // 调用实际的重置方法
      localStorage.removeItem('mock_db_initialized');
    } catch (error) {
      dataMessage.value = `清除数据失败: ${error instanceof Error ? error.message : '未知错误'}`;
    }
  }
</script>

<style scoped>
  .mock-dev-tools {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 400px;
    background: white;
    border-top-left-radius: 10px;
    box-shadow: -2px -2px 10px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    max-height: 80vh;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    background: #f3f4f6;
    border-top-left-radius: 10px;
    border-bottom: 1px solid #e5e7eb;
  }

  .header h2 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }

  .close-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    color: #4b5563;
  }

  .body {
    padding: 15px;
    overflow-y: auto;
    flex: 1;
  }

  .tabs {
    display: flex;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 15px;
  }

  .tab-button {
    padding: 8px 16px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    color: #6b7280;
    border-bottom: 2px solid transparent;
  }

  .tab-button.active {
    color: #4f46e5;
    border-bottom-color: #4f46e5;
  }

  .tab-content {
    padding: 10px 0;
  }

  .action-button {
    padding: 8px 12px;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
  }

  .action-button:hover {
    background: #e5e7eb;
  }

  .action-button.green {
    background: #d1fae5;
    border-color: #a7f3d0;
  }

  .action-button.green:hover {
    background: #a7f3d0;
  }

  .action-button.red {
    background: #fee2e2;
    border-color: #fecaca;
  }

  .action-button.red:hover {
    background: #fecaca;
  }

  .mock-dev-tools-toggle {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9998;
  }

  .toggle-button {
    padding: 10px 15px;
    background: #4f46e5;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .toggle-button:hover {
    background: #4338ca;
  }
</style>