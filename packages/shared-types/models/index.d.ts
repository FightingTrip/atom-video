/**
 * 用户相关类型定义
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  CREATOR = 'CREATOR',
  VIEWER = 'VIEWER',
}

export enum ExperienceLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

export interface IUser {
  id: string;
  username: string;
  email: string;
  name?: string;
  bio?: string;
  avatarUrl?: string;
  role: UserRole;
  isVerified: boolean;

  // 开发者特有属性
  githubProfile?: string;
  stackOverflowProfile?: string;
  personalWebsite?: string;
  company?: string;
  position?: string;
  experienceLevel?: ExperienceLevel;

  // 内容创作相关
  isCreator: boolean;
  channelDescription?: string;
  channelBannerUrl?: string;

  createdAt: string;
  updatedAt: string;
}

export interface IUserProgrammingLanguage {
  id: string;
  userId: string;
  languageId: string;
  proficiencyLevel: number;
}

export interface IUserTechnology {
  id: string;
  userId: string;
  technologyId: string;
  proficiencyLevel: number;
}

/**
 * 视频相关类型定义
 */
export enum VideoVisibility {
  PUBLIC = 'PUBLIC',
  UNLISTED = 'UNLISTED',
  PRIVATE = 'PRIVATE',
  MEMBERS_ONLY = 'MEMBERS_ONLY',
}

export enum DifficultyLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

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

export interface IVideo {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  visibility: VideoVisibility;

  // 开发者特有属性
  difficultyLevel: DifficultyLevel;
  sourceCodeUrl?: string;
  liveDemo?: string;

  // 视频类型
  videoType: VideoType;

  // 内容元数据
  prerequisites?: string;
  learningOutcomes?: string;

  // 统计数据
  viewCount: number;
  likeCount: number;
  commentCount: number;

  // 关联
  creatorId: string;
  seriesId?: string;
  seriesOrder?: number;
  languageId?: string;

  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface IChapter {
  id: string;
  title: string;
  description?: string;
  startTime: number;
  endTime?: number;
  videoId: string;
  order: number;
}

export interface ISeries {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  difficultyLevel: DifficultyLevel;
  isComplete: boolean;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICertificate {
  id: string;
  userId: string;
  seriesId: string;
  issueDate: string;
  certificateUrl: string;
}

/**
 * 编程语言和技术相关类型定义
 */
export interface IProgrammingLanguage {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  createdAt: string;
  updatedAt: string;
}

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

export interface ITechnology {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  category: TechnologyCategory;
  createdAt: string;
  updatedAt: string;
}

/**
 * 播放列表相关类型定义
 */
export interface IPlaylist {
  id: string;
  title: string;
  description?: string;
  isPublic: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPlaylistVideo {
  id: string;
  playlistId: string;
  videoId: string;
  order: number;
}

/**
 * 标签和分类相关类型定义
 */
export interface ITag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 互动相关类型定义
 */
export interface IComment {
  id: string;
  content: string;
  isEdited: boolean;
  authorId: string;
  videoId: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICommentLike {
  id: string;
  commentId: string;
  userId: string;
  createdAt: string;
}

export interface ILike {
  id: string;
  videoId: string;
  userId: string;
  createdAt: string;
}

export interface ISubscription {
  id: string;
  subscriberId: string;
  creatorId: string;
  notificationsEnabled: boolean;
  createdAt: string;
}

export interface ISavedVideo {
  id: string;
  userId: string;
  videoId: string;
  createdAt: string;
}

/**
 * 学习进度相关类型定义
 */
export interface IWatchHistory {
  id: string;
  userId: string;
  videoId: string;
  lastWatchedAt: string;
}

export interface IVideoProgress {
  id: string;
  userId: string;
  videoId: string;
  currentTime: number;
  isCompleted: boolean;
  completedAt?: string;
  lastUpdated: string;
}

/**
 * 通知和活动相关类型定义
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

export interface INotification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  relatedVideoId?: string;
  relatedUserId?: string;
  relatedSeriesId?: string;
  createdAt: string;
}

export enum ActivityType {
  VIDEO_WATCH = 'VIDEO_WATCH',
  VIDEO_COMPLETE = 'VIDEO_COMPLETE',
  SERIES_COMPLETE = 'SERIES_COMPLETE',
  COMMENT = 'COMMENT',
  LIKE = 'LIKE',
  SUBSCRIBE = 'SUBSCRIBE',
  CERTIFICATE_EARNED = 'CERTIFICATE_EARNED',
}

export interface IUserActivity {
  id: string;
  userId: string;
  activityType: ActivityType;
  metadata: Record<string, any>;
  createdAt: string;
}

/**
 * 搜索和推荐相关类型定义
 */
export interface ISearchHistory {
  id: string;
  userId: string;
  query: string;
  createdAt: string;
}

export enum RecommendationReason {
  WATCH_HISTORY = 'WATCH_HISTORY',
  TECHNOLOGY_INTEREST = 'TECHNOLOGY_INTEREST',
  POPULAR_IN_CATEGORY = 'POPULAR_IN_CATEGORY',
  CONTINUATION_OF_SERIES = 'CONTINUATION_OF_SERIES',
  SIMILAR_USERS = 'SIMILAR_USERS',
  TRENDING = 'TRENDING',
}

export interface IRecommendation {
  id: string;
  userId: string;
  videoId: string;
  score: number;
  reason: RecommendationReason;
  isClicked: boolean;
  createdAt: string;
}

/**
 * 内容质量和审核相关类型定义
 */
export enum ReportReason {
  INCORRECT_INFORMATION = 'INCORRECT_INFORMATION',
  OUTDATED_CONTENT = 'OUTDATED_CONTENT',
  COPYRIGHT_VIOLATION = 'COPYRIGHT_VIOLATION',
  INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
  SPAM = 'SPAM',
  HARASSMENT = 'HARASSMENT',
}

export enum ReportStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

export interface IReport {
  id: string;
  reporterId: string;
  reason: ReportReason;
  description?: string;
  status: ReportStatus;
  videoId?: string;
  commentId?: string;
  userId?: string;
  moderatorId?: string;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IContentAccuracy {
  id: string;
  videoId: string;
  isUpToDate: boolean;
  lastVerifiedAt: string;
  versionInfo?: string;
  isDeprecated: boolean;
  deprecationNote?: string;
  updatedAt: string;
}

/**
 * 开发者问答和资源相关类型定义
 */
export interface IQuestion {
  id: string;
  title: string;
  content: string;
  videoId: string;
  authorId: string;
  isSolved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IAnswer {
  id: string;
  content: string;
  questionId: string;
  authorId: string;
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IAnswerVote {
  id: string;
  answerId: string;
  userId: string;
  isUpvote: boolean;
  createdAt: string;
}

export enum ResourceType {
  DOCUMENTATION = 'DOCUMENTATION',
  GITHUB_REPO = 'GITHUB_REPO',
  ARTICLE = 'ARTICLE',
  TOOL = 'TOOL',
  LIBRARY = 'LIBRARY',
  SAMPLE_PROJECT = 'SAMPLE_PROJECT',
  BOOK = 'BOOK',
  CHEAT_SHEET = 'CHEAT_SHEET',
}

export interface IResource {
  id: string;
  title: string;
  description?: string;
  resourceType: ResourceType;
  url: string;
  videoId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICodeSnippet {
  id: string;
  title: string;
  code: string;
  language: string;
  description?: string;
  startTime?: number;
  endTime?: number;
  videoId: string;
  createdAt: string;
  updatedAt: string;
}
