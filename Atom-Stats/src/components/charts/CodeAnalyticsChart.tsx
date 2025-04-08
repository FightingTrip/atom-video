import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface CodeAnalyticsProps {
  data: Array<{
    date: string;
    lines: number;
    commits: number;
    contributors: number;
  }>;
  loading?: boolean;
  className?: string;
}

export const CodeAnalyticsChart: React.FC<CodeAnalyticsProps> = ({
  data,
  loading,
  className
}) => {
  if (loading) {
    return <div className="animate-pulse h-64 bg-gray-100 rounded-lg" />;
  }

  return (
    <div className={className}>
      <LineChart
        width={800}
        height={400}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="lines"
          stroke="#8884d8"
          name="代码行数"
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="commits"
          stroke="#82ca9d"
          name="提交次数"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="contributors"
          stroke="#ffc658"
          name="贡献者"
        />
      </LineChart>
    </div>
  );
};