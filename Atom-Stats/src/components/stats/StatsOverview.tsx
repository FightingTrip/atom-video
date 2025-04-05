import React from 'react';
import { StatCard } from '../StatCard';
import { CodeIcon, GitBranchIcon, UsersIcon, ChartIcon } from '../icons';
import { formatNumber, calculateTrend } from '../../utils/formatStats';

interface StatsOverviewProps {
  data: {
    totalLines: number;
    prevLines: number;
    commits: number;
    prevCommits: number;
    contributors: number;
    prevContributors: number;
    codeQuality: string;
  };
  loading?: boolean;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ data, loading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="代码行数"
        value={formatNumber(data.totalLines)}
        trend={calculateTrend(data.totalLines, data.prevLines)}
        icon={<CodeIcon />}
        loading={loading}
      />
      <StatCard
        title="提交次数"
        value={formatNumber(data.commits)}
        trend={calculateTrend(data.commits, data.prevCommits)}
        icon={<GitBranchIcon />}
        loading={loading}
      />
      <StatCard
        title="贡献者"
        value={data.contributors}
        trend={calculateTrend(data.contributors, data.prevContributors)}
        icon={<UsersIcon />}
        loading={loading}
      />
      <StatCard
        title="代码质量"
        value={data.codeQuality}
        status={data.codeQuality === 'A' ? 'success' : 'warning'}
        icon={<ChartIcon />}
        loading={loading}
      />
    </div>
  );
};