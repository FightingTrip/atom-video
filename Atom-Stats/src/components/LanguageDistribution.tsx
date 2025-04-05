/**
 * @file LanguageDistribution.tsx
 * @description 语言分布饼图组件
 * 
 * 该组件用于可视化展示项目中各编程语言的代码量分布情况：
 * 1. 将代码量最多的前10种语言以饼图形式展示
 * 2. 其余语言归类为"Others"类别
 * 3. 提供交互式悬浮提示，显示具体数据
 * 4. 支持图例展示
 */

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ParsedTokeiData, calculatePercentage } from '../utils/parseTokei';

interface LanguageDistributionProps {
  tokeiData: ParsedTokeiData;
}

// 生成一组颜色
const COLORS = [
  '#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', 
  '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#6366f1',
  '#a855f7', '#d946ef', '#22c55e', '#eab308', '#84cc16',
  '#64748b', '#0ea5e9', '#e11d48', '#7c3aed', '#0d9488',
];

const LanguageDistribution: React.FC<LanguageDistributionProps> = ({ tokeiData }) => {
  // 只取前10种语言，其他的归为"Others"
  const TOP_LANGUAGES = 10;
  const { languages, totals } = tokeiData;
  
  let data = [];
  
  if (languages.length <= TOP_LANGUAGES) {
    data = languages.map(lang => ({
      name: lang.name,
      value: lang.code,
      percentage: calculatePercentage(lang.code, totals.code),
    }));
  } else {
    // 前TOP_LANGUAGES种语言
    const topLanguages = languages.slice(0, TOP_LANGUAGES).map(lang => ({
      name: lang.name,
      value: lang.code,
      percentage: calculatePercentage(lang.code, totals.code),
    }));
    
    // 其他语言合并为"Others"
    const otherLanguages = languages.slice(TOP_LANGUAGES);
    const otherCodeLines = otherLanguages.reduce((sum, lang) => sum + lang.code, 0);
    
    data = [
      ...topLanguages,
      {
        name: 'Others',
        value: otherCodeLines,
        percentage: calculatePercentage(otherCodeLines, totals.code),
      }
    ];
  }
  
  // 自定义的提示框组件
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white p-3 border rounded shadow text-sm">
          <p className="font-semibold">{payload[0].name}</p>
          <p>Code lines: {payload[0].value.toLocaleString()}</p>
          <p>Percentage: {payload[0].payload.percentage}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percentage }) => `${name}: ${percentage}`}
            paddingAngle={1}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend layout="vertical" align="right" verticalAlign="middle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LanguageDistribution;