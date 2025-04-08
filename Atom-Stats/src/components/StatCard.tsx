import React, { memo, useMemo } from 'react';
import clsx from 'clsx';
import { Card } from './Card';

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

  const statusColor = useMemo(() => {
    switch (status) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      default: return undefined;
    }
  }, [status]);

  return (
    <Card
      className={clsx(
        'p-4 hover:shadow-lg transition-shadow',
        className
      )}
      style={style}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        {icon && <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">{icon}</div>}
        {loading ? (
          <div className="animate-pulse w-full">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        ) : (
          <div className={clsx('w-full', { 'ml-4': icon })}>
            <h3 className="text-sm text-gray-500 dark:text-gray-400">{title}</h3>
            <div className="mt-2 flex items-end">
              <span className={clsx('text-2xl font-bold', statusColor)}>{value}</span>
              {unit && <span className="ml-1 text-sm text-gray-500">{unit}</span>}
              {trend !== undefined && (
                <span className={clsx('ml-2 text-sm', trendColor)}>
                  {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
});