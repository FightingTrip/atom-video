/**
 * 编程语言和技术相关类型定义
 */
import { TechnologyCategory } from './common';

/**
 * 编程语言接口
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

/**
 * 技术接口
 */
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
