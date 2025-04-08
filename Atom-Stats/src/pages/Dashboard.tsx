import React from 'react';
import { Card } from '../components/Card';
import { CodeStats } from '../components/stats/CodeStats';
import { LanguageDistribution } from '../components/stats/LanguageDistribution';
import { CommitActivity } from '../components/stats/CommitActivity';
import { TeamContribution } from '../components/stats/TeamContribution';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 顶部数据卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <CodeIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">总代码量</p>
              <h3 className="text-xl font-bold">128,291 <span className="text-sm font-normal">行</span></h3>
              <p className="text-xs text-green-500">↑ 2.3% 较上周</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <FileIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">文件数量</p>
              <h3 className="text-xl font-bold">426 <span className="text-sm font-normal">个</span></h3>
              <p className="text-xs text-green-500">↑ 5 较昨天</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <ContributorIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">活跃贡献者</p>
              <h3 className="text-xl font-bold">8 <span className="text-sm font-normal">人</span></h3>
              <p className="text-xs text-orange-500">- 与上周持平</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <QualityIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">代码质量</p>
              <h3 className="text-xl font-bold">A <span className="text-sm font-normal">级</span></h3>
              <p className="text-xs text-green-500">↑ 较上月</p>
            </div>
          </div>
        </Card>
      </div>

      {/* 统计图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4">代码量趋势</h2>
          <CodeStats className="h-80" />
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">语言分布</h2>
          <LanguageDistribution className="h-80" />
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">提交活动</h2>
          <CommitActivity className="h-80" />
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">团队贡献</h2>
          <TeamContribution className="h-80" />
        </Card>
      </div>
    </div>
  );
};