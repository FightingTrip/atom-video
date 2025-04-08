import React from 'react';
import { StatCard } from '../StatCard';
import { ShieldCheckIcon } from '../icons/ShieldCheckIcon';

interface CoverageStatCardProps {
  coverage: number;
  previousCoverage?: number;
  loading?: boolean;
}

export const CoverageStatCard: React.FC<CoverageStatCardProps> = ({
  coverage,
  previousCoverage,
  loading
}) => {
  const getStatus = (value: number) => {
    if (value >= 80) return 'success';
    if (value >= 60) return 'warning';
    return 'error';
  };

  const trend = previousCoverage
    ? coverage - previousCoverage
    : undefined;

  return (
    <StatCard
      title="测试覆盖率"
      value={`${coverage}%`}
      trend={trend}
      status={getStatus(coverage)}
      icon={<ShieldCheckIcon className="w-6 h-6" />}
      loading={loading}
    />
  );
};