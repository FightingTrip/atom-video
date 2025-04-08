#!/usr/bin/env node

/**
 * 该脚本用于检查是否有子项目创建了.pnpm-store目录，确保遵循monorepo的最佳实践
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 获取工作区配置
const workspaceConfig = fs.readFileSync(path.join(rootDir, 'pnpm-workspace.yaml'), 'utf8');
const workspaceLines = workspaceConfig.split('\n').filter(line => line.trim().startsWith('-'));
const workspacePaths = workspaceLines.map(line => line.trim().replace(/^- ['"]?(.+?)['"]?$/, '$1'));

// 检查子项目是否有.pnpm-store目录
let hasSubprojectStore = false;
for (const wsPath of workspacePaths) {
  // 处理通配符
  if (wsPath.includes('*')) {
    const basePath = wsPath.split('*')[0];
    if (fs.existsSync(path.join(rootDir, basePath))) {
      const subdirs = fs.readdirSync(path.join(rootDir, basePath));
      for (const subdir of subdirs) {
        const fullPath = path.join(rootDir, basePath, subdir);
        if (fs.statSync(fullPath).isDirectory() && fs.existsSync(path.join(fullPath, '.pnpm-store'))) {
          console.error(`\x1b[31m错误: 子项目 ${fullPath} 包含 .pnpm-store 目录，这违反了monorepo的最佳实践。\x1b[0m`);
          hasSubprojectStore = true;
        }
        
        // 检查子项目是否有.npmrc文件
        if (fs.existsSync(path.join(fullPath, '.npmrc'))) {
          console.error(`\x1b[31m错误: 子项目 ${fullPath} 包含 .npmrc 文件，这违反了monorepo的最佳实践。\x1b[0m`);
          hasSubprojectStore = true;
        }
      }
    }
  } else {
    // 直接检查非通配符路径
    const fullPath = path.join(rootDir, wsPath);
    if (fs.existsSync(fullPath) && fs.existsSync(path.join(fullPath, '.pnpm-store'))) {
      console.error(`\x1b[31m错误: 子项目 ${fullPath} 包含 .pnpm-store 目录，这违反了monorepo的最佳实践。\x1b[0m`);
      hasSubprojectStore = true;
    }
    
    // 检查子项目是否有.npmrc文件
    if (fs.existsSync(fullPath) && fs.existsSync(path.join(fullPath, '.npmrc'))) {
      console.error(`\x1b[31m错误: 子项目 ${fullPath} 包含 .npmrc 文件，这违反了monorepo的最佳实践。\x1b[0m`);
      hasSubprojectStore = true;
    }
  }
}

if (hasSubprojectStore) {
  console.error('\x1b[31m请移除子项目中的 .pnpm-store 目录和 .npmrc 文件，确保只在根目录中维护依赖配置。\x1b[0m');
  console.error('\x1b[33m您可以运行以下命令来修复此问题：\x1b[0m');
  console.error('\x1b[33mpnpm run fix:monorepo\x1b[0m');
  process.exit(1);
} else {
  console.log('\x1b[32m✓ 所有子项目都遵循了monorepo的最佳实践\x1b[0m');
} 