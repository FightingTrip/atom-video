# Atom 设计系统与样式指南

本文档介绍了Atom视频平台的设计系统和CSS架构，以及如何在开发中正确使用它们。

## 样式架构概述

Atom使用混合的CSS策略，结合了设计标记（Design Tokens）、组件库和Tailwind CSS的优点：

1. **设计标记（variables.css）**：定义所有设计变量，包括颜色、间距、字体等
2. **组件样式（components.css）**：提供常用UI组件的样式
3. **Tailwind集成**：使用Tailwind CSS进行快速样式开发
4. **主题切换**：支持深色/浅色主题无缝切换

## 核心文件说明

- **variables.css**: 设计标记变量，设计系统的基础
- **components.css**: 预定义组件样式，基于设计标记构建
- **tailwind.css**: Tailwind CSS配置和自定义扩展
- **tailwind.config.js**: Tailwind配置，集成了设计标记变量

## 何时使用各种样式方法

### 使用设计标记（CSS变量）

当你需要确保样式一致性或创建新的自定义组件时，应直接使用CSS变量：

```css
.custom-element {
  color: var(--color-text-primary);
  background-color: var(--color-bg-surface);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
}
```

### 使用组件样式类

对于常见UI组件，使用预定义的组件类：

```html
<button class="btn btn-primary">主要按钮</button>
<div class="card">
  <div class="card-body">卡片内容</div>
</div>
```

### 使用Tailwind类

对于快速布局和简单样式，使用Tailwind类：

```html
<div class="flex items-center justify-between p-4 bg-bg-surface rounded-lg">
  <h2 class="text-lg font-semibold text-text-primary">标题</h2>
  <span class="text-sm text-text-secondary">描述</span>
</div>
```

## 颜色系统

设计系统有明确定义的颜色用途：

- **背景色**: `--color-bg-*` 变量
  - canvas: 页面背景
  - surface: 卡片和元素背景
  - overlay: 弹出层背景
  - subtle: 次要背景(如按钮)
  
- **文本色**: `--color-text-*` 变量
  - primary: 主要文本
  - secondary: 次要文本
  - muted: 弱化文本
  
- **边框色**: `--color-border-*` 变量
  - primary: 主要边框
  - secondary: 次要边框
  - muted: 弱化边框
  
- **强调色**: `--color-accent-*` 变量
  - primary: 主题色
  - secondary: 次要主题色
  - emphasis: 强调色

## 间距系统

间距使用一致的比例：

- `--spacing-1`: 0.25rem (4px)
- `--spacing-2`: 0.5rem (8px)
- `--spacing-3`: 0.75rem (12px)
- `--spacing-4`: 1rem (16px)
- `--spacing-5`: 1.25rem (20px)
- `--spacing-6`: 1.5rem (24px)
- `--spacing-8`: 2rem (32px)

## 主题切换

主题切换通过在`:root`元素上添加`.light`类来实现：

```js
// 切换到浅色主题
document.documentElement.classList.add('light');

// 切换到深色主题
document.documentElement.classList.remove('light');
```

## 最佳实践

1. **优先使用设计标记变量**：保证样式一致性
2. **组件优先**：尽量使用预定义组件而非自定义样式
3. **Tailwind用于快速开发**：用于简单布局和风格
4. **避免硬编码值**：不要使用硬编码的颜色、大小、间距等
5. **保持响应式**：使用相对单位和响应式设计
6. **主题兼容**：确保所有样式在深色和浅色主题下都能正常显示

## 组件库概览

以下是预定义的组件类：

### 按钮

- `.btn`: 基础按钮样式
- `.btn-primary`: 主要按钮
- `.btn-secondary`: 次要按钮
- `.btn-danger`: 危险按钮
- `.btn-link`: 链接按钮
- `.btn-sm`, `.btn-lg`: 尺寸变体

### 表单

- `.form-group`: 表单组
- `.form-label`: 表单标签
- `.form-control`: 表单控件
- `.form-check`: 复选框/单选框容器
- `.form-check-input`: 复选框/单选框输入
- `.form-check-label`: 复选框/单选框标签

### 卡片

- `.card`: 基础卡片
- `.card-header`: 卡片头部
- `.card-body`: 卡片内容
- `.card-footer`: 卡片底部
- `.card-title`: 卡片标题
- `.card-subtitle`: 卡片副标题

### 提示和通知

- `.alert`: 基础提示
- `.alert-primary`, `.alert-danger`, `.alert-success`, `.alert-warning`: 情境提示

### 导航

- `.nav`: 导航容器
- `.nav-item`: 导航项目
- `.nav-link`: 导航链接

## 向后兼容性

为了确保平滑过渡，我们提供了旧样式变量到新样式变量的映射：

```css
--primary-bg: var(--color-bg-canvas);
--secondary-bg: var(--color-bg-surface);
--text-primary: var(--color-text-primary);
/* 更多映射... */
```

这允许在不破坏现有组件的情况下渐进式更新样式。 