# LineChart 折线图

折线图组件用于展示时间序列数据，支持多种自定义配置和交互特性。

## 功能特性

- 支持单/多条数据线
- 支持面积图模式
- 支持自定义颜色
- 支持缩放和平移
- 支持数据点交互
- 支持自适应容器
- 支持动画效果

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| data | 图表数据 | Array<DataPoint> | [] |
| xField | X轴字段名 | string | - |
| yField | Y轴字段名 | string | - |
| seriesField | 系列字段名 | string | - |
| showArea | 显示面积 | boolean | false |
| smooth | 平滑曲线 | boolean | false |
| color | 线条颜色 | string \| string[] | theme.colors.primary |
| loading | 加载状态 | boolean | false |
| height | 图表高度 | number | 300 |
| padding | 内边距 | number \| number[] | [40, 40, 40, 40] |
| tooltip | 提示框配置 | TooltipConfig | - |
| legend | 图例配置 | LegendConfig | - |
| interaction | 交互配置 | InteractionConfig | - |

## 代码示例

### 基础折线图
```tsx
<LineChart
  data={[
    { date: '2024-01', value: 100 },
    { date: '2024-02', value: 120 },
    { date: '2024-03', value: 150 },
  ]}
  xField="date"
  yField="value"
/>
```

### 多系列折线图
```tsx
<LineChart
  data={[
    { date: '2024-01', type: 'js', value: 100 },
    { date: '2024-01', type: 'ts', value: 80 },
    { date: '2024-02', type: 'js', value: 120 },
    { date: '2024-02', type: 'ts', value: 90 },
  ]}
  xField="date"
  yField="value"
  seriesField="type"
/>
```

### 面积图模式
```tsx
<LineChart
  data={data}
  xField="date"
  yField="value"
  showArea={true}
  smooth={true}
/>
```

### 自定义样式
```tsx
<LineChart
  data={data}
  xField="date"
  yField="value"
  color={['#1890ff', '#2fc25b']}
  tooltip={{
    crosshairs: true,
    shared: true,
  }}
  legend={{
    position: 'top',
  }}
/>
```

## 响应式设计

### 自适应容器
```tsx
<div className="w-full h-[400px]">
  <LineChart
    data={data}
    xField="date"
    yField="value"
  />
</div>
```

### 自定义断点
```tsx
<LineChart
  data={data}
  xField="date"
  yField="value"
  height={isMobile ? 200 : 400}
  padding={isMobile ? [20, 20, 20, 20] : [40, 40, 40, 40]}
/>
```

## 交互特性

### 数据点悬浮
```tsx
<LineChart
  data={data}
  xField="date"
  yField="value"
  tooltip={{
    formatter: (datum) => ({
      name: datum.type,
      value: `${datum.value}行`,
    }),
  }}
/>
```

### 缩放和平移
```tsx
<LineChart
  data={data}
  xField="date"
  yField="value"
  interaction={{
    zoom: true,
    pan: true,
  }}
/>
```

## 实现细节

### TypeScript 定义
```typescript
interface DataPoint {
  [key: string]: any;
}

interface TooltipConfig {
  crosshairs?: boolean;
  shared?: boolean;
  formatter?: (datum: DataPoint) => {
    name: string;
    value: string | number;
  };
}

interface LegendConfig {
  position?: 'top' | 'bottom' | 'left' | 'right';
  layout?: 'horizontal' | 'vertical';
}

interface InteractionConfig {
  zoom?: boolean;
  pan?: boolean;
}

interface LineChartProps {
  data: DataPoint[];
  xField: string;
  yField: string;
  seriesField?: string;
  showArea?: boolean;
  smooth?: boolean;
  color?: string | string[];
  loading?: boolean;
  height?: number;
  padding?: number | number[];
  tooltip?: TooltipConfig;
  legend?: LegendConfig;
  interaction?: InteractionConfig;
}
```

### 组件实现
```typescript
export const LineChart: React.FC<LineChartProps> = memo(({
  data,
  xField,
  yField,
  seriesField,
  showArea = false,
  smooth = false,
  color,
  loading = false,
  height = 300,
  padding = [40, 40, 40, 40],
  tooltip,
  legend,
  interaction,
}) => {
  const chartRef = useRef<Chart>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update({
        data,
        scale: {
          [xField]: { nice: true },
          [yField]: { nice: true },
        },
      });
    }
  }, [data, xField, yField]);

  return (
    <div style={{ height }}>
      {/* 图表实现 */}
    </div>
  );
});
```

## 最佳实践

### 1. 数据预处理
```tsx
const processedData = useMemo(() => {
  return data.map(item => ({
    ...item,
    value: Number(item.value),
    date: dayjs(item.date).format('YYYY-MM-DD'),
  }));
}, [data]);
```

### 2. 自定义配置
```tsx
const config = {
  xField,
  yField,
  seriesField,
  smooth,
  theme: isDarkMode ? 'dark' : 'light',
  color: generateColorPalette(color),
  animation: {
    appear: {
      animation: 'wave-in',
      duration: 1000,
    },
  },
};
```

### 3. 性能优化
```tsx
// 使用防抖处理窗口调整
const handleResize = useCallback(
  debounce(() => {
    if (chartRef.current) {
      chartRef.current.forceFit();
    }
  }, 200),
  []
);
```

## 注意事项

1. 数据处理
- 确保数据格式正确
- 处理空值和异常值
- 合理使用数据转换

2. 性能考虑
- 控制数据量
- 优化重渲染
- 使用适当的防抖/节流

3. 交互优化
- 提供清晰的提示
- 保持响应及时
- 支持触摸设备

4. 可访问性
- 提供替代文本
- 支持键盘导航
- 考虑色盲用户