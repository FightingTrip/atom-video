/**
 * 枚举类型定义
 * 从@atom/shared-types复制的本地版本，防止包解析问题
 */

/**
 * 用户角色枚举
 */
export enum UserRole {
  ADMIN = 'ADMIN', // 管理员
  MODERATOR = 'MODERATOR', // 版主
  CREATOR = 'CREATOR', // 已认证创作者
  VIEWER = 'VIEWER', // 普通用户
  GUEST = 'GUEST', // 游客（仅用于权限检查，数据库中不存储）
}

/**
 * 经验等级枚举
 */
export enum ExperienceLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

/**
 * 难度等级枚举
 * 用于视频、学习路径等内容的难度区分
 */
export enum DifficultyLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

/**
 * 视频可见性枚举
 */
export enum VideoVisibility {
  PUBLIC = 'PUBLIC',
  UNLISTED = 'UNLISTED',
  PRIVATE = 'PRIVATE',
  MEMBERS_ONLY = 'MEMBERS_ONLY',
}

/**
 * 视频类型枚举
 */
export enum VideoType {
  TUTORIAL = 'TUTORIAL',
  CODE_REVIEW = 'CODE_REVIEW',
  LIVE_CODING = 'LIVE_CODING',
  TECH_TALK = 'TECH_TALK',
  INTERVIEW = 'INTERVIEW',
  COURSE_MATERIAL = 'COURSE_MATERIAL',
  CONFERENCE_TALK = 'CONFERENCE_TALK',
  PRODUCT_DEMO = 'PRODUCT_DEMO',
}

/**
 * 内容资源类型枚举
 * 用于视频相关资源的类型区分
 */
export enum ContentResourceType {
  DOCUMENTATION = 'DOCUMENTATION',
  GITHUB_REPO = 'GITHUB_REPO',
  ARTICLE = 'ARTICLE',
  TOOL = 'TOOL',
  LIBRARY = 'LIBRARY',
  SAMPLE_PROJECT = 'SAMPLE_PROJECT',
  BOOK = 'BOOK',
  CHEAT_SHEET = 'CHEAT_SHEET',
}

/**
 * 通知类型枚举
 */
export enum NotificationType {
  NEW_VIDEO = 'NEW_VIDEO',
  NEW_SERIES = 'NEW_SERIES',
  COMMENT_REPLY = 'COMMENT_REPLY',
  SUBSCRIPTION = 'SUBSCRIPTION',
  CREATOR_ANNOUNCEMENT = 'CREATOR_ANNOUNCEMENT',
  ACHIEVEMENT = 'ACHIEVEMENT',
  MENTION = 'MENTION',
}

/**
 * 推荐原因枚举
 */
export enum RecommendationReason {
  WATCH_HISTORY = 'WATCH_HISTORY',
  TECHNOLOGY_INTEREST = 'TECHNOLOGY_INTEREST',
  POPULAR_IN_CATEGORY = 'POPULAR_IN_CATEGORY',
  CONTINUATION_OF_SERIES = 'CONTINUATION_OF_SERIES',
  SIMILAR_USERS = 'SIMILAR_USERS',
  TRENDING = 'TRENDING',
}
