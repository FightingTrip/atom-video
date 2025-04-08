/**
 * @file CodeMetricsChart.tsx
 * @description 代码度量图表组件
 * 
 * 该组件用于可视化展示各语言的代码组成情况：
 * 1. 展示每种语言的代码行、注释行和空行的分布
 * 2. 使用堆叠柱状图展示数据
 * 3. 支持前8种主要语言的数据展示
 * 4. 提供详细的交互式数据提示
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ParsedTokeiData, formatNumber } from '../utils/parseTokei';

/**
 * CodeMetricsChart 组件
 * 
 * @param {ParsedTokeiData} tokeiData - 代码度量数据
 * @returns {JSX.Element} - 渲染的柱状图组件
 */
const CodeMetricsChart: React.FC<CodeMetricsChartProps> = ({ tokeiData }) => {
  // 只显示前8种语言
  const TOP_LANGUAGES = 8;
  const languages = tokeiData.languages.slice(0, TOP_LANGUAGES);
  
  const data = languages.map(lang => ({
    name: lang.name,
    Code: lang.code,
    Comments: lang.comments,
    Blanks: lang.blanks,
  }));
  
  // 自定义提示框组件
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white p-3 border rounded shadow text-sm">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatNumber(entry.value)} lines ({(entry.value / payload.reduce((sum: number, item: any) => sum + item.value, 0) * 100).toFixed(1)}%)
            </p>
          ))}
          <p className="font-semibold mt-1">
            Total: {formatNumber(payload.reduce((sum: number, item: any) => sum + item.value, 0))} lines
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={60}
            tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="Code" stackId="a" fill="#3b82f6" />
          <Bar dataKey="Comments" stackId="a" fill="#10b981" />
          <Bar dataKey="Blanks" stackId="a" fill="#d1d5db" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CodeMetricsChart;