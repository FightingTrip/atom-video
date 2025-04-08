# 组件开发指南

## 组件分类

### 1. 数据展示组件

#### StatCard 统计卡片
用于展示单个统计指标。
```tsx
interface StatCardProps {
  title: string;          // 卡片标题
  value: number;          // 统计值
  unit?: string;          // 单位
  trend?: number;         // 趋势变化
  icon?: React.ReactNode; // 图标
}
```

#### LineChart 折线图
用于展示趋势数据。
```tsx
interface LineChartProps {
  data: DataPoint[];      // 数据点
  xField: string;         // X轴字段
  yField: string;         // Y轴字段
  color?: string;         // 线条颜色
  showArea?: boolean;     // 是否显示面积
}
```

#### TreeMap 树形图
用于展示层级数据。
```tsx
interface TreeMapProps {
  data: TreeNode[];      // 树形数据
  valueField: string;    // 值字段
  colorField?: string;   // 颜色字段
  maxDepth?: number;     // 最大深度
}
```

### 2. 数据输入组件

#### SearchInput 搜索输入框
```tsx
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceTime?: number;
}
```

#### DateRangePicker 日期范围选择器
```tsx
interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onChange: (dates: [Date, Date]) => void;
  maxRange?: number;     // 最大选择范围（天）
}
```

### 3. 布局组件

#### Panel 面板
```tsx
interface PanelProps {
  title: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  extra?: React.ReactNode;
}
```

#### Grid 网格布局
```tsx
interface GridProps {
  columns: number;       // 列数
  gap: number;          // 间距
  responsive?: boolean; // 是否响应式
}
```

## 组件开发规范

### 1. 基础规则
- 组件必须是纯函数或使用 hooks
- 属性必须有 TypeScript 类型定义
- 必须处理加载和错误状态
- 支持主题定制

### 2. 性能考虑
```tsx
// 使用 memo 优化渲染性能
export const StatCard = memo<StatCardProps>(({
  title,
  value,
  unit,
  trend,
  icon
}) => {
  // 组件实现
});

// 使用 useCallback 优化事件处理
const handleChange = useCallback((value: string) => {
  // 处理逻辑
}, []);
```

### 3. 可访问性
```tsx
// 添加 ARIA 属性
const SearchInput = ({
  value,
  onChange,
  placeholder,
  "aria-label": ariaLabel
}: SearchInputProps) => (
  <input
    type="search"
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    aria-label={ariaLabel || "搜索"}
  />
);
```

## 组件文档规范

### 1. 文档结构
```markdown
# 组件名称

## 介绍
简要描述组件的用途和功能。

## 示例
提供基础用法和高级用法的示例。

## API
详细说明组件的属性、事件和方法。

## 最佳实践
提供使用建议和注意事项。
```

### 2. 示例代码
```tsx
// 基础用法
const Basic = () => (
  <StatCard
    title="代码行数"
    value={1234}
    unit="行"
    trend={5.2}
  />
);

// 自定义样式
const Custom = () => (
  <StatCard
    title="代码行数"
    value={1234}
    unit="行"
    className="custom-card"
    style={{ width: 300 }}
  />
);
```

## 组件测试规范

### 1. 单元测试
```tsx
describe('StatCard', () => {
  it('should render correctly', () => {
    const { getByText } = render(
      <StatCard
        title="测试"
        value={100}
        unit="行"
      />
    );
    
    expect(getByText('测试')).toBeInTheDocument();
    expect(getByText('100')).toBeInTheDocument();
    expect(getByText('行')).toBeInTheDocument();
  });
  
  it('should show trend', () => {
    const { getByText } = render(
      <StatCard
        title="测试"
        value={100}
        trend={5.2}
      />
    );
    
    expect(getByText('+5.2%')).toBeInTheDocument();
  });
});
```

### 2. 交互测试
```tsx
describe('SearchInput', () => {
  it('should handle user input', async () => {
    const handleChange = vi.fn();
    const { getByRole } = render(
      <SearchInput
        value=""
        onChange={handleChange}
      />
    );
    
    const input = getByRole('searchbox');
    await userEvent.type(input, 'test');
    
    expect(handleChange).toHaveBeenCalledWith('test');
  });
});
```

## 主题定制

### 1. 颜色系统
```tsx
const theme = {
  colors: {
    primary: {
      50: '#e3f2fd',
      100: '#bbdefb',
      500: '#2196f3',
      700: '#1976d2',
      900: '#0d47a1',
    },
    // 其他颜色...
  }
};
```

### 2. 组件变体
```tsx
interface CardVariant {
  default: string;
  outline: string;
  filled: string;
}

const cardVariants: CardVariant = {
  default: 'bg-white shadow-sm',
  outline: 'border border-gray-200',
  filled: 'bg-gray-50',
};
```

## 组件状态管理

### 1. 内部状态
```tsx
const [isExpanded, setIsExpanded] = useState(false);
const [activeTab, setActiveTab] = useState(0);
```

### 2. 全局状态
```tsx
const useTheme = create<ThemeStore>((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
}));
```

## 组件通信模式

### 1. Props 传递
```tsx
interface ParentProps {
  data: DataType;
  onAction: (id: string) => void;
}
```

### 2. Context 共享
```tsx
const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
});
```

## 组件生命周期管理

### 1. 加载状态
```tsx
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);
```

### 2. 清理操作
```tsx
useEffect(() => {
  const timer = setInterval(() => {
    // 定时操作
  }, 1000);
  
  return () => clearInterval(timer);
}, []);
```