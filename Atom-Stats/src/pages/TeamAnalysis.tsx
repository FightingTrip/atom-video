import React from 'react';
import { Card } from '../components/Card';
import { ContributionHeatmap } from '../components/team/ContributionHeatmap';
import { CommitTimeline } from '../components/team/CommitTimeline';
import { ContributorStats } from '../components/team/ContributorStats';
import { ReviewStats } from '../components/team/ReviewStats';

export const TeamAnalysis: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 团队统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <h3 className="text-xl font-bold">本月提交</h3>
            <div className="mt-2 text-4xl font-bold text-blue-600">247</div>
            <p className="mt-2 text-sm text-gray-500">较上月 +12.5%</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <h3 className="text-xl font-bold">活跃贡献者</h3>
            <div className="mt-2 text-4xl font-bold text-green-600">8</div>
            <p className="mt-2 text-sm text-gray-500">本周活跃成员</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <h3 className="text-xl font-bold">代码评审</h3>
            <div className="mt-2 text-4xl font-bold text-purple-600">32</div>
            <p className="mt-2 text-sm text-gray-500">待处理PR</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <h3 className="text-xl font-bold">平均响应</h3>
            <div className="mt-2 text-4xl font-bold text-orange-600">4h</div>
            <p className="mt-2 text-sm text-gray-500">PR响应时间</p>
          </div>
        </Card>
      </div>

      {/* 详细分析图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-2">
          <h2 className="text-lg font-semibold mb-4">贡献热力图</h2>
          <ContributionHeatmap className="h-80" />
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">贡献者统计</h2>
          <ContributorStats className="h-80" />
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">代码评审效率</h2>
          <ReviewStats className="h-80" />
        </Card>

        <Card className="col-span-2">
          <h2 className="text-lg font-semibold mb-4">提交时间线</h2>
          <CommitTimeline className="h-96" />
        </Card>
      </div>

      {/* 团队成员列表 */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">团队成员</h2>
          <button className="text-blue-500 hover:text-blue-600">
            查看全部
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: '张三', role: '前端开发', commits: 156, avatar: '/avatars/1.png' },
            { name: '李四', role: '后端开发', commits: 142, avatar: '/avatars/2.png' },
            { name: '王五', role: '全栈开发', commits: 98, avatar: '/avatars/3.png' },
          ].map((member, index) => (
            <div key={index} className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="ml-4">
                <h3 className="font-medium">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.role}</p>
                <p className="text-sm text-gray-500">
                  {member.commits} commits
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};