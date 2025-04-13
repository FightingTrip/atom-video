/**
 * 内容审核员相关类型定义
 */
import { ResourceType } from './permission';
import { ReportReason, ReportStatus } from './interaction';

/**
 * 审核员类型枚举
 */
export enum ModeratorType {
  CONTENT_MODERATOR = 'CONTENT_MODERATOR', // 内容审核员
  COMMENT_MODERATOR = 'COMMENT_MODERATOR', // 评论审核员
  USER_MODERATOR = 'USER_MODERATOR', // 用户审核员
  SENIOR_MODERATOR = 'SENIOR_MODERATOR', // 高级审核员
}

/**
 * 审核员资格接口
 */
export interface IModeratorQualification {
  id: string;
  userId: string;
  moderatorType: ModeratorType;
  resourceTypes: ResourceType[]; // 可审核的资源类型
  assignedBy: string; // 管理员ID
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 内容违规类型枚举
 */
export enum ViolationType {
  INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
  HATE_SPEECH = 'HATE_SPEECH',
  HARASSMENT = 'HARASSMENT',
  MISINFORMATION = 'MISINFORMATION',
  COPYRIGHT_VIOLATION = 'COPYRIGHT_VIOLATION',
  SPAM = 'SPAM',
  VIOLENT_CONTENT = 'VIOLENT_CONTENT',
  IMPERSONATION = 'IMPERSONATION',
  PERSONAL_INFORMATION = 'PERSONAL_INFORMATION',
  OTHER = 'OTHER',
}

/**
 * 内容审核严重程度枚举
 */
export enum ViolationSeverity {
  LOW = 'LOW', // 轻微
  MEDIUM = 'MEDIUM', // 中等
  HIGH = 'HIGH', // 严重
  CRITICAL = 'CRITICAL', // 极为严重
}

/**
 * 内容审核操作枚举
 */
export enum ModerationAction {
  NO_ACTION = 'NO_ACTION', // 无需操作
  WARNING = 'WARNING', // 警告用户
  REMOVE_CONTENT = 'REMOVE_CONTENT', // 移除内容
  HIDE_CONTENT = 'HIDE_CONTENT', // 隐藏内容
  RESTRICT_USER = 'RESTRICT_USER', // 限制用户
  SUSPEND_USER = 'SUSPEND_USER', // 暂停用户
  BAN_USER = 'BAN_USER', // 封禁用户
  ESCALATE = 'ESCALATE', // 升级处理
}

/**
 * 内容审核决定接口
 */
export interface IModerationDecision {
  id: string;
  resourceType: ResourceType;
  resourceId: string;
  moderatorId: string;
  reportId?: string; // 关联的举报ID
  violationType: ViolationType;
  severity: ViolationSeverity;
  action: ModerationAction;
  reason: string;
  notes?: string; // 内部备注
  notifyUser: boolean;
  notificationMessage?: string;
  appealable: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 内容审核队列项接口
 */
export interface IModerationQueueItem {
  id: string;
  resourceType: ResourceType;
  resourceId: string;
  reportCount: number; // 举报次数
  latestReportId?: string;
  priority: number; // 优先级
  assignedTo?: string; // 审核员ID
  status: 'PENDING' | 'IN_REVIEW' | 'COMPLETED' | 'ESCALATED';
  createdAt: string;
  updatedAt: string;
}

/**
 * 审核统计接口
 */
export interface IModeratorStats {
  id: string;
  moderatorId: string;
  reviewCount: number;
  actionTaken: number;
  actionRate: number; // 百分比
  averageReviewTime: number; // 秒
  accuracyRate?: number; // 质量检查百分比
  period: 'DAY' | 'WEEK' | 'MONTH' | 'ALL_TIME';
  startDate: string;
  endDate: string;
  createdAt: string;
}

/**
 * 举报处理记录接口
 */
export interface IReportResolution {
  id: string;
  reportId: string;
  moderatorId: string;
  status: ReportStatus;
  reason: string;
  actionTaken: ModerationAction;
  notes?: string;
  feedbackToReporter?: string;
  processingTime: number; // 秒
  createdAt: string;
}

/**
 * 审核操作日志接口
 */
export interface IModerationActionLog {
  id: string;
  moderatorId: string;
  resourceType: ResourceType;
  resourceId: string;
  action: ModerationAction;
  reason: ViolationType;
  details: string;
  ipAddress: string;
  createdAt: string;
}

/**
 * 质量检查接口
 * 用于检查审核员的决定
 */
export interface IModerationQualityCheck {
  id: string;
  moderationDecisionId: string;
  reviewedBy: string; // 高级审核员ID
  isCorrect: boolean;
  feedback: string;
  correctedAction?: ModerationAction;
  createdAt: string;
}

/**
 * 自动审核规则接口
 */
export interface IAutoModerationRule {
  id: string;
  name: string;
  description: string;
  resourceType: ResourceType;
  isEnabled: boolean;
  violationType: ViolationType;
  severity: ViolationSeverity;
  action: ModerationAction;
  conditions: string; // JSON格式的条件
  createdBy: string; // 审核员或管理员ID
  createdAt: string;
  updatedAt: string;
}

/**
 * 审核标签接口
 * 用于给举报和审核决定添加标签
 */
export interface IModerationTag {
  id: string;
  name: string;
  description: string;
  color: string;
  createdBy: string;
  createdAt: string;
}

/**
 * 审核权限接口
 */
export interface IModeratorPermission {
  id: string;
  moderatorId: string;
  canRemoveContent: boolean;
  canSuspendUsers: boolean;
  canBanUsers: boolean;
  canHandleAppeals: boolean;
  canCreateAutoRules: boolean;
  canAssignTasks: boolean;
  canReviewOtherModerators: boolean;
  resourceTypes: ResourceType[];
  updatedAt: string;
}
