# 测试规范

## 测试类型

### 1. 单元测试
- 测试单个函数或组件
- 使用 Vitest 框架
- 测试文件后缀：`.spec.ts` 或 `.test.ts`

### 2. 组件测试
- 测试 Vue 组件
- 使用 Vue Test Utils
- 测试文件与组件同目录

### 3. API 测试
- 测试后端 API 接口
- 使用 Jest + Supertest
- 测试文件在 `tests/api/` 目录

### 4. 集成测试
- 测试多个组件的交互
- 使用 Cypress
- 测试文件在 `tests/integration/` 目录

## 测试工具

### 前端测试
- **Vitest**: 测试框架
- **Vue Test Utils**: Vue 组件测试工具
- **Testing Library**: DOM 测试工具
- **MSW**: Mock Service Worker

### 后端测试
- **Jest**: 测试框架
- **Supertest**: HTTP 测试工具
- **TypeORM Test Utils**: 数据库测试工具

## 测试规范

### 1. 文件命名
- 测试文件与源文件同名，添加 `.spec.ts` 或 `.test.ts` 后缀
- 例如：`UserService.ts` 的测试文件为 `UserService.spec.ts`

### 2. 测试结构
```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UserProfile from './UserProfile.vue'

describe('UserProfile', () => {
  // 测试用例组
  describe('when user is logged in', () => {
    it('should display user name', () => {
      // 测试代码
    })
  })

  describe('when user is not logged in', () => {
    it('should show login button', () => {
      // 测试代码
    })
  })
})
```

### 3. 测试命名
- 使用描述性的测试名称
- 遵循 "should ... when ..." 格式
- 例如：`should display error message when login fails`

### 4. 断言规范
```typescript
// 使用 expect 断言
expect(result).toBe(expected)
expect(result).toEqual(expected)
expect(result).toMatchSnapshot()

// 异步测试
await expect(asyncFunction()).resolves.toBe(expected)
await expect(asyncFunction()).rejects.toThrow()
```

## 测试覆盖率

### 覆盖率要求
- 语句覆盖率：> 80%
- 分支覆盖率：> 70%
- 函数覆盖率：> 80%
- 行覆盖率：> 80%

### 覆盖率报告
```bash
# 生成覆盖率报告
pnpm test:coverage

# 查看覆盖率报告
open coverage/lcov-report/index.html
```

## 测试最佳实践

### 1. 测试原则
- 测试应该是独立的
- 测试应该是可重复的
- 测试应该是自描述的
- 测试应该只测试一件事

### 2. 测试数据
- 使用工厂函数创建测试数据
- 使用 fixtures 存储测试数据
- 使用 faker 生成随机数据

### 3. 测试环境
- 使用测试数据库
- 使用环境变量配置测试环境
- 清理测试数据

### 4. 测试性能
- 避免不必要的异步操作
- 使用 mock 替代外部服务
- 批量处理测试数据

## 测试示例

### 组件测试
```typescript
import { mount } from '@vue/test-utils'
import UserProfile from './UserProfile.vue'

describe('UserProfile', () => {
  it('should display user name', () => {
    const wrapper = mount(UserProfile, {
      props: {
        user: {
          name: 'John Doe',
          email: 'john@example.com'
        }
      }
    })

    expect(wrapper.text()).toContain('John Doe')
  })
})
```

### API 测试
```typescript
import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app'

describe('Auth API', () => {
  it('should login user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('token')
  })
})
```

### 服务测试
```typescript
import { describe, it, expect } from 'vitest'
import { UserService } from './UserService'

describe('UserService', () => {
  describe('create', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      }

      const user = await UserService.create(userData)

      expect(user).toHaveProperty('id')
      expect(user.name).toBe(userData.name)
      expect(user.email).toBe(userData.email)
    })
  })
})
```

## 测试工具配置

### Vitest 配置
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/']
    }
  }
})
```

### Jest 配置
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts'
  ]
}
```

## 常见问题

### 1. 测试失败
- 检查测试环境配置
- 验证测试数据
- 检查异步操作

### 2. 覆盖率低
- 添加更多测试用例
- 检查未覆盖的代码路径
- 使用代码分析工具

### 3. 测试速度慢
- 优化测试数据
- 使用 mock 替代外部服务
- 并行运行测试 