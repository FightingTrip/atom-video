# TypeScript 类型错误修复

## 概述

本文档记录了项目中修复的TypeScript类型错误，包括错误处理、Prisma模型类型和其他类型安全性问题。

## 1. 错误处理工具创建

为了统一处理unknown类型的错误，创建了专用的错误处理工具函数：

```typescript
// backend/src/utils/error-handler.util.ts
export function formatError(error: unknown): { message: string; stack?: string } {
  return {
    message: getErrorMessage(error),
    stack: getErrorStack(error),
  };
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return '未知错误';
}

export function getErrorStack(error: unknown): string | undefined {
  if (error instanceof Error) {
    return error.stack;
  }
  return undefined;
}
```

## 2. OAuth策略修复

修复了 OAuth 认证策略中的以下问题：

- 配置值可能为 undefined
- 错误捕获块中的 unknown 类型处理
- 回调参数和返回值类型问题

主要修改文件：
- `backend/src/modules/auth/strategies/github.strategy.ts`
- `backend/src/modules/auth/strategies/google.strategy.ts`

## 3. 视频服务类型修复

修复了视频服务模块中的多个类型错误：

### 3.1 错误处理问题

将所有catch块中的错误处理改为使用formatError函数，确保类型安全：

```typescript
try {
  // 代码...
} catch (error: unknown) {
  const { message, stack } = formatError(error);
  this.logger.error(`错误信息: ${message}`, stack);
  throw new BadRequestException(`错误信息: ${message}`);
}
```

### 3.2 Prisma模型相关修复

- 修复了模型字段不存在的问题（如avatar字段）
- 正确使用Prisma类型而不是any：
  ```typescript
  const where: Prisma.VideoWhereInput = { ... };
  const orderBy: Prisma.VideoOrderByWithRelationInput = { ... };
  const updateData: Prisma.VideoUpdateInput = { ... };
  ```
- 修复包含关系的数据查询和处理：
  ```typescript
  // 正确处理tags关系
  tags: {
    include: {
      tag: true,
    },
  }
  ```
- 正确格式化返回数据，防止访问不存在的属性

### 3.3 正确处理_count关系

替换了不正确的方式：
```typescript
// 错误方式
commentsCount: video.comments.length
likesCount: video.likes.length

// 正确方式
const { _count, ...videoData } = video;
return {
  ...videoData,
  commentsCount: _count?.comments || 0,
  likesCount: _count?.likes || 0,
};
```

### 3.4 UpdateVideoDto处理

修复了更新DTO处理中的类型问题，通过显式复制字段而不是使用展开运算符：

```typescript
// 错误方式
const updateData: Prisma.VideoUpdateInput = { ...updateVideoDto };

// 正确方式
const updateData: Prisma.VideoUpdateInput = {};
if (updateVideoDto.title) updateData.title = updateVideoDto.title;
// 其他字段...
```

## 4. 模块导入问题修复

修复了共享包导入问题：

### 4.1 创建本地枚举

为解决 `Cannot find module '@atom/shared-types/models'` 错误，创建了本地枚举文件：

```typescript
// backend/src/models/enums.ts
export enum VideoVisibility {
  PUBLIC = 'PUBLIC',
  UNLISTED = 'UNLISTED',
  PRIVATE = 'PRIVATE',
  MEMBERS_ONLY = 'MEMBERS_ONLY',
}

export enum VideoType {
  TUTORIAL = 'TUTORIAL',
  CODE_REVIEW = 'CODE_REVIEW',
  // ... 其他枚举值
}

export enum DifficultyLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

// ... 其他所需枚举
```

### 4.2 更新导入路径

将所有原先从共享包导入的地方改为使用本地枚举：

```typescript
// 修改前
import { VideoVisibility, VideoType, DifficultyLevel } from '@atom/shared-types/models';

// 修改后
import { VideoVisibility, VideoType, DifficultyLevel } from '../../../models/enums';
```

修改的文件包括：
- `backend/src/modules/video/services/video.service.ts`
- `backend/src/modules/video/controllers/video.controller.ts`
- `backend/src/modules/recommendation/services/recommendation.service.ts`
- `backend/src/modules/recommendation/dto/recommendation.dto.ts`
- `backend/src/modules/notification/services/notification.service.ts`
- `backend/src/modules/notification/dto/create-notification.dto.ts`

## 5. 总结

通过上述修复，解决了以下类型的错误：

1. **Unknown类型处理**: 确保所有catch块中的error被正确处理
2. **非空检查**: 避免对可能为undefined的值进行操作
3. **Prisma模型类型**: 使用正确的Prisma类型代替any
4. **关系处理**: 正确处理和格式化Prisma关系数据
5. **字段存在性**: 只访问模型中确实存在的字段
6. **模块导入问题**: 通过创建本地枚举文件解决了共享包导入问题

这些修复不仅解决了TypeScript编译错误，也提高了代码的类型安全性和可维护性。 