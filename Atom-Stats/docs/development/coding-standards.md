# 开发规范

## React 组件开发规范

### 1. 组件文件结构
```tsx
// 1. 导入声明
import React from 'react';
import type { FC } from 'react';
import { useCallback, useState } from 'react';

// 2. 类型定义
interface Props {
  title: string;
  onAction?: () => void;
}

// 3. 组件定义
export const MyComponent: FC<Props> = ({ title, onAction }) => {
  // 3.1 状态/钩子
  const [count, setCount] = useState(0);

  // 3.2 回调函数
  const handleClick = useCallback(() => {
    setCount(prev => prev + 1);
    onAction?.();
  }, [onAction]);

  // 3.3 渲染逻辑
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={handleClick}>
        Count: {count}
      </button>
    </div>
  );
};
```

### 2. 目录结构规范
```
components/
├── common/             # 通用组件
├── features/           # 功能组件
├── layout/            # 布局组件
└── charts/            # 图表组件
    ├── BarChart/
    │   ├── index.tsx
    │   ├── style.css
    │   └── types.ts
    └── LineChart/
        ├── index.tsx
        ├── style.css
        └── types.ts
```

### 3. 命名规范

#### 文件命名
- 组件文件：PascalCase（如 `Button.tsx`）
- 工具函数：camelCase（如 `formatDate.ts`）
- 类型文件：PascalCase（如 `UserTypes.ts`）
- 样式文件：和组件同名（如 `Button.css`）

#### 变量命名
```typescript
// 布尔值使用 is/has/can 前缀
const isLoading = true;
const hasError = false;
const canEdit = true;

// 事件处理函数使用 handle 前缀
const handleClick = () => {};
const handleChange = () => {};
const handleSubmit = () => {};

// 获取数据函数使用 get/fetch 前缀
const getUserData = () => {};
const fetchUserList = () => {};
```

## TypeScript 使用规范

### 1. 类型定义
```typescript
// 使用 interface 定义对象类型
interface User {
  id: number;
  name: string;
  age?: number;
}

// 使用 type 定义联合类型或交叉类型
type Status = 'idle' | 'loading' | 'success' | 'error';
type UserWithRole = User & { role: string };

// 使用 enum 定义常量枚举
enum Theme {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
}
```

### 2. 类型断言
```typescript
// 使用 as 进行类型断言
const element = event.target as HTMLInputElement;

// 使用类型守卫
function isUser(obj: any): obj is User {
  return 'id' in obj && 'name' in obj;
}
```

## 样式开发规范

### 1. Tailwind CSS 使用规则
```tsx
// 优先使用 Tailwind 原子类
const Button = () => (
  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
    Click me
  </button>
);

// 组合使用 clsx 处理条件样式
const Card = ({ isActive }: { isActive: boolean }) => (
  <div
    className={clsx(
      "p-4 rounded-lg",
      isActive ? "bg-blue-100" : "bg-gray-100"
    )}
  >
    Content
  </div>
);
```

### 2. 自定义样式规范
```css
/* 使用 CSS Module 或 Tailwind 插件 */
@layer components {
  .custom-button {
    @apply px-4 py-2 rounded-lg transition-colors;
  }
}
```

## Git 提交规范

### 1. 提交消息格式
```bash
<type>(<scope>): <subject>

[body]

[footer]
```

### 2. 类型说明
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 重构代码
- test: 测试相关
- chore: 构建过程或辅助工具变动

### 3. 分支命名
- feature/*: 新功能分支
- bugfix/*: Bug修复分支
- release/*: 发布分支
- hotfix/*: 紧急修复分支

## 测试规范

### 1. 单元测试
```typescript
// 使用 Vitest 编写测试
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('should increment counter', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

### 2. 集成测试
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';

describe('Counter', () => {
  it('should render and interact correctly', async () => {
    render(<Counter />);
    
    expect(screen.getByText('0')).toBeInTheDocument();
    
    await userEvent.click(screen.getByRole('button'));
    
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
```

## 注释规范

### 1. 组件注释
```typescript
/**
 * 显示用户统计信息的卡片组件
 * @param {object} props - 组件属性
 * @param {string} props.title - 卡片标题
 * @param {number} props.value - 统计数值
 * @param {string} [props.unit] - 可选的单位
 * @returns {JSX.Element} 统计卡片组件
 */
export const StatsCard = ({ title, value, unit }: Props) => {
  // ...
};
```

### 2. 函数注释
```typescript
/**
 * 格式化代码统计数据
 * @param {number} lines - 代码行数
 * @param {string} unit - 显示单位 (K/M)
 * @returns {string} 格式化后的字符串
 */
export function formatLines(lines: number, unit: 'K' | 'M'): string {
  // ...
}
```

## 性能优化规范

### 1. React 性能优化
```typescript
// 使用 useMemo 缓存计算结果
const memoizedValue = useMemo(() => computeExpensive(deps), [deps]);

// 使用 useCallback 缓存函数
const memoizedFn = useCallback(() => {
  // 处理逻辑
}, [deps]);

// 使用 React.memo 优化组件
const MemoizedComponent = React.memo(({ prop }) => {
  return <div>{prop}</div>;
});
```

### 2. 数据加载优化
```typescript
// 使用 React Suspense 和 lazy 加载
const LazyComponent = lazy(() => import('./LazyComponent'));

// 使用 SWR 或 React Query 进行数据请求
const { data, error } = useSWR('/api/stats', fetcher);
```