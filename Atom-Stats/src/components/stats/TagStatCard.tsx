import React from 'react';
import { Card } from '../Card';
import { ChartIcon } from '../icons/ChartIcon';
import { formatNumber } from '../../utils/format';

interface TagStatCardProps {
  title: string;
  value: number;
  trend?: number;
  icon?: React.ReactNode;
  loading?: boolean;
}

export const TagStatCard: React.FC<TagStatCardProps> = ({
  title,
  value,
  trend,
  icon = <ChartIcon className="h-6 w-6" />,
  loading = false
}) => {
  const trendColor = trend && trend > 0 ? 'text-green-600' : 'text-red-600';
  
  return (
    <Card className={loading ? 'animate-pulse' : ''}>
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-xl font-bold">{formatNumber(value)}</h3>
          {trend && (
            <p className={`text-sm ${trendColor}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};