/**
* @file MentionPicker.vue
* @description @用户选择器组件
* @author Atom Video Team
* @date 2025-04-09
*/

<template>
  <div class="mention-picker" :class="{ 'is-active': active }" v-click-outside="close">
    <div class="trigger" @click="toggle">
      <n-button quaternary size="small">
        <template #icon>
          <n-icon>
            <At />
          </n-icon>
        </template>
        <slot>@用户</slot>
      </n-button>
    </div>

    <div v-if="active" class="mention-panel">
      <div class="mention-search">
        <n-input v-model:value="searchQuery" placeholder="搜索用户..." size="small" clearable @input="handleSearch"
          ref="searchInputRef">
          <template #prefix>
            <n-icon>
              <SearchOutline />
            </n-icon>
          </template>
        </n-input>
      </div>

      <div class="mention-list" v-if="filteredUsers.length > 0">
        <div v-for="user in filteredUsers" :key="user.id" class="mention-item"
          :class="{ 'is-selected': selectedIndex === filteredUsers.indexOf(user) }" @click="selectUser(user)"
          @mouseenter="selectedIndex = filteredUsers.indexOf(user)">
          <n-avatar round size="small" :src="user.avatar" />
          <div class="mention-info">
            <div class="mention-name">{{ user.nickname }}</div>
            <div class="mention-username">@{{ user.username }}</div>
          </div>
        </div>
      </div>

      <div v-else-if="loading" class="mention-empty">
        <n-spin size="small" />
        <span>加载中...</span>
      </div>

      <div v-else class="mention-empty">
        <n-icon>
          <PersonOutline />
        </n-icon>
        <span>未找到匹配用户</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
  import { NButton, NInput, NIcon, NAvatar, NSpin } from 'naive-ui';
  import { At, SearchOutline, PersonOutline } from '@vicons/ionicons5';
  import { userService } from '@/services';

  const props = defineProps({
    modelValue: {
      type: String,
      default: ''
    },
    highlightFirst: {
      type: Boolean,
      default: true
    }
  });

  const emit = defineEmits(['update:modelValue', 'select']);

  // 状态
  const active = ref(false);
  const searchQuery = ref('');
  const users = ref<any[]>([]);
  const filteredUsers = ref<any[]>([]);
  const loading = ref(false);
  const selectedIndex = ref(-1);
  const searchInputRef = ref<HTMLInputElement | null>(null);

  // 初始用户列表
  onMounted(async () => {
    loading.value = true;
    try {
      // 模拟获取推荐用户列表
      // 实际应用中替换为API调用: const data = await userService.getRecommendedUsers();
      await new Promise(resolve => setTimeout(resolve, 300));

      users.value = [
        { id: 'user1', username: 'zhangsan', nickname: '张三', avatar: 'https://i.pravatar.cc/100?u=1' },
        { id: 'user2', username: 'lisi', nickname: '李四', avatar: 'https://i.pravatar.cc/100?u=2' },
        { id: 'user3', username: 'wangwu', nickname: '王五', avatar: 'https://i.pravatar.cc/100?u=3' },
        { id: 'user4', username: 'zhaoliu', nickname: '赵六', avatar: 'https://i.pravatar.cc/100?u=4' },
        { id: 'user5', username: 'qianqi', nickname: '钱七', avatar: 'https://i.pravatar.cc/100?u=5' },
      ];
      filteredUsers.value = [...users.value];

      // 如果设置了高亮第一个，则默认选中第一项
      if (props.highlightFirst && filteredUsers.value.length > 0) {
        selectedIndex.value = 0;
      }
    } catch (error) {
      console.error('加载用户列表失败:', error);
    } finally {
      loading.value = false;
    }
  });

  // 点击外部关闭
  const close = () => {
    active.value = false;
  };

  // 切换面板
  const toggle = () => {
    active.value = !active.value;

    if (active.value) {
      nextTick(() => {
        // 聚焦搜索框
        if (searchInputRef.value) {
          searchInputRef.value.focus();
        }
      });
    }
  };

  // 搜索处理
  const handleSearch = () => {
    if (!searchQuery.value.trim()) {
      filteredUsers.value = [...users.value];
    } else {
      const query = searchQuery.value.toLowerCase();
      filteredUsers.value = users.value.filter(user =>
        user.nickname.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query)
      );
    }

    // 重置选中状态
    selectedIndex.value = props.highlightFirst && filteredUsers.value.length > 0 ? 0 : -1;
  };

  // 选择用户
  const selectUser = (user: any) => {
    emit('update:modelValue', `@${user.username} `);
    emit('select', user);
    active.value = false;
  };

  // 键盘导航
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!active.value) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (selectedIndex.value < filteredUsers.value.length - 1) {
          selectedIndex.value++;
        } else {
          selectedIndex.value = 0;
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (selectedIndex.value > 0) {
          selectedIndex.value--;
        } else {
          selectedIndex.value = filteredUsers.value.length - 1;
        }
        break;

      case 'Enter':
        e.preventDefault();
        if (selectedIndex.value >= 0 && selectedIndex.value < filteredUsers.value.length) {
          selectUser(filteredUsers.value[selectedIndex.value]);
        }
        break;

      case 'Escape':
        e.preventDefault();
        active.value = false;
        break;
    }
  };

  // 添加键盘事件
  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown);
  });

  // 移除键盘事件
  onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeyDown);
  });

  // 点击外部指令
  const vClickOutside = {
    mounted(el: HTMLElement, binding: any) {
      el._clickOutside = (event: Event) => {
        if (!(el === event.target || el.contains(event.target as Node))) {
          binding.value(event);
        }
      };
      document.addEventListener('click', el._clickOutside);
    },
    unmounted(el: HTMLElement) {
      document.removeEventListener('click', el._clickOutside);
    }
  };
</script>

<style scoped>
  .mention-picker {
    position: relative;
    display: inline-block;
  }

  .mention-panel {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 8px;
    width: 250px;
    max-height: 300px;
    background-color: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .mention-search {
    padding: 8px;
    border-bottom: 1px solid var(--border-color);
  }

  .mention-list {
    overflow-y: auto;
    max-height: 250px;
  }

  .mention-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .mention-item:hover,
  .mention-item.is-selected {
    background-color: var(--hover-color);
  }

  .mention-info {
    flex: 1;
    min-width: 0;
  }

  .mention-name {
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mention-username {
    font-size: 12px;
    color: var(--text-color-secondary);
  }

  .mention-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 24px;
    color: var(--text-color-secondary);
    font-size: 14px;
  }
</style>