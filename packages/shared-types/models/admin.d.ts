/**
 * 管理员相关类型定义
 * 简化版本，保留基本功能
 */
import { ResourceType } from './permission';

/**
 * 系统设置类别枚举
 */
export enum SystemSettingCategory {
  SECURITY = 'SECURITY',
  CONTENT = 'CONTENT',
  USER = 'USER',
  NOTIFICATION = 'NOTIFICATION',
  APPEARANCE = 'APPEARANCE',
  INTEGRATION = 'INTEGRATION',
}

/**
 * 系统设置值类型枚举
 */
export enum SettingValueType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  JSON = 'JSON',
  ARRAY = 'ARRAY',
}

/**
 * 系统设置接口
 */
export interface ISystemSetting {
  id: string;
  key: string;
  value: string; // 存储序列化后的值
  valueType: SettingValueType;
  category: SystemSettingCategory;
  isPublic: boolean; // 是否可公开查看（无需管理员权限）
  description: string;
  lastModifiedBy: string; // 管理员ID
  createdAt: string;
  updatedAt: string;
}

/**
 * 内容审核规则接口
 */
export interface IContentModerationRule {
  id: string;
  name: string;
  resourceType: ResourceType;
  isEnabled: boolean;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  autoAction: 'FLAG' | 'HIDE' | 'DELETE';
  conditions: {
    keywords?: string[];
    patterns?: string[]; // 正则表达式
  };
  createdBy: string; // 管理员ID
  createdAt: string;
  updatedAt: string;
}

/**
 * 管理员操作日志接口
 */
export interface IAdminActionLog {
  id: string;
  adminId: string;
  actionType: string;
  resourceType: ResourceType;
  resourceId?: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

/**
 * 系统公告接口
 */
export interface ISystemAnnouncement {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  priority: 'LOW' | 'NORMAL' | 'HIGH';
  startDate: string;
  endDate?: string;
  createdBy: string; // 管理员ID
  createdAt: string;
  updatedAt: string;
}

/**
 * 举报处理接口
 */
export interface IReportResolution {
  id: string;
  reportId: string;
  resolvedBy: string; // 管理员ID
  resolution: 'APPROVED' | 'REJECTED';
  action: 'NO_ACTION' | 'CONTENT_REMOVED' | 'WARNING_ISSUED' | 'USER_SUSPENDED';
  feedback?: string; // 给举报者的反馈
  createdAt: string;
}
