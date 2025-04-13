/**
 * 数据模型类型定义索引文件
 * 导出所有模型子模块
 */

// 导出公共类型（基础类型和枚举）
export * from './common';

// 导出权限相关模型（许多模块依赖此模块）
export * from './permission';

// 导出内容质量相关模型（视频模块依赖此模块）
export * from './content';

// 导出用户相关模型
export * from './user';

// 导出视频相关模型
export * from './video';

// 导出互动相关模型
export * from './interaction';

// 导出播放列表相关模型
export * from './playlist';

// 导出标签和分类相关模型
export * from './tag';

// 导出学习路径相关模型
export * from './learning';

// 导出创作者相关模型
export * from './creator';

// 导出编程语言和技术相关模型
export * from './technology';

// 导出管理员相关模型
export * from './admin';
