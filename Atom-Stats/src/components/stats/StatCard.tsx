import React, { memo } from 'react';
import clsx from 'clsx';

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
  loading = false,
  onClick,
  className,
  style,
}) => {
  const trendColor = React.useMemo(() => {
    if (!trend) return undefined;
    return trend > 0 ? 'text-green-600' : 'text-red-600';
  }, [trend]);

  return (
    <div
      className={clsx(
        'p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow',
        loading && 'animate-pulse',
        className
      )}
      style={style}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        {icon && <div className="p-2">{icon}</div>}
        <h3 className="text-sm text-gray-500 dark:text-gray-400">{title}</h3>
      </div>
      <div className="mt-2">
        <div className="text-2xl font-bold">
          {loading ? '-' : value}
          {unit && <span className="text-sm ml-1">{unit}</span>}
        </div>
        {trend && (
          <div className={clsx('text-sm mt-1', trendColor)}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
        {status && (
          <div className={clsx(
            'inline-block px-2 py-0.5 mt-2 text-xs rounded',
            status === 'success' && 'bg-green-100 text-green-800',
            status === 'warning' && 'bg-yellow-100 text-yellow-800',
            status === 'error' && 'bg-red-100 text-red-800'
          )}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        )}
      </div>
    </div>
  );
});

StatCard.displayName = 'StatCard';