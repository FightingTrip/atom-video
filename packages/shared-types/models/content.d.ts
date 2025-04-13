/**
 * 内容质量和版本控制相关类型定义
 */

/**
 * 内容版本接口
 */
export interface IContentVersion {
  id: string;
  videoId: string;
  versionNumber: number;
  changeDescription: string;
  isCurrentVersion: boolean;
  technologyVersions: Record<string, string>;
  createdAt: string;
  publishedAt?: string;
}

/**
 * 内容准确性接口
 */
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
