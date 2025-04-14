# Atom-Video 权限系统设计文档

## 1. 概述

Atom-Video 平台采用了基于角色（RBAC）的权限控制系统，实现了前后端一致的权限管理机制。本文档详细说明了系统的权限设计、实现方式以及使用方法。

## 2. 角色体系

### 2.1 用户角色定义

系统定义了四种基本用户角色，按权限等级从高到低依次为：

| 角色 | 说明 | 权限范围 |
|------|------|----------|
| ADMIN | 管理员 | 拥有系统所有功能的访问权限 |
| CREATOR | 创作者 | 拥有内容创作、管理和所有普通用户功能 |
| VIEWER | 普通观众 | 拥有基本的内容消费和互动功能 |
| GUEST | 游客 | 仅可浏览公开内容，无需登录 |

### 2.2 角色层级结构

系统采用层级式权限模型，高级角色自动拥有低级角色的所有权限：

```
ADMIN > CREATOR > VIEWER > GUEST
```

这种设计确保了权限的自然继承，简化了权限检查逻辑。

## 3. 后端权限实现

### 3.1 守卫（Guards）

#### 3.1.1 角色守卫（RolesGuard）

`RolesGuard` 实现了基于角色的路由访问控制：

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 获取路由所需角色
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // 如果没有设置角色要求，则允许访问
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // 检查角色层级权限
    const roleHierarchy = {
      ADMIN: 3,
      CREATOR: 2,
      VIEWER: 1,
      GUEST: 0,
    };

    const userRoleLevel = roleHierarchy[user.role] || 0;

    return requiredRoles.some(role => {
      const requiredRoleLevel = roleHierarchy[role] || 0;
      return userRoleLevel >= requiredRoleLevel;
    });
  }
}
```

#### 3.1.2 创作者守卫（CreatorGuard）

`CreatorGuard` 专门针对创作者权限进行检查：

```typescript
@Injectable()
export class CreatorGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();

    // 检查用户是否是创作者
    // 管理员自动具有创作者权限
    return user.isCreator === true || 
           user.role === UserRole.ADMIN || 
           user.role === UserRole.CREATOR;
  }
}
```

#### 3.1.3 JWT 认证守卫

通过 Passport.js 实现的 JWT 认证机制：

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'super-secret'),
    });
  }

  async validate(payload: JwtPayload) {
    // 从数据库验证用户
    const user = await this.prismaService.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isVerified: true,
        isCreator: true,
      },
    });

    if (!user) {
      return null; // 用户不存在，将触发401未授权响应
    }

    return user;
  }
}
```

### 3.2 装饰器

#### 3.2.1 角色装饰器（Roles）

用于标记访问特定路由所需的角色：

```typescript
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
```

#### 3.2.2 使用示例

```typescript
@Controller('videos')
export class VideoController {
  @Get('public')
  public getPublicVideos() {
    // 所有用户都可访问
  }

  @Get('private')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VIEWER)
  public getPrivateVideos() {
    // 仅登录用户可访问
  }

  @Post()
  @UseGuards(JwtAuthGuard, CreatorGuard)
  public createVideo() {
    // 仅创作者和管理员可访问
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  public deleteVideo() {
    // 仅管理员可访问
  }
}
```

## 4. 前端权限实现

### 4.1 权限检查 Hook

`usePermission` 组合式 API 提供了方便的权限检查方法：

```typescript
export function usePermission() {
  const authStore = useAuthStore();
  const userRole = computed(() => authStore.userRole);

  // 角色判断函数
  const isAdmin = computed(() => userRole.value === 'ADMIN');
  const isCreator = computed(() => userRole.value === 'CREATOR' || isAdmin.value);
  const isUser = computed(() => userRole.value === 'USER' || isCreator.value || isAdmin.value);
  const isGuest = computed(() => !authStore.isAuthenticated);

  // 权限检查方法
  function hasRole(roles: string | string[]): boolean {
    if (!userRole.value) return false;

    if (typeof roles === 'string') {
      return userRole.value === roles;
    }

    return roles.includes(userRole.value);
  }

  function hasAnyRole(roles: string[]): boolean {
    return hasRole(roles);
  }

  function hasAllRoles(roles: string[]): boolean {
    // 当前实现中，用户只能有一个角色
    if (!userRole.value || roles.length === 0) return false;
    if (roles.length === 1) return userRole.value === roles[0];
    return false;
  }

  return {
    userRole,
    isAdmin,
    isCreator,
    isUser,
    isGuest,
    hasRole,
    hasAnyRole,
    hasAllRoles,
  };
}
```

### 4.2 自定义指令

#### 4.2.1 v-permission 指令

