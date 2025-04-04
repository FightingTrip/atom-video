# 贡献指南

感谢您对 Atom Video 项目感兴趣！我们欢迎任何形式的贡献，包括但不限于：

- 报告问题
- 提交功能建议
- 改进文档
- 提交代码修复
- 提交新功能

## 开始之前

在开始贡献之前，请确保您已经：

1. 阅读并理解了项目的 [行为准则](CODE_OF_CONDUCT.md)
2. 熟悉项目的 [技术栈](README.md#技术栈)
3. 了解项目的 [代码规范](docs/development/coding-standards.md)

## 开发流程

### 1. 设置开发环境

请按照 [快速开始](README.md#快速开始) 部分的说明设置您的开发环境。

### 2. 创建分支

1. Fork 本仓库
2. 克隆您的 fork：
   ```bash
   git clone https://github.com/你的用户名/atom-video.git
   cd atom-video
   ```
3. 添加上游仓库：
   ```bash
   git remote add upstream https://github.com/FightingTrip/atom-video.git
   ```
4. 创建功能分支：
   ```bash
   git checkout -b feature/你的功能名称
   ```

### 3. 开发

1. 确保您的代码符合项目的代码规范
2. 编写测试用例
3. 更新相关文档
4. 确保所有测试通过

### 4. 提交更改

1. 添加更改的文件：
   ```bash
   git add .
   ```
2. 提交更改：
   ```bash
   git commit -m "feat: 添加新功能" -m "详细描述"
   ```
3. 推送到您的 fork：
   ```bash
   git push origin feature/你的功能名称
   ```

### 5. 创建 Pull Request

1. 访问您的 fork 的 GitHub 页面
2. 点击 "New Pull Request"
3. 选择正确的分支
4. 填写 PR 描述，包括：
   - 解决的问题
   - 实现的功能
   - 测试结果
   - 相关文档更新
5. 提交 PR

## 代码规范

### 提交信息

请遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 代码风格

- 使用 TypeScript 的严格模式
- 遵循 ESLint 和 Prettier 的配置
- 编写清晰的注释
- 使用有意义的变量名和函数名

### 测试

- 为新功能编写单元测试
- 确保测试覆盖率不低于 80%
- 测试应该独立且可重复

## 文档

- 更新相关的文档
- 使用 Markdown 格式
- 保持文档的清晰和简洁
- 添加必要的示例代码

## 问题报告

如果您发现了一个问题，请：

1. 检查是否已经存在相关的问题
2. 创建一个新的 issue
3. 提供详细的问题描述，包括：
   - 问题发生的环境
   - 复现步骤
   - 期望的行为
   - 实际的行为
   - 相关的日志或截图

## 功能建议

如果您有新的功能建议，请：

1. 检查是否已经存在相关的建议
2. 创建一个新的 issue
3. 详细描述您的建议，包括：
   - 功能的目的
   - 预期的行为
   - 可能的实现方式
   - 相关的用例

## 代码审查

所有的 PR 都需要经过代码审查。请：

1. 确保您的代码符合项目的规范
2. 及时回复审查意见
3. 保持礼貌和专业

## 许可证

通过提交 PR，您同意您的贡献将根据项目的 MIT 许可证进行授权。

## 联系方式

如果您有任何问题，请：

- 创建一个 issue
- 发送邮件到 zjtdzyx@163.com
- 在 GitHub 上联系项目维护者

感谢您的贡献！ 