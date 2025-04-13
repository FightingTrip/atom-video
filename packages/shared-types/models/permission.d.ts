/**
 * 权限相关类型定义
 * 简化版本，保留基础结构以供未来扩展
 */

/**
 * 资源类型枚举
 * 定义系统中可访问的资源类型
 */
export enum ResourceType {
  VIDEO = 'VIDEO',
  SERIES = 'SERIES',
  COMMENT = 'COMMENT',
  USER = 'USER',
  CREATOR_PROFILE = 'CREATOR_PROFILE',
  PLAYLIST = 'PLAYLIST',
  TAG = 'TAG',
  CATEGORY = 'CATEGORY',
  SYSTEM_SETTINGS = 'SYSTEM_SETTINGS',
}

/**
 * 操作类型枚举
 * 定义对资源可执行的操作类型
 */
export enum OperationType {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  PUBLISH = 'PUBLISH',
  UNPUBLISH = 'UNPUBLISH',
  FEATURE = 'FEATURE',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  BAN = 'BAN',
}

/**
 * 权限定义接口
 * 基础版本，用于定义角色可执行的操作
 */
export interface IPermission {
  id: string;
  role: string;
  resourceType: ResourceType;
  operations: OperationType[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 资源所有权接口
 * 定义用户对特定资源的所有权
 */
export interface IResourceOwnership {
  id: string;
  userId: string;
  resourceType: ResourceType;
  resourceId: string;
  createdAt: string;
}

/**
 * 权限审计日志接口
 * 记录权限变更历史
 */
export interface IPermissionAuditLog {
  id: string;
  userId: string; // 变更发起者
  targetUserId?: string; // 变更目标用户
  action: 'GRANT' | 'REVOKE';
  resourceType: ResourceType;
  operations: OperationType[];
  details: string; // 变更详情
  createdAt: string;
}