用于基于权限控制元素的可见性：

```typescript
export const vPermission: ObjectDirective<HTMLElement, string | string[]> = {
  beforeMount(el, binding) {
    const authStore = useAuthStore();
    const { value, modifiers } = binding;
    const userRole = authStore.userRole;
    
    // 无权限直接隐藏元素
    if (!userRole) {
      el.style.display = 'none';
      return;
    }

    // 处理取反修饰符
    const hasNot = Object.keys(modifiers).includes('not');

    // 权限判断
    let hasPermission = false;
    if (typeof value === 'string') {
      hasPermission = userRole === value;
    } else if (Array.isArray(value)) {
      hasPermission = value.includes(userRole);
    }

    // 取反逻辑
    if (hasNot) {
      hasPermission = !hasPermission;
    }

    // 无权限则隐藏元素
    if (!hasPermission) {
      el.style.display = 'none';
    }
  },
};
```

#### 4.2.2 v-permission-btn 指令

用于禁用无权限的按钮，而不是隐藏：

```typescript
export const vPermissionBtn: ObjectDirective<HTMLElement, string | string[]> = {
  beforeMount(el, binding) {
    const authStore = useAuthStore();
    const { value, modifiers } = binding;
    const userRole = authStore.userRole;
    
    // 无权限直接禁用元素
    if (!userRole) {
      el.setAttribute('disabled', 'disabled');
      el.classList.add('disabled-btn');
      return;
    }

    // 检查权限 (与v-permission相似的逻辑)
    // ...

    // 无权限则禁用元素
    if (!hasPermission) {
      el.setAttribute('disabled', 'disabled');
      el.classList.add('disabled-btn');
    }
  },
};
```

### 4.3 使用示例

#### 4.3.1 在组件中使用 Hook

```vue
<script setup>
import { usePermission } from '@/composables/usePermission';

const { isAdmin, isCreator, hasRole } = usePermission();

function performAction() {
  if (isCreator.value) {
    // 创作者可以执行的操作
  }
}
</script>

<template>
  <div>
    <button v-if="isAdmin" @click="deleteVideo">删除视频</button>
    <button v-if="isCreator" @click="editVideo">编辑视频</button>
    <button v-if="hasRole(['ADMIN', 'CREATOR'])" @click="publishVideo">发布视频</button>
  </div>
</template>
```

#### 4.3.2 使用指令

```vue
<template>
  <!-- 仅管理员可见 -->
  <div v-permission="'ADMIN'">管理员面板</div>
  
  <!-- 创作者或管理员可见 -->
  <div v-permission="['CREATOR', 'ADMIN']">创作者工具</div>
  
  <!-- 非游客可见（取反修饰符） -->
  <div v-permission.not="'GUEST'">已登录用户可见内容</div>
  
  <!-- 非管理员禁用 -->
  <button v-permission-btn="'ADMIN'" @click="performAdminAction">管理员操作</button>
</template>
```

## 5. 路由权限控制

### 5.1 后端路由守卫

通过在控制器或方法上应用守卫和装饰器实现：

```typescript
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  // 所有方法都需要管理员权限
}
```

### 5.2 前端路由守卫

通过 Vue Router 的导航守卫实现：

```typescript
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // 检查路由是否需要认证
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'Login', query: { redirect: to.fullPath } });
  }
  
  // 检查路由是否需要特定角色
  if (to.meta.roles && to.meta.roles.length > 0) {
    const hasRole = to.meta.roles.includes(authStore.userRole);
    if (!hasRole) {
      return next({ name: 'Forbidden' });
    }
  }
  
  next();
});
```

## 6. 最佳实践

### 6.1 权限检查粒度

- **粗粒度**：基于整个控制器或路由组的权限检查
- **中粒度**：基于单个API端点或路由的权限检查
- **细粒度**：基于特定资源或操作的权限检查

### 6.2 前后端权限一致性

为确保前后端权限检查一致，我们：

1. 使用共享类型定义角色和权限
2. 后端严格执行所有权限检查
3. 前端主要用于UI展示优化，提升用户体验

### 6.3 安全最佳实践

1. 永远不要仅依赖前端权限检查
2. 所有敏感操作都必须在后端验证权限
3. 使用JWT过期时间控制会话生命周期
4. 实现刷新令牌机制，但确保安全存储

### 6.4 性能考虑

1. 缓存用户权限信息，减少数据库查询
2. 使用Redis缓存活跃用户的权限信息
3. 在JWT中包含基本权限信息，减少数据库查询

## 7. 未来规划

1. 实现更细粒度的权限控制
2. 添加基于资源的访问控制(RBAC)
3. 实现动态权限分配功能
4. 增加权限审计日志 