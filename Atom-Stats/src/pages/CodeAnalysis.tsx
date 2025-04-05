import React from 'react';
import { Card } from '../components/Card';
import { ComplexityChart } from '../components/analysis/ComplexityChart';
import { DependencyGraph } from '../components/analysis/DependencyGraph';
import { CodeDuplication } from '../components/analysis/CodeDuplication';
import { TestCoverage } from '../components/analysis/TestCoverage';

export const CodeAnalysis: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 分析指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <h3 className="text-xl font-bold">代码质量评分</h3>
            <div className="mt-2 text-4xl font-bold text-green-600">A</div>
            <p className="mt-2 text-sm text-gray-500">基于圈复杂度、重复率等指标</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <h3 className="text-xl font-bold">测试覆盖率</h3>
            <div className="mt-2 text-4xl font-bold text-blue-600">87%</div>
            <p className="mt-2 text-sm text-gray-500">包含单元测试和集成测试</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <h3 className="text-xl font-bold">技术债务</h3>
            <div className="mt-2 text-4xl font-bold text-yellow-600">42h</div>
            <p className="mt-2 text-sm text-gray-500">预计修复时间</p>
          </div>
        </Card>
      </div>

      {/* 详细分析图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4">圈复杂度分析</h2>
          <ComplexityChart className="h-80" />
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">代码重复率</h2>
          <CodeDuplication className="h-80" />
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">测试覆盖率趋势</h2>
          <TestCoverage className="h-80" />
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">依赖关系图谱</h2>
          <DependencyGraph className="h-80" />
        </Card>
      </div>

      {/* 问题列表 */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">待处理问题</h2>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {[
            { type: '复杂度过高', file: 'src/services/analyzeService.ts', line: 128 },
            { type: '重复代码', file: 'src/utils/format.ts', line: 45 },
            { type: '未使用导入', file: 'src/components/Chart.tsx', line: 12 },
          ].map((issue, index) => (
            <div key={index} className="py-3 flex justify-between items-center">
              <div>
                <span className="text-red-500 font-medium">{issue.type}</span>
                <span className="ml-2 text-sm text-gray-500">
                  {issue.file}:{issue.line}
                </span>
              </div>
              <button className="text-blue-500 hover:text-blue-600">
                查看详情
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};