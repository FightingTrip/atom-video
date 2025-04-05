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
| status | 状态 | 'success' \| 'warning' \| 'error' | - |
| icon | 自定义图标 | ReactNode | - |
| loading | 加载状态 | boolean | false |
| onClick | 点击事件 | () => void | - |
| className | 自定义类名 | string | - |
| style | 自定义样式 | CSSProperties | - |

## 代码示例

### 基础用法
```tsx
<StatCard
  title="代码行数"
  value={12345}
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
  />
</ErrorBoundary>
```

## 实现细节

### TypeScript 定义
```typescript
interface StatCardProps {
  title: string;
  value: number | string;
  unit?: string;
  trend?: number;
  status?: 'success' | 'warning' | 'error';
  icon?: React.ReactNode;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
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