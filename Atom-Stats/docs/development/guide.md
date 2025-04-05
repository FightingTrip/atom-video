# 开发指南

## 开发环境配置

### 1. 必要环境
- Node.js >= 18
- pnpm >= 8
- Git >= 2.34
- VS Code（推荐）

### 2. 推荐插件
- ESLint
- Prettier
- TailwindCSS IntelliSense
- TypeScript Vue Plugin
- GitLens
- Error Lens

### 3. 环境配置
```bash
# 安装项目依赖
pnpm install

# 配置 Git 提交钩子
pnpm prepare
```

## 开发流程

### 1. 分支管理

- `main`: 主分支，用于发布
- `develop`: 开发分支，用于集成功能
- `feature/*`: 功能分支，用于开发新功能
- `fix/*`: 修复分支，用于修复 bug
- `docs/*`: 文档分支，用于更新文档

### 2. 开发步骤

1. 从最新的 develop 分支创建功能分支
```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature
```

2. 开发功能
```bash
# 启动开发服务器
pnpm dev

# 代码检查
pnpm lint

# 运行测试
pnpm test
```

3. 提交代码
```bash
# 提交更改
git add .
git commit -m "feat(scope): description"

# 推送到远程
git push origin feature/your-feature
```

4. 创建 Pull Request
- 填写 PR 描述
- 请求代码审查
- 处理反馈意见
- 等待合并

### 3. 代码规范

#### TypeScript
```typescript
// 使用接口定义数据结构
interface UserStats {
  commits: number;
  additions: number;
  deletions: number;
}

// 使用类型别名定义联合类型
type Status = 'idle' | 'loading' | 'success' | 'error';

// 使用枚举定义常量
enum ErrorCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
}
```

#### React 组件
```tsx
// 使用函数组件和 TypeScript
interface Props {
  data: DataType;
  onAction: (id: string) => void;
}

const Component: React.FC<Props> = ({ data, onAction }) => {
  // 使用 hooks
  const [state, setState] = useState<State>({});
  
  // 使用 memo 优化性能
  const memoizedValue = useMemo(() => {
    // 计算逻辑
  }, [dependencies]);
  
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

#### 样式规范
```tsx
// 使用 TailwindCSS
const Card = () => (
  <div className="
    p-4 
    rounded-lg 
    shadow-md 
    bg-white 
    dark:bg-gray-800
    hover:shadow-lg 
    transition-shadow
  ">
    {/* 内容 */}
  </div>
);
```

### 4. 测试规范

#### 单元测试
```typescript
describe('Component', () => {
  it('should render correctly', () => {
    const { getByText } = render(<Component />);
    expect(getByText('Title')).toBeInTheDocument();
  });
  
  it('should handle events', async () => {
    const handleClick = vi.fn();
    const { getByRole } = render(
      <Component onClick={handleClick} />
    );
    
    await userEvent.click(getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

#### 集成测试
```typescript
describe('API Integration', () => {
  it('should fetch data', async () => {
    const response = await api.getData();
    expect(response.status).toBe(200);
    expect(response.data).toMatchObject({
      // 预期的数据结构
    });
  });
});
```

### 5. 文档规范

#### 组件文档
```markdown
# 组件名称

## 简介
简要描述组件的用途

## 使用方法
提供基本的使用示例

## Props
详细说明组件的属性

## 示例
提供多个使用示例
```

#### API 文档
```markdown
# API 名称

## 端点
详细说明 API 端点

## 请求格式
描述请求参数

## 响应格式
描述响应数据结构

## 示例
提供请求和响应示例
```

## 开发技巧

### 1. 调试

#### 使用 React DevTools
- 组件树检查
- props 和 state 追踪
- 性能分析

#### 使用 Chrome DevTools
- 网络请求监控
- 性能分析
- 内存分析

### 2. 性能优化

#### React 优化
- 使用 memo 避免不必要的重渲染
- 使用 useMemo 和 useCallback 缓存值和函数
- 使用 Code Splitting 和 Lazy Loading

#### 构建优化
- 分析和优化打包大小
- 使用 Tree Shaking
- 配置合适的缓存策略

### 3. 错误处理

#### 全局错误边界
```tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

#### API 错误处理
```typescript
const handleAPIError = (error: APIError) => {
  switch (error.code) {
    case ErrorCode.UNAUTHORIZED:
      // 处理未授权错误
      break;
    case ErrorCode.FORBIDDEN:
      // 处理禁止访问错误
      break;
    default:
      // 处理其他错误
      break;
  }
};
```