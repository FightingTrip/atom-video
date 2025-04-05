# Sidebar 侧边栏

侧边栏导航组件，支持多级菜单、折叠展开、主题切换等功能。

## 功能特性

- 支持多级菜单
- 支持折叠展开
- 支持自定义图标
- 支持路由联动
- 支持深色模式
- 支持自定义宽度
- 支持键盘导航

## API

### Sidebar Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| items | 菜单项配置 | MenuItem[] | [] |
| collapsed | 是否折叠 | boolean | false |
| width | 展开宽度 | number | 256 |
| collapsedWidth | 折叠宽度 | number | 80 |
| theme | 主题 | 'light' \| 'dark' | 'light' |
| selectedKeys | 选中项 | string[] | [] |
| openKeys | 展开项 | string[] | [] |
| onSelect | 选择回调 | (key: string) => void | - |
| onCollapse | 折叠回调 | (collapsed: boolean) => void | - |

### MenuItem 类型

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| key | 唯一标识 | string | - |
| icon | 图标 | ReactNode | - |
| label | 标题 | ReactNode | - |
| children | 子菜单 | MenuItem[] | - |
| disabled | 是否禁用 | boolean | false |

## 代码示例

### 基础用法
```tsx
const items = [
  {
    key: 'dashboard',
    icon: <DashboardIcon />,
    label: '仪表盘'
  },
  {
    key: 'analysis',
    icon: <AnalysisIcon />,
    label: '数据分析',
    children: [
      {
        key: 'realtime',
        label: '实时分析'
      },
      {
        key: 'offline',
        label: '离线分析'
      }
    ]
  }
];

<Sidebar
  items={items}
  selectedKeys={['dashboard']}
  onSelect={handleSelect}
/>
```

### 折叠模式
```tsx
<Sidebar
  collapsed={collapsed}
  onCollapse={setCollapsed}
  collapsedWidth={60}
/>
```

### 自定义主题
```tsx
<Sidebar
  theme="dark"
  className="custom-sidebar"
  style={{ background: '#001529' }}
/>
```

## 布局适配

### 响应式布局
```tsx
<Sidebar
  breakpoint="lg"
  collapsible
  onBreakpoint={setCollapsed}
/>
```

### 固定布局
```tsx
<Sidebar
  style={{ height: '100vh', position: 'fixed' }}
  className="shadow-lg"
/>
```

## 实现细节

### TypeScript 定义
```typescript
interface MenuItem {
  key: string;
  icon?: React.ReactNode;
  label: React.ReactNode;
  children?: MenuItem[];
  disabled?: boolean;
}

interface SidebarProps {
  items: MenuItem[];
  collapsed?: boolean;
  width?: number;
  collapsedWidth?: number;
  theme?: 'light' | 'dark';
  selectedKeys?: string[];
  openKeys?: string[];
  onSelect?: (key: string) => void;
  onCollapse?: (collapsed: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
}
```

### 组件实现
```typescript
export const Sidebar: React.FC<SidebarProps> = memo(({
  items,
  collapsed = false,
  width = 256,
  collapsedWidth = 80,
  theme = 'light',
  selectedKeys = [],
  openKeys = [],
  onSelect,
  onCollapse,
  className,
  style,
}) => {
  const [internalOpenKeys, setInternalOpenKeys] = useState(openKeys);

  const handleSelect = useCallback((key: string) => {
    onSelect?.(key);
  }, [onSelect]);

  return (
    <aside
      className={clsx(
        'sidebar',
        collapsed && 'collapsed',
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white',
        className
      )}
      style={{
        width: collapsed ? collapsedWidth : width,
        ...style
      }}
    >
      {/* 实现细节 */}
    </aside>
  );
});
```

## 递归菜单

### 菜单项渲染
```tsx
const MenuItem = memo(({
  item,
  collapsed,
  level = 0
}: {
  item: MenuItem;
  collapsed: boolean;
  level?: number;
}) => {
  if (item.children) {
    return (
      <SubMenu
        key={item.key}
        icon={item.icon}
        title={item.label}
      >
        {item.children.map(child => (
          <MenuItem
            key={child.key}
            item={child}
            collapsed={collapsed}
            level={level + 1}
          />
        ))}
      </SubMenu>
    );
  }

  return (
    <Menu.Item
      key={item.key}
      icon={item.icon}
      disabled={item.disabled}
    >
      {item.label}
    </Menu.Item>
  );
});
```

## 工具函数

### 菜单展开逻辑
```typescript
const getDefaultOpenKeys = (
  items: MenuItem[],
  selectedKey?: string
): string[] => {
  const keys: string[] = [];
  
  const find = (items: MenuItem[], parent?: string) => {
    for (const item of items) {
      if (item.key === selectedKey) {
        if (parent) keys.push(parent);
        return true;
      }
      if (item.children && find(item.children, item.key)) {
        if (parent) keys.push(parent);
        return true;
      }
    }
    return false;
  };

  find(items);
  return keys;
};
```

## 最佳实践

### 1. 性能优化
```tsx
// 缓存菜单项渲染
const renderMenuItems = useMemo(() => 
  items.map(item => (
    <MenuItem
      key={item.key}
      item={item}
      collapsed={collapsed}
    />
  ))
, [items, collapsed]);
```

### 2. 交互优化
```tsx
// 添加展开收起动画
const menuStyles = {
  transition: 'width 0.2s ease-in-out',
  overflow: 'hidden',
};
```

### 3. 路由集成
```tsx
// 与 React Router 集成
const location = useLocation();
const navigate = useNavigate();

const handleSelect = useCallback((key: string) => {
  navigate(key);
}, [navigate]);
```

## 注意事项

1. 性能考虑
- 使用 memo 优化
- 避免不必要渲染
- 控制菜单层级

2. 交互优化
- 展开动画流畅
- 悬浮提示
- 键盘可访问

3. 主题适配
- 配色统一
- 暗色模式
- 自定义样式

4. 可访问性
- ARIA 标签
- 键盘导航
- 焦点管理