# TreeMap 树形图

树形图组件用于展示层级数据的占比关系，特别适合展示代码库的语言分布、文件大小分布等数据。

## 功能特性

- 支持多层级数据
- 支持自定义颜色
- 支持缩放和钻取
- 支持数据筛选
- 支持交互操作
- 支持动画效果
- 深色模式适配

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| data | 树形数据 | TreeNode[] | [] |
| valueField | 值字段 | string | - |
| colorField | 颜色字段 | string | - |
| nameField | 名称字段 | string | 'name' |
| maxDepth | 最大深度 | number | 2 |
| colors | 颜色配置 | string[] | theme.colors |
| interactive | 是否可交互 | boolean | true |
| drillDown | 是否支持钻取 | boolean | false |
| loading | 加载状态 | boolean | false |
| onClick | 点击回调 | (node: TreeNode) => void | - |
| onDrillDown | 钻取回调 | (node: TreeNode) => void | - |

## 代码示例

### 基础用法
```tsx
<TreeMap
  data={[
    {
      name: 'src',
      value: 1000,
      children: [
        { name: 'components', value: 400 },
        { name: 'utils', value: 300 },
        { name: 'pages', value: 300 },
      ],
    },
  ]}
  valueField="value"
  nameField="name"
/>
```

### 语言分布展示
```tsx
<TreeMap
  data={[
    {
      name: 'JavaScript',
      value: 50000,
      type: 'js',
    },
    {
      name: 'TypeScript',
      value: 30000,
      type: 'ts',
    },
    {
      name: 'CSS',
      value: 10000,
      type: 'css',
    },
  ]}
  valueField="value"
  colorField="type"
  colors={['#f1e05a', '#2b7489', '#563d7c']}
/>
```

### 支持钻取
```tsx
<TreeMap
  data={fileSystemData}
  valueField="size"
  nameField="path"
  drillDown={true}
  maxDepth={3}
  onDrillDown={(node) => {
    console.log('Drill down to:', node.path);
  }}
/>
```

## 交互功能

### 节点点击
```tsx
<TreeMap
  data={data}
  valueField="value"
  onClick={(node) => {
    setSelectedNode(node);
  }}
/>
```

### 过滤器
```tsx
<TreeMap
  data={data}
  valueField="value"
  colorField="type"
  filters={[
    {
      field: 'value',
      operator: '>',
      value: 1000,
    },
  ]}
/>
```

## 自定义样式

### 节点样式
```tsx
<TreeMap
  data={data}
  valueField="value"
  nodeStyle={{
    border: '1px solid #fff',
    borderRadius: 4,
    transition: 'all 0.3s',
  }}
  hoverStyle={{
    border: '1px solid #1890ff',
    transform: 'scale(1.02)',
  }}
/>
```

### 标签样式
```tsx
<TreeMap
  data={data}
  valueField="value"
  label={{
    formatter: (node) => `${node.name}\n${formatSize(node.value)}`,
    style: {
      fontSize: 12,
      fill: '#fff',
      textShadow: '0 1px 2px rgba(0,0,0,0.4)',
    },
  }}
/>
```

## 实现细节

### TypeScript 定义
```typescript
interface TreeNode {
  name: string;
  value: number;
  type?: string;
  children?: TreeNode[];
  [key: string]: any;
}

interface Filter {
  field: string;
  operator: '>' | '<' | '=' | '!=';
  value: number | string;
}

interface TreeMapProps {
  data: TreeNode[];
  valueField: string;
  colorField?: string;
  nameField?: string;
  maxDepth?: number;
  colors?: string[];
  interactive?: boolean;
  drillDown?: boolean;
  loading?: boolean;
  filters?: Filter[];
  nodeStyle?: React.CSSProperties;
  hoverStyle?: React.CSSProperties;
  label?: {
    formatter?: (node: TreeNode) => string;
    style?: React.CSSProperties;
  };
  onClick?: (node: TreeNode) => void;
  onDrillDown?: (node: TreeNode) => void;
}
```

### 组件实现
```typescript
export const TreeMap: React.FC<TreeMapProps> = memo(({
  data,
  valueField,
  colorField,
  nameField = 'name',
  maxDepth = 2,
  colors,
  interactive = true,
  drillDown = false,
  loading = false,
  filters,
  nodeStyle,
  hoverStyle,
  label,
  onClick,
  onDrillDown,
}) => {
  const [currentNode, setCurrentNode] = useState<TreeNode | null>(null);
  
  const processedData = useMemo(() => {
    return processTreeData(data, {
      valueField,
      colorField,
      nameField,
      maxDepth,
      filters,
    });
  }, [data, valueField, colorField, nameField, maxDepth, filters]);

  return (
    <div className="relative">
      {/* 实现细节 */}
    </div>
  );
});
```

## 数据处理

### 数据转换
```typescript
function processTreeData(
  data: TreeNode[],
  options: ProcessOptions
): ProcessedNode[] {
  return data.map(node => ({
    ...node,
    key: generateKey(node),
    color: getNodeColor(node, options),
    children: node.children 
      ? processTreeData(node.children, options)
      : undefined,
  }));
}
```

### 数据过滤
```typescript
function filterTreeData(
  data: TreeNode[],
  filters: Filter[]
): TreeNode[] {
  return data.filter(node => {
    return filters.every(filter => {
      const value = node[filter.field];
      switch (filter.operator) {
        case '>': return value > filter.value;
        case '<': return value < filter.value;
        case '=': return value === filter.value;
        case '!=': return value !== filter.value;
        default: return true;
      }
    });
  });
}
```

## 最佳实践

### 1. 数据预处理
```tsx
// 按值排序
const sortedData = useMemo(() => {
  return [...data].sort((a, b) => b.value - a.value);
}, [data]);
```

### 2. 性能优化
```tsx
// 缓存计算结果
const memoizedLayout = useMemo(() => {
  return calculateLayout(processedData, {
    width,
    height,
    padding,
  });
}, [processedData, width, height, padding]);
```

### 3. 交互处理
```tsx
// 处理节点点击
const handleNodeClick = useCallback((node: TreeNode) => {
  if (drillDown && node.children) {
    onDrillDown?.(node);
  } else {
    onClick?.(node);
  }
}, [drillDown, onClick, onDrillDown]);
```

## 注意事项

1. 数据结构
- 确保数据层级合理
- 处理异常数据
- 避免过深的嵌套

2. 性能优化
- 控制节点数量
- 使用虚拟化渲染
- 优化动画效果

3. 交互体验
- 提供清晰的提示
- 支持返回上级
- 动画过渡流畅

4. 可访问性
- 支持键盘操作
- 提供节点描述
- 考虑色盲友好