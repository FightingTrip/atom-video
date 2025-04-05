# Tabs 标签页

标签页组件用于分类展示内容，支持动态增减标签、自定义样式、路由联动等功能。

## 功能特性

- 支持动态标签
- 支持标签关闭
- 支持路由联动
- 支持自定义样式
- 支持滚动导航
- 支持拖拽排序
- 响应式适配

## API

### Tabs Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| activeKey | 当前激活标签 | string | - |
| items | 标签项配置 | TabItem[] | [] |
| type | 页签样式 | 'line' \| 'card' | 'line' |
| size | 尺寸 | 'small' \| 'medium' \| 'large' | 'medium' |
| closable | 是否可关闭 | boolean | false |
| draggable | 是否可拖拽 | boolean | false |
| onChange | 切换回调 | (key: string) => void | - |
| onClose | 关闭回调 | (key: string) => void | - |

### TabItem 类型

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| key | 唯一标识 | string | - |
| label | 标签标题 | ReactNode | - |
| children | 内容 | ReactNode | - |
| closable | 是否可关闭 | boolean | true |
| disabled | 是否禁用 | boolean | false |

## 代码示例

### 基础用法
```tsx
<Tabs
  activeKey={activeKey}
  onChange={setActiveKey}
  items={[
    {
      key: 'overview',
      label: '概览',
      children: <Overview />,
    },
    {
      key: 'analysis',
      label: '分析',
      children: <Analysis />,
    },
  ]}
/>
```

### 可关闭标签
```tsx
<Tabs
  type="card"
  closable
  items={tabs}
  activeKey={activeKey}
  onChange={setActiveKey}
  onClose={handleClose}
/>
```

### 自定义标签
```tsx
<Tabs
  items={[
    {
      key: 'js',
      label: (
        <span>
          <JSIcon />
          JavaScript
        </span>
      ),
      children: <JSAnalysis />,
    },
    {
      key: 'ts',
      label: (
        <span>
          <TSIcon />
          TypeScript
        </span>
      ),
      children: <TSAnalysis />,
    },
  ]}
/>
```

## 路由集成

### React Router 集成
```tsx
<Tabs
  items={routes.map(route => ({
    key: route.path,
    label: route.name,
    children: route.component,
  }))}
  activeKey={location.pathname}
  onChange={(key) => navigate(key)}
/>
```

## 实现细节

### TypeScript 定义
```typescript
interface TabItem {
  key: string;
  label: React.ReactNode;
  children: React.ReactNode;
  closable?: boolean;
  disabled?: boolean;
}

interface TabsProps {
  activeKey?: string;
  items: TabItem[];
  type?: 'line' | 'card';
  size?: 'small' | 'medium' | 'large';
  closable?: boolean;
  draggable?: boolean;
  onChange?: (key: string) => void;
  onClose?: (key: string) => void;
  className?: string;
  style?: React.CSSProperties;
}
```

### 组件实现
```typescript
export const Tabs: React.FC<TabsProps> = memo(({
  activeKey,
  items,
  type = 'line',
  size = 'medium',
  closable = false,
  draggable = false,
  onChange,
  onClose,
  className,
  style,
}) => {
  const [activeTab, setActiveTab] = useState(activeKey);
  
  const handleTabClick = useCallback((key: string) => {
    setActiveTab(key);
    onChange?.(key);
  }, [onChange]);

  return (
    <div
      className={clsx(
        'tabs',
        `tabs-${type}`,
        `tabs-${size}`,
        className
      )}
      style={style}
    >
      {/* 实现细节 */}
    </div>
  );
});
```

## 动画效果

### 切换动画
```tsx
<div
  className={clsx(
    'tab-content',
    'transition-opacity duration-200',
    isActive ? 'opacity-100' : 'opacity-0'
  )}
>
  {children}
</div>
```

### 滑动指示器
```tsx
<div
  className="tab-ink-bar"
  style={{
    width: activeTabWidth,
    transform: `translateX(${activeTabLeft}px)`,
    transition: 'all 0.3s',
  }}
/>
```

## 最佳实践

### 1. 状态管理
```tsx
// 使用 Context 管理状态
const TabsContext = createContext<{
  activeKey: string;
  onTabClick: (key: string) => void;
}>({
  activeKey: '',
  onTabClick: () => {},
});

// 在子组件中使用
const { activeKey, onTabClick } = useContext(TabsContext);
```

### 2. 性能优化
```tsx
// 懒加载内容
const TabPane = memo(({ active, children }) => {
  if (!active) return null;
  return <div className="tab-pane">{children}</div>;
});
```

### 3. 响应式处理
```tsx
// 自适应宽度
const TabNav = styled.div`
  @media (max-width: 640px) {
    .tab-label {
      padding: 8px 12px;
      font-size: 14px;
    }
  }
`;
```

## 注意事项

1. 内容管理
- 控制标签数量
- 合理规划内容
- 避免过多标签

2. 性能优化
- 懒加载内容
- 优化切换性能
- 控制重渲染

3. 交互体验
- 动画流畅
- 指示明确
- 响应及时

4. 可访问性
- 键盘支持
- 焦点管理
- 语义化结构