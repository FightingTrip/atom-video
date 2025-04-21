/**
 * API请求工具
 * 提供简化的API接口，内部使用services/api实现
 */

import api from '@/services/api';
import { shouldUseMockData } from './mockUtils';

// 重新导出API服务
export default api;

// 导出mock模式检查
export const isMockMode = shouldUseMockData;
