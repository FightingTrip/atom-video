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
              <h3 className="text-xl font-bold">128,291 行</h3>
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
              <h3 className="text-xl font-bold">426 个</h3>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <CommitIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">提交次数</p>
              <h3 className="text-xl font-bold">1,842 次</h3>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
              <TeamIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">贡献者</p>
              <h3 className="text-xl font-bold">16 人</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-2">
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

        <Card className="col-span-2">
          <h2 className="text-lg font-semibold mb-4">团队贡献</h2>
          <TeamContribution className="h-96" />
        </Card>
      </div>
    </div>
  );
};