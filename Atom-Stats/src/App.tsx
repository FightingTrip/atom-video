/**
 * @file App.tsx
 * @description 代码统计仪表盘主应用组件
 * 
 * 该组件是整个应用的入口点，负责：
 * 1. 加载和管理tokei统计数据
 * 2. 处理加载状态和错误状态
 * 3. 组织和布局所有子组件
 * 4. 提供暗色主题支持
 */

import { useState, useEffect } from 'react';
import { fetchTokeiData, ParsedTokeiData } from './utils/parseTokei';
import ProjectOverview from './components/ProjectOverview';
import LanguageDistribution from './components/LanguageDistribution';
import CodeMetricsChart from './components/CodeMetricsChart';
import FilesCountChart from './components/FilesCountChart';
import LanguageTable from './components/LanguageTable';

/**
 * 主应用组件
 * 管理全局状态并组织页面布局
 */
function App() {
  const [tokeiData, setTokeiData] = useState<ParsedTokeiData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchTokeiData();
        setTokeiData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load code statistics data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading code statistics...</p>
        </div>
      </div>
    );
  }

  if (error || !tokeiData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error || 'Failed to load data'}</p>
          <p className="mt-4 text-sm text-gray-600">
            Make sure the tokei.json file exists in the public directory
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Atom-Video Code Statistics
          </h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ProjectOverview tokeiData={tokeiData} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Language Distribution
            </h2>
            <LanguageDistribution tokeiData={tokeiData} />
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Code/Comments/Blanks Distribution
            </h2>
            <CodeMetricsChart tokeiData={tokeiData} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Files by Language
            </h2>
            <FilesCountChart tokeiData={tokeiData} />
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Project Structure
            </h2>
            <div className="flex flex-col space-y-2">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                <span className="font-semibold">Frontend:</span> Vue 3 + TypeScript
              </div>
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                <span className="font-semibold">Backend:</span> Express + Node.js
              </div>
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                <span className="font-semibold">Documentation:</span> Markdown
              </div>
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                <span className="font-semibold">Stats Dashboard:</span> React + TypeScript + Vite
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Language Details
          </h2>
          <LanguageTable tokeiData={tokeiData} />
        </div>
      </main>
      <footer className="bg-white dark:bg-gray-800 shadow py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 dark:text-gray-400">
            Generated with Tokei | {new Date().toLocaleDateString()} | Atom-Video Project
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
