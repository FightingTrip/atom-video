/**
 * 通用类型和枚举定义
 * 该文件包含多个功能模块共用的基础类型
 */

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
 * 技术类别枚举
 */
export enum TechnologyCategory {
  FRAMEWORK = 'FRAMEWORK',
  LIBRARY = 'LIBRARY',
  TOOL = 'TOOL',
  DATABASE = 'DATABASE',
  CLOUD_SERVICE = 'CLOUD_SERVICE',
  DEVOPS = 'DEVOPS',
  TESTING = 'TESTING',
  MOBILE = 'MOBILE',
  WEB = 'WEB',
  GAME_DEV = 'GAME_DEV',
  AI_ML = 'AI_ML',
  BLOCKCHAIN = 'BLOCKCHAIN',
  IOT = 'IOT',
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
 * 设备类型枚举
 */
export enum DeviceType {
  DESKTOP = 'desktop',
  MOBILE = 'mobile',
  TABLET = 'tablet',
  TV = 'tv',
  CONSOLE = 'console',
  OTHER = 'other',
}
