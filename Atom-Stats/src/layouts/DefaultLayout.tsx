import React from 'react';
import { Layout } from '../components/Layout';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';

export const DefaultLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Layout className="min-h-screen">
      {/* 顶部导航 */}
      <Header className="h-16 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/stats-icon.svg" alt="Atom-Stats" className="h-8 w-8" />
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              Atom-Stats
            </span>
          </div>

          {/* 右侧工具栏 */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <UserProfile />
          </div>
        </div>
      </Header>

      <div className="flex flex-1 overflow-hidden">
        {/* 左侧边栏 */}
        <Sidebar className="w-64 border-r border-gray-200 dark:border-gray-800">
          <nav className="flex flex-col p-4">
            <MenuItem icon="dashboard" label="项目概览" href="/" />
            <MenuItem icon="code" label="代码分析" href="/code" />
            <MenuItem icon="chart" label="团队贡献" href="/team" />
            <MenuItem icon="shield" label="质量报告" href="/quality" />
            <MenuItem icon="settings" label="设置" href="/settings" />
          </nav>
        </Sidebar>

        {/* 主内容区 */}
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </Layout>
  );
}