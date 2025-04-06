/**
 * @file video.ts
 * @description 视频相关的类型定义
 * @author Atom Video Team
 * @date 2025-04-06
 */
// 视频状态
export var VideoStatus;
(function (VideoStatus) {
    VideoStatus["DRAFT"] = "draft";
    VideoStatus["PROCESSING"] = "processing";
    VideoStatus["PUBLISHED"] = "published";
    VideoStatus["PRIVATE"] = "private";
    VideoStatus["DELETED"] = "deleted";
})(VideoStatus || (VideoStatus = {}));
// 视频分类
export var VideoCategory;
(function (VideoCategory) {
    VideoCategory["ENTERTAINMENT"] = "entertainment";
    VideoCategory["EDUCATION"] = "education";
    VideoCategory["GAMING"] = "gaming";
    VideoCategory["MUSIC"] = "music";
    VideoCategory["SPORTS"] = "sports";
    VideoCategory["TECH"] = "tech";
    VideoCategory["OTHER"] = "other";
})(VideoCategory || (VideoCategory = {}));
// 导出其他类型
export * from './index';
//# sourceMappingURL=video.js.map