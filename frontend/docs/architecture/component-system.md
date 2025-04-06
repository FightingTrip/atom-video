# 组件系统

本文档详细描述 Atom 前端项目的组件设计系统，包括组件分类、设计原则、组件通信和最佳实践。

## 1. 组件分类

Atom 前端项目采用原子设计（Atomic Design）的思想，将组件分为以下几种类型：

### 1.1 基础组件（Base Components）

基础组件是最小的、不可再分的 UI 元素，通常不包含业务逻辑，只负责 UI 展示。

特点：
- 高度可复用
- 无业务逻辑依赖
- 只通过 props 和 events 与外界通信
- 使用 `Base` 前缀命名

示例：`BaseButton`、`BaseInput`、`BaseCard`、`BaseIcon`

### 1.2 通用业务组件（Common Components）

通用业务组件是在多个业务场景中重复使用的组件，可能包含一定的业务逻辑。

特点：
- 包含特定业务功能，但具有一定通用性
- 可在多个页面或模块中复用
- 可能依赖全局状态或 API

示例：`PageHeader`、`Sidebar`、`Pagination`、`SearchBar`

### 1.3 业务组件（Business Components）

业务组件是针对特定业务场景开发的组件，通常只在特定功能模块中使用。

特点：
- 针对特定业务场景
- 复用性相对较低
- 通常包含业务逻辑
- 可能依赖特定的 API 或状态

示例：`VideoPlayer`、`CommentList`、`UserProfile`

### 1.4 页面组件（Page Components）

页面组件是路由直接对应的组件，通常由多个业务组件和通用组件组合而成。

特点：
- 对应路由定义
- 组织和协调其他组件
- 处理页面级别的状态和逻辑
- 使用 `Page` 后缀命名

示例：`HomePage`、`VideoDetailPage`、`UserSettingsPage`

### 1.5 布局组件（Layout Components）

布局组件提供不同的页面布局结构，用于组织页面的整体结构。

特点：
- 只负责布局，不包含具体内容
- 通过插槽（slots）提供内容占位
- 高度可复用

示例：`DefaultLayout`、`AdminLayout`、`AuthLayout`

## 2. 组件设计原则

### 2.1 单一职责原则

每个组件应该只负责一个功能或逻辑单元，避免过于复杂和臃肿。

- ✅ 好的做法：将复杂组件拆分为多个小组件
- ❌ 不好的做法：一个组件承担多项不相关的功能

### 2.2 可组合性原则

组件应设计为可以灵活组合，通过组合而非继承实现功能扩展。

- ✅ 好的做法：通过 props、slots 和事件实现组件通信和扩展
- ❌ 不好的做法：创建深层次的组件继承关系

### 2.3 封装性原则

组件应该隐藏内部实现细节，只通过明确定义的接口与外界交互。

- ✅ 好的做法：明确定义 props、events 和 slots 接口
- ❌ 不好的做法：组件直接访问和修改外部状态

### 2.4 可重用性原则

设计组件时应考虑复用性，避免过度特化。

- ✅ 好的做法：设计可配置的通用组件
- ❌ 不好的做法：为特定场景硬编码组件行为

### 2.5 可测试性原则

组件应易于测试，尽量避免复杂的外部依赖。

- ✅ 好的做法：依赖注入、明确的数据流
- ❌ 不好的做法：隐式依赖、全局状态耦合

## 3. 组件通信方式

### 3.1 Props Down

父组件通过 props 向子组件传递数据。

```vue
<!-- 父组件 -->
<template>
  <BaseButton :label="buttonLabel" :disabled="isDisabled" />
</template>

<!-- 子组件 BaseButton.vue -->
<script setup lang="ts">
const props = defineProps<{
  label: string
  disabled?: boolean
}>()
</script>
```

### 3.2 Events Up

子组件通过事件向父组件发送消息。

```vue
<!-- 子组件 BaseButton.vue -->
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'click', value: string): void
}>()

const handleClick = () => {
  emit('click', 'button clicked')
}
</script>

<!-- 父组件 -->
<template>
  <BaseButton @click="handleButtonClick" />
</template>

<script setup lang="ts">
const handleButtonClick = (value: string) => {
  console.log(value)
}
</script>
```

### 3.3 Slots

通过插槽实现内容分发和组件扩展。

```vue
<!-- 容器组件 Card.vue -->
<template>
  <div class="card">
    <div class="card-header">
      <slot name="header">默认标题</slot>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<!-- 使用插槽 -->
<template>
  <Card>
    <template #header>
      自定义标题
    </template>
    
    <p>这是主要内容</p>
    
    <template #footer>
      <BaseButton label="确认" />
    </template>
  </Card>
</template>
```

### 3.4 Provide/Inject

跨多层组件传递数据。

```typescript
// 父组件提供数据
import { provide } from 'vue'

const theme = ref('dark')
provide('theme', theme)

// 深层子组件注入数据
import { inject } from 'vue'

const theme = inject('theme', 'light') // 默认值为 'light'
```

