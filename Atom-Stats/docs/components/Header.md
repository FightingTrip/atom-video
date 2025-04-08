# Header 头部导航

头部导航组件用于应用顶部的导航栏，支持搜索、通知、用户信息等功能。

## 功能特性

- 支持品牌展示
- 支持搜索功能
- 支持通知提醒
- 支持用户菜单
- 支持深色模式
- 支持响应式布局
- 支持自定义操作

## API

### Header Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| logo | 品牌图标 | ReactNode | - |
| title | 标题 | string | - |
| onSearch | 搜索回调 | (value: string) => void | - |
| notifications | 通知列表 | Notification[] | [] |
| user | 用户信息 | UserInfo | - |
| actions | 自定义操作 | ReactNode[] | [] |
| theme | 主题 | 'light' \| 'dark' | 'light' |
| fixed | 是否固定 | boolean | true |

### UserInfo 类型

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| name | 用户名 | string | - |
| avatar | 头像 | string | - |
| email | 邮箱 | string | - |
| role | 角色 | string | - |

## 代码示例

### 基础用法
```tsx
<Header
  logo={<Logo />}
  title="Atom Stats"
  onSearch={handleSearch}
  user={{
    name: "John Doe",
    avatar: "/avatar.png",
    email: "john@example.com",
    role: "管理员"
  }}
/>
```

### 带通知
```tsx
<Header
  notifications={[
    {
      id: "1",
      title: "代码审查请求",
      content: "有新的PR需要审查",
      time: "5分钟前",
      type: "review"
    }
  ]}
  onNotificationClick={handleNotificationClick}
/>
```

### 自定义操作
```tsx
<Header
  actions={[
    <Button key="upload" icon={<UploadIcon />}>
      上传
    </Button>,
    <Button key="settings" icon={<SettingsIcon />}>
      设置
    </Button>
  ]}
/>
```

## 布局适配

### 响应式布局
```tsx
<Header
  className="responsive-header"
  menuBreakpoint="md"
  collapsedWidth={0}
/>
```

### 固定顶部
```tsx
<Header
  fixed
  className="shadow-md"
  style={{ zIndex: 1000 }}
/>
```

## 实现细节

### TypeScript 定义
```typescript
interface Notification {
  id: string;
  title: string;
  content: string;
  time: string;
  type: string;
  read?: boolean;
}

interface UserInfo {
  name: string;
  avatar: string;
  email: string;
  role: string;
}

interface HeaderProps {
  logo?: React.ReactNode;
  title?: string;
  onSearch?: (value: string) => void;
  notifications?: Notification[];
  user?: UserInfo;
  actions?: React.ReactNode[];
  theme?: 'light' | 'dark';
  fixed?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
```

### 组件实现
```typescript
export const Header: React.FC<HeaderProps> = memo(({
  logo,
  title,
  onSearch,
  notifications = [],
  user,
  actions = [],
  theme = 'light',
  fixed = true,
  className,
  style,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const handleSearchSubmit = useCallback(() => {
    onSearch?.(searchValue);
  }, [searchValue, onSearch]);

  return (
    <header
      className={clsx(
        'header',
        fixed && 'fixed top-0 left-0 right-0',
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white',
        className
      )}
      style={style}
    >
      {/* 实现细节 */}
    </header>
  );
});
```

## 搜索功能

### 搜索框实现
```tsx
const SearchBox = memo(({ onSearch }) => {
  const [value, setValue] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(value);
  };

  return (
    <form 
      className="search-form"
      onSubmit={handleSubmit}
    >
      <input
        ref={searchRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="搜索..."
        className="search-input"
      />
      <button type="submit" className="search-button">
        <SearchIcon />
      </button>
    </form>
  );
});
```

## 通知功能

### 通知弹窗
```tsx
const NotificationsPopover = memo(({
  notifications,
  onNotificationClick
}) => {
  return (
    <div className="notifications-popover">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={clsx(
            'notification-item',
            !notification.read && 'unread'
          )}
          onClick={() => onNotificationClick?.(notification)}
        >
          <div className="notification-title">
            {notification.title}
          </div>
          <div className="notification-content">
            {notification.content}
          </div>
          <div className="notification-time">
            {notification.time}
          </div>
        </div>
      ))}
    </div>
  );
});
```

## 最佳实践

### 1. 状态管理
```tsx
// 使用 Context 管理用户状态
const UserContext = createContext<{
  user: UserInfo | null;
  logout: () => void;
}>({
  user: null,
  logout: () => {},
});

// 在子组件中使用
const { user, logout } = useContext(UserContext);
```

### 2. 性能优化
```tsx
// 使用 memo 优化渲染
const UserMenu = memo(({ user }) => {
  const menu = useMemo(() => [
    { key: 'profile', label: '个人信息' },
    { key: 'settings', label: '设置' },
    { key: 'logout', label: '退出' },
  ], []);

  return (/* 实现细节 */);
});
```

### 3. 响应式处理
```tsx
const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 768
  );

  useEffect(() => {
    const handler = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('resize', handler);
    };
  }, []);

  return isMobile;
};
```

## 注意事项

1. 主题适配
- 支持明暗主题
- 颜色对比度
- 主题切换动画

2. 性能优化
- 避免不必要渲染
- 优化搜索性能
- 控制通知数量

3. 交互体验
- 及时响应
- 状态反馈
- 动画流畅

4. 可访问性
- 键盘导航
- 屏幕阅读
- 焦点管理