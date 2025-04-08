#!/usr/bin/env node

/**
 * 该脚本用于修复子项目中的.pnpm-store目录和.npmrc文件，确保遵循monorepo的最佳实践
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

// 修复子项目中的.pnpm-store目录和.npmrc文件
let fixedCount = 0;
for (const wsPath of workspacePaths) {
  // 处理通配符
  if (wsPath.includes('*')) {
    const basePath = wsPath.split('*')[0];
    if (fs.existsSync(path.join(rootDir, basePath))) {
      const subdirs = fs.readdirSync(path.join(rootDir, basePath));
      for (const subdir of subdirs) {
        const fullPath = path.join(rootDir, basePath, subdir);
        if (fs.statSync(fullPath).isDirectory()) {
          // 删除.pnpm-store目录
          const storePath = path.join(fullPath, '.pnpm-store');
          if (fs.existsSync(storePath)) {
            try {
              console.log(`删除子项目 ${fullPath} 中的 .pnpm-store 目录...`);
              fs.rmSync(storePath, { recursive: true, force: true });
              fixedCount++;
            } catch (err) {
              console.error(`无法删除 ${storePath}: ${err.message}`);
            }
          }
          
          // 删除.npmrc文件
          const npmrcPath = path.join(fullPath, '.npmrc');
          if (fs.existsSync(npmrcPath)) {
            try {
              console.log(`删除子项目 ${fullPath} 中的 .npmrc 文件...`);
              fs.unlinkSync(npmrcPath);
              fixedCount++;
            } catch (err) {
              console.error(`无法删除 ${npmrcPath}: ${err.message}`);
            }
          }
        }
      }
    }
  } else {
    // 直接处理非通配符路径
    const fullPath = path.join(rootDir, wsPath);
    if (fs.existsSync(fullPath)) {
      // 删除.pnpm-store目录
      const storePath = path.join(fullPath, '.pnpm-store');
      if (fs.existsSync(storePath)) {
        try {
          console.log(`删除子项目 ${fullPath} 中的 .pnpm-store 目录...`);
          fs.rmSync(storePath, { recursive: true, force: true });
          fixedCount++;
        } catch (err) {
          console.error(`无法删除 ${storePath}: ${err.message}`);
        }
      }
      
      // 删除.npmrc文件
      const npmrcPath = path.join(fullPath, '.npmrc');
      if (fs.existsSync(npmrcPath)) {
        try {
          console.log(`删除子项目 ${fullPath} 中的 .npmrc 文件...`);
          fs.unlinkSync(npmrcPath);
          fixedCount++;
        } catch (err) {
          console.error(`无法删除 ${npmrcPath}: ${err.message}`);
        }
      }
    }
  }
}

if (fixedCount > 0) {
  console.log(`\x1b[32m✓ 已修复 ${fixedCount} 个问题\x1b[0m`);
} else {
  console.log('\x1b[32m✓ 没有需要修复的问题\x1b[0m');
}

// 清理根目录下的依赖缓存
console.log('清理根目录下的依赖缓存...');
try {
  execSync('pnpm store prune', { stdio: 'inherit' });
} catch (err) {
  console.error(`无法清理依赖缓存: ${err.message}`);
} 