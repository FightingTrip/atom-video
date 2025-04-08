/**
 * @file FilesCountChart.tsx
 * @description 文件数量统计图表组件
 * 
 * 该组件用于可视化展示项目中各语言的文件数量分布：
 * 1. 展示前15种语言的文件数量统计
 * 2. 使用水平条形图展示数据
 * 3. 提供百分比和具体数量的交互式提示
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ParsedTokeiData, formatNumber } from '../utils/parseTokei';

/**
 * 文件数量统计图表组件属性接口
 */
interface FilesCountChartProps {
  tokeiData: ParsedTokeiData;
}

const FilesCountChart: React.FC<FilesCountChartProps> = ({ tokeiData }) => {
  // 只取前15种语言
  const TOP_LANGUAGES = 15;
  const languages = tokeiData.languages.slice(0, TOP_LANGUAGES);
  
  const data = languages.map(lang => ({
    name: lang.name,
    files: lang.files,
    color: '#3b82f6',
  }));
  
  // 自定义提示框组件
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white p-3 border rounded shadow text-sm">
          <p className="font-semibold">{label}</p>
          <p>Files: {formatNumber(payload[0].value)}</p>
          <p>
            Percentage: {(payload[0].value / tokeiData.totals.files * 100).toFixed(1)}%
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
          layout="vertical"
          margin={{
            top: 5,
            right: 30,
            left: 80,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis 
            dataKey="name" 
            type="category" 
            tickFormatter={(value) => value.length > 13 ? `${value.substring(0, 13)}...` : value}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="files" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FilesCountChart;