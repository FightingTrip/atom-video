# StatCard 统计卡片

统计卡片用于展示关键数据指标，支持趋势显示和状态标识。

## 功能特性

- 支持数值展示
- 支持趋势指示
- 支持状态标识
- 支持自定义图标
- 支持加载状态
- 支持点击事件
- 深色模式适配

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| title | 卡片标题 | string | - |
| value | 统计值 | number \| string | - |
| unit | 单位 | string | - |
| trend | 趋势值 | number | - |
| status | 状态 | 'success' \| 'warning' \| 'error' \| 'info' | - |
| icon | 自定义图标 | ReactNode | - |
| loading | 加载状态 | boolean | false |
| onClick | 点击事件 | () => void | - |
| className | 自定义类名 | string | - |
| style | 自定义样式 | CSSProperties | - |
| description | 补充描述文本 | string | - |
| footer | 卡片底部内容 | ReactNode | - |
| tooltipContent | 提示内容 | ReactNode | - |

## 代码示例

### 基础用法
```tsx
import { formatNumber } from '@/utils/format';

<StatCard
  title="代码行数"
  value={formatNumber(12345)}  // 自动格式化为 "12.3K"
  unit="行"
/>
```

### 带趋势
```tsx
<StatCard
  title="提交次数"
  value={42}
  trend={8.5}
  status="success"
/>
```

### 自定义图标
```tsx
<StatCard
  title="代码质量"
  value="A+"
  icon={<QualityIcon />}
  status="success"
/>
```

### 加载状态
```tsx
<StatCard
  title="分析中"
  value={0}
  loading={true}
/>
```

### 错误处理
```tsx
<ErrorBoundary fallback={<ErrorCard />}>
  <StatCard
    title="代码分析"
    value={data?.value ?? '-'}
    loading={isLoading}
    error={error}
  />
</ErrorBoundary>
```

### 组合使用
```tsx
<Grid columns={3} gap={4}>
  <StatCard
    title="总行数"
    value={123456}
    trend={5.2}
    status="success"
  />
  <StatCard
    title="复杂度"
    value="中等"
    status="warning"
  />
  <StatCard
    title="代码质量"
    value="A"
    status="success"
  />
</Grid>
```

## 自定义样式

### 主题定制
```tsx
// 通过 TailwindCSS 配置定制主题
<StatCard
  className="
    bg-gradient-to-r 
    from-blue-500 
    to-blue-600 
    text-white
  "
  title="自定义主题"
  value={12345}
/>
```

### 响应式布局
```tsx
<StatCard
  className="
    w-full
    md:w-1/2
    lg:w-1/3
    xl:w-1/4
  "
  title="响应式布局"
  value={12345}
/>
```

## 最佳实践

### 1. 数值格式化
```tsx
<StatCard
  title="大数值"
  value={formatNumber(1234567)}  // 显示为 "1.23M"
  unit="行"
/>
```

### 2. 趋势展示
```tsx
<StatCard
  title="周环比"
  value={percentage}
  trend={calculateTrend(current, previous)}
  status={getTrendStatus(trend)}
/>
```

### 3. 错误处理
```tsx
<ErrorBoundary fallback={<ErrorCard />}>
  <StatCard
    title="错误处理"
    value={data?.value ?? '-'}
    loading={loading}
    error={error}
  />
</ErrorBoundary>
```

### 综合最佳实践

1. 数值展示
- 大数值使用格式化工具 (例如: formatNumber(1234567) → "1.23M")
- 保持精度一致性 (小数点位数统一)
- 合理选择单位显示 (K, M, G等)

2. 趋势展示
- 使用不同颜色区分正负趋势 (上升-绿色，下降-红色)
- 配合箭头图标增强视觉效果
- 显示环比数据增强对比性

3. 响应式布局
- 适配不同尺寸屏幕
- 在小屏幕上保持数据清晰可读
- 合理使用空间和间距

4. 性能优化
- 使用 React.memo 减少不必要的重渲染
- 避免频繁更新的数据计算
- 使用缓存优化计算密集型操作

5. 错误处理
- 提供默认值和占位符
- 处理数据加载和异常状态
- 保持视觉反馈的一致性

6. 主题适配
- 支持明暗主题切换
- 使用设计变量而非硬编码颜色
- 保持品牌色系的统一性

## 实现细节

### TypeScript 定义
```typescript
interface StatCardProps {
  title: string;
  value: number | string;
  unit?: string;
  trend?: number;
  status?: 'success' | 'warning' | 'error' | 'info';
  icon?: React.ReactNode;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  description?: string;
  footer?: React.ReactNode;
  tooltipContent?: React.ReactNode;
}
```

### 组件实现
```typescript
export const StatCard: React.FC<StatCardProps> = memo(({
  title,
  value,
  unit,
  trend,
  status,
  icon,
  loading,
  onClick,
  className,
  style,
  description,
  footer,
  tooltipContent,
}) => {
  const trendColor = useMemo(() => {
    if (!trend) return undefined;
    return trend > 0 ? 'text-success' : 'text-error';
  }, [trend]);

  return (
    <Card
      className={clsx(
        'p-4 hover:shadow-lg transition-shadow',
        className
      )}
      style={style}
      onClick={onClick}
    >
      {/* 实现细节 */}
    </Card>
  );
});
```

## 注意事项

1. 数值展示
- 大数值使用格式化
- 保持精度一致
- 合理使用单位

2. 趋势展示
- 正负值使用不同颜色
- 添加趋势图标
- 显示环比数据

3. 响应式设计
- 适配不同屏幕
- 保持可读性
- 合理使用空间

4. 性能优化
- 使用 memo 优化
- 避免不必要的计算
- 优化重渲染