### 3.5 Pinia Store

使用 Pinia 管理跨组件共享的状态。

```typescript
// 定义 store
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isLoggedIn: false
  }),
  actions: {
    login() {
      // 登录逻辑
    }
  }
})

// 在组件中使用
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.isLoggedIn)
```

## 4. 组件结构规范

### 4.1 基础组件结构

```
Button/
├── BaseButton.vue       # 主组件文件
├── BaseButton.test.ts   # 测试文件
└── index.ts             # 导出文件
```

### 4.2 组件内部结构

```vue
<script setup lang="ts">
// 1. 导入
import { ref, computed, onMounted } from 'vue'
import type { ButtonType, ButtonSize } from '@/types/button'
import BaseIcon from '@/components/base/Icon/BaseIcon.vue'

// 2. Props 和 Emits 定义
const props = withDefaults(defineProps<{
  label?: string
  type?: ButtonType
  size?: ButtonSize
  icon?: string
  disabled?: boolean
  loading?: boolean
}>(), {
  type: 'primary',
  size: 'medium',
  disabled: false,
  loading: false
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

// 3. 状态和计算属性
const isHovered = ref(false)

const buttonClasses = computed(() => [
  `btn-${props.type}`,
  `btn-${props.size}`,
  { 
    'btn-disabled': props.disabled,
    'btn-loading': props.loading
  }
])

// 4. 方法
const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

// 5. 生命周期钩子
onMounted(() => {
  // 初始化逻辑
})
</script>

<template>
  <button
    :class="buttonClasses"
    @click="handleClick"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <BaseIcon v-if="icon" :name="icon" />
    <span v-if="label">{{ label }}</span>
    <slot></slot>
  </button>
</template>

<style scoped>
.btn-primary {
  background-color: var(--primary-color);
  color: var(--text-on-primary);
}

.btn-medium {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-md);
}

.btn-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-loading {
  position: relative;
  cursor: wait;
}
</style>
```

## 5. 组件 Props 设计

### 5.1 明确的 Props 类型和默认值

```typescript
withDefaults(defineProps<{
  // 必需的 props
  title: string
  
  // 可选的 props 带问号
  subtitle?: string
  
  // 使用联合类型限制可选值
  variant?: 'primary' | 'secondary' | 'tertiary'
  
  // 使用自定义类型
  user?: User
  
  // 布尔类型 props
  disabled?: boolean
  
  // 回调函数类型
  formatter?: (value: string) => string
}>(), {
  // 设置默认值
  subtitle: '',
  variant: 'primary',
  disabled: false
})
```

### 5.2 Props 验证和文档

使用 TypeScript 类型定义和 JSDoc 注释提供 Props 文档。

```typescript
/**
 * 用户信息卡片组件
 */
withDefaults(defineProps<{
  /**
   * 用户对象
   */
  user: User
  
  /**
   * 卡片展示模式
   * @default 'compact'
   */
  mode?: 'compact' | 'detailed'
  
  /**
   * 是否显示用户统计信息
   * @default false
   */
  showStats?: boolean
}>(), {
  mode: 'compact',
  showStats: false
})
```

## 6. 组件样式规范

### 6.1 使用 Scoped CSS

每个组件使用 `scoped` 属性限制样式作用域。

```vue
<style scoped>
.button {
  /* 样式仅影响当前组件 */
}
</style>
```

### 6.2 使用 CSS 变量

使用全局设计系统定义的 CSS 变量，确保样式一致性。

```vue
<style scoped>
.card {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
}
</style>
```

### 6.3 状态相关样式

为不同状态定义明确的样式类。

```vue
<template>
  <button 
    class="button"
    :class="{
      'button--primary': type === 'primary',
      'button--disabled': disabled,
      'button--loading': loading
    }"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
.button {
  /* 基础样式 */
}

.button--primary {
  /* 主要按钮样式 */
}

.button--disabled {
  /* 禁用状态样式 */
}

.button--loading {
  /* 加载状态样式 */
}
</style>
```

## 7. 常见组件模式

### 7.1 容器组件模式

分离数据获取逻辑和展示逻辑。

```vue
<!-- UserContainer.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userService } from '@/services/user/userService'
import UserDisplay from './UserDisplay.vue'

const user = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    user.value = await userService.getCurrentUser()
  } catch (err) {
    error.value = err
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <div v-if="loading">加载中...</div>
    <div v-else-if="error">错误：{{ error.message }}</div>
    <UserDisplay v-else :user="user" />
  </div>
</template>
```

### 7.2 可控组件模式

通过 v-model 实现双向绑定。

```vue
<!-- 表单控件 -->
<script setup lang="ts">
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <input
    :value="modelValue"
    @input="updateValue"
    class="input"
  />
</template>

<!-- 使用组件 -->
<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '@/components/base/Input/BaseInput.vue'

const username = ref('')
</script>

<template>
  <BaseInput v-model="username" />
</template>
```

### 7.3 组合式组件模式

