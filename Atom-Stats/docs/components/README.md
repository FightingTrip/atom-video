# Atom-Stats 组件库

## 数据展示组件

### StatCard 统计卡片
用于展示关键指标数据。
```tsx
<StatCard
  title="代码行数"
  value={1234}
  trend={5.2}
  status="success"
/>
```

### LineChart 折线图
展示趋势数据。
```tsx
<LineChart
  data={data}
  xField="date"
  yField="value"
  showArea={true}
/>
```

### TreeMap 树形图
展示层级和占比数据。
```tsx
<TreeMap
  data={languageData}
  valueField="lines"
  colorField="type"
/>
```

## 导航组件

### Sidebar 侧边栏
```tsx
<Sidebar>
  <SidebarItem
    icon={<CodeIcon />}
    label="代码分析"
    to="/analysis"
  />
</Sidebar>
```

### Tabs 标签页
```tsx
<Tabs>
  <TabPane label="概览" key="overview">
    {/* 概览内容 */}
  </TabPane>
  <TabPane label="详情" key="details">
    {/* 详情内容 */}
  </TabPane>
</Tabs>
```

## 表单组件

### SearchInput 搜索输入框
```tsx
<SearchInput
  placeholder="搜索文件..."
  onSearch={handleSearch}
  loading={false}
/>
```

### Select 选择器
```tsx
<Select
  options={[
    { label: '全部', value: 'all' },
    { label: '未分析', value: 'pending' },
    { label: '已分析', value: 'analyzed' },
  ]}
  value={status}
  onChange={handleStatusChange}
/>
```

## 布局组件

### Grid 网格布局
```tsx
<Grid columns={3} gap={4}>
  <StatCard />
  <StatCard />
  <StatCard />
</Grid>
```

### Page 页面容器
```tsx
<Page
  title="代码分析"
  breadcrumb={['项目', '代码分析']}
>
  {/* 页面内容 */}
</Page>
```

## 反馈组件

### Alert 警告提示
```tsx
<Alert
  type="warning"
  message="发现潜在的代码质量问题"
  description="检测到3个复杂度过高的函数"
/>
```

### Progress 进度条
```tsx
<Progress
  percent={75}
  status="active"
  showInfo={true}
/>
```

## 主题定制

组件支持通过 TailwindCSS 主题配置进行样式定制：

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: { /* 主题色 */ },
        success: { /* 成功色 */ },
        warning: { /* 警告色 */ },
        error: { /* 错误色 */ },
      },
      // ...其他配置
    }
  }
}
```

## 最佳实践

1. 组件封装
```tsx
// 推荐：将复杂的组件组合封装
const AnalysisCard = ({ data, loading }) => (
  <Card loading={loading}>
    <StatCard
      title={data.title}
      value={data.value}
      trend={data.trend}
    />
    <LineChart data={data.trend} />
  </Card>
);
```

2. 错误处理
```tsx
// 推荐：添加错误边界处理
<ErrorBoundary fallback={<ErrorAlert />}>
  <ComplexChart data={data} />
</ErrorBoundary>
```

3. 性能优化
```tsx
// 推荐：使用 memo 优化渲染性能
const MemoizedChart = memo(Chart, (prev, next) => {
  return prev.data === next.data;
});
```

## 待开发组件

1. DiffViewer 代码对比查看器
- 支持行级对比
- 支持语法高亮
- 支持折叠/展开

2. CodeCoverage 代码覆盖率展示
- 文件级覆盖率
- 函数级覆盖率
- 趋势图表

3. NetworkGraph 依赖关系图
- 模块依赖展示
- 交互式缩放
- 节点筛选