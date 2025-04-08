import React from 'react';
import { Card } from '../components/Card';

export const Settings: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 分析规则设置 */}
      <Card>
        <h2 className="text-lg font-semibold mb-6">分析规则配置</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">复杂度阈值</label>
            <input
              type="number"
              className="form-input w-full max-w-xs"
              defaultValue={10}
            />
            <p className="mt-1 text-sm text-gray-500">
              设置函数圈复杂度警告阈值
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">重复率阈值</label>
            <input
              type="number"
              className="form-input w-full max-w-xs"
              defaultValue={20}
            />
            <p className="mt-1 text-sm text-gray-500">
              设置代码重复警告阈值（%）
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">覆盖率目标</label>
            <input
              type="number"
              className="form-input w-full max-w-xs"
              defaultValue={80}
            />
            <p className="mt-1 text-sm text-gray-500">
              设置测试覆盖率目标（%）
            </p>
          </div>
        </div>
      </Card>

      {/* 忽略规则设置 */}
      <Card>
        <h2 className="text-lg font-semibold mb-6">忽略规则配置</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">忽略文件</label>
            <textarea
              className="form-textarea w-full"
              rows={4}
              defaultValue="*.test.ts&#10;*.spec.ts&#10;*.d.ts"
            />
            <p className="mt-1 text-sm text-gray-500">
              每行一个 glob 模式
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">忽略目录</label>
            <textarea
              className="form-textarea w-full"
              rows={4}
              defaultValue="node_modules/&#10;dist/&#10;coverage/"
            />
            <p className="mt-1 text-sm text-gray-500">
              每行一个目录路径
            </p>
          </div>
        </div>
      </Card>

      {/* 系统设置 */}
      <Card>
        <h2 className="text-lg font-semibold mb-6">系统设置</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">主题</label>
            <select className="form-select w-full max-w-xs">
              <option value="system">跟随系统</option>
              <option value="light">浅色</option>
              <option value="dark">深色</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">语言</label>
            <select className="form-select w-full max-w-xs">
              <option value="zh-CN">简体中文</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              自动刷新间隔
            </label>
            <select className="form-select w-full max-w-xs">
              <option value="0">禁用</option>
              <option value="300">5分钟</option>
              <option value="600">10分钟</option>
              <option value="1800">30分钟</option>
            </select>
          </div>
        </div>
      </Card>

      {/* 保存按钮 */}
      <div className="flex justify-end">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          保存设置
        </button>
      </div>
    </div>
  );
};