使用组合式 API 封装逻辑，实现逻辑复用。

```typescript
// useSearch.ts
import { ref, computed } from 'vue'

export function useSearch<T>(items: T[], searchKey: keyof T) {
  const searchQuery = ref('')
  
  const filteredItems = computed(() => {
    if (!searchQuery.value) return items
    
    return items.filter(item => {
      const value = String(item[searchKey]).toLowerCase()
      return value.includes(searchQuery.value.toLowerCase())
    })
  })
  
  return {
    searchQuery,
    filteredItems
  }
}

// 在组件中使用
import { useSearch } from '@/composables/useSearch'

const users = [/* 用户数据 */]
const { searchQuery, filteredUsers } = useSearch(users, 'name')
```

## 8. 组件测试策略

### 8.1 单元测试

使用 Vitest 和 Vue Test Utils 进行组件单元测试。

```typescript
// BaseButton.test.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import BaseButton from './BaseButton.vue'

describe('BaseButton', () => {
  it('renders the button with label', () => {
    const wrapper = mount(BaseButton, {
      props: {
        label: 'Click me'
      }
    })
    
    expect(wrapper.text()).toContain('Click me')
  })
  
  it('emits click event when clicked', async () => {
    const wrapper = mount(BaseButton)
    
    await wrapper.trigger('click')
    
    expect(wrapper.emitted('click')).toBeTruthy()
  })
  
  it('does not emit click when disabled', async () => {
    const wrapper = mount(BaseButton, {
      props: {
        disabled: true
      }
    })
    
    await wrapper.trigger('click')
    
    expect(wrapper.emitted('click')).toBeFalsy()
  })
})
```

### 8.2 快照测试

使用快照测试确保 UI 不会意外变更。

```typescript
it('matches snapshot', () => {
  const wrapper = mount(BaseButton, {
    props: {
      label: 'Submit',
      type: 'primary'
    }
  })
  
  expect(wrapper.html()).toMatchSnapshot()
})
```

### 8.3 组件故事书 (Storybook)

使用 Storybook 展示和文档化组件。

```typescript
// BaseButton.stories.ts
import BaseButton from './BaseButton.vue'

export default {
  title: 'Base/Button',
  component: BaseButton,
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary']
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large']
    }
  }
}

export const Primary = {
  args: {
    label: 'Primary Button',
    type: 'primary'
  }
}

export const Secondary = {
  args: {
    label: 'Secondary Button',
    type: 'secondary'
  }
}

export const Disabled = {
  args: {
    label: 'Disabled Button',
    disabled: true
  }
}
```

## 9. 性能优化

### 9.1 按需加载

使用动态导入实现组件按需加载。

```typescript
// 路由配置中使用
const routes = [
  {
    path: '/dashboard',
    component: () => import('@/pages/dashboard/DashboardPage.vue')
  }
]
```

### 9.2 使用 shallowRef

对于大型对象或不需要深度响应性的情况，使用 shallowRef。

```typescript
import { shallowRef } from 'vue'

// 不需要深度响应性的大型对象
const videoData = shallowRef(largeVideoObject)
```

### 9.3 使用 v-once

对于只渲染一次的内容，使用 v-once 指令。

```vue
<template>
  <div v-once>
    <!-- 这部分内容只会渲染一次 -->
    <h1>{{ staticTitle }}</h1>
  </div>
</template>
```

### 9.4 避免不必要的计算

使用计算属性的缓存特性避免重复计算。

```typescript
// 避免在模板中使用复杂表达式
const filteredAndSortedItems = computed(() => {
  return items.value
    .filter(item => item.active)
    .sort((a, b) => a.name.localeCompare(b.name))
})
```

## 10. 最佳实践

### 10.1 明确的组件接口

每个组件应有明确定义的输入（props）、输出（events）和扩展点（slots）。

### 10.2 保持组件轻量

避免过于复杂的组件，适当拆分功能。组件超过 300 行代码时，考虑拆分。

### 10.3 避免深层次 props 传递

如果需要跨多层组件传递数据，考虑使用 provide/inject 或状态管理。

### 10.4 避免直接操作 DOM

优先使用 Vue 的响应式系统和指令，避免直接操作 DOM。必要时使用 `ref` 和生命周期钩子。

### 10.5 组件文档

为复杂组件提供使用文档，包括：
- 组件功能描述
- Props 和 Events 说明
- 使用示例

### 10.6 遵循 Vue 3 的组合式 API 风格

优先使用 `<script setup>` 语法和组合式 API，保持一致的代码风格。

## 11. 总结

Atom 前端项目的组件系统遵循原子设计思想，划分为基础组件、通用业务组件、业务组件、页面组件和布局组件五个层次。组件设计遵循单一职责、可组合性、封装性、可重用性和可测试性原则，通过明确的通信方式和结构规范，确保组件的一致性和可维护性。

通过实施本文档中的组件设计原则和最佳实践，可以构建出一个模块化、可维护和高性能的前端应用。 