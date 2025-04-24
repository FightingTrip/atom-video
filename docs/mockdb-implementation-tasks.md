# MockDb实现任务清单

以下是需要在MockDb类中实现的所有方法的清单，按模块分类。

## 通用方法

- [x] `generateId(prefix: string): string` - 生成随机ID
- [x] `login(username: string, password: string): { success: boolean; token?: string; user?: User; error?: string }` - 用户登录
- [x] `register(userData): { success: boolean; message?: string; error?: string }` - 用户注册
- [x] `getUserIdFromToken(token: string): string | null` - 从令牌中获取用户ID

## 管理员模块

- [x] `getDashboardStats(): {...}` - 获取仪表盘统计数据
- [x] `getRecentActivities(limit?: number): Activity[]` - 获取最近活动
- [x] `getVideos(params): {...}` - 获取视频列表
- [x] `getVideoById(id: string): Video | null` - 获取视频详情
- [x] `getUsers(params?: {...}): User[]` - 获取用户列表
- [x] `getUserById(id: string): User | null` - 获取用户详情
- [ ] `updateUser(id: string, data: Partial<User>): { success: boolean; user?: User; error?: string }` - 更新用户
- [ ] `deleteUser(id: string): { success: boolean; message?: string; error?: string }` - 删除用户
- [x] `getComments(params?: {...}): {...}` - 获取评论列表
- [x] `getCommentById(id: string): Comment | null` - 获取评论详情
- [x] `getReports(params?: {...}): {...}` - 获取举报列表
- [x] `getReportById(id: string): Report | null` - 获取举报详情
- [ ] `handleReport(id: string, data: { status: string; resolution?: string }): { success: boolean; message?: string; error?: string }` - 处理举报

## 视频模块

- [ ] `getTrendingVideos(limit?: number): Video[]` - 获取热门视频
- [ ] `getRecommendedVideos(params: { page?: number; limit?: number }): { data: Video[]; total: number }` - 获取推荐视频
- [ ] `addVideoView(id: string): void` - 添加视频浏览记录
- [ ] `getRelatedVideos(id: string, limit?: number): Video[]` - 获取相关视频
- [ ] `getVideoInteraction(userId: string, videoId: string): { isLiked: boolean; isFavorited: boolean; isSubscribed: boolean }` - 获取视频互动状态
- [ ] `toggleVideoLike(userId: string, videoId: string): boolean` - 切换视频点赞状态
- [ ] `toggleVideoFavorite(userId: string, videoId: string): boolean` - 切换视频收藏状态
- [ ] `getVideoComments(videoId: string, params: { page?: number; limit?: number; sort?: 'newest' | 'oldest' | 'popular' }): { data: Comment[]; total: number }` - 获取视频评论
- [ ] `addComment(userId: string, videoId: string, content: string, parentId?: string): Comment` - 添加评论
- [ ] `saveVideoProgress(userId: string, videoId: string, currentTime: number, duration: number): void` - 保存视频观看进度
- [ ] `getVideoProgress(userId: string, videoId: string): { currentTime: number; duration: number; percentage: number } | null` - 获取视频观看进度
- [ ] `getUserHistory(userId: string, params: { page?: number; limit?: number }): { data: Video[]; total: number }` - 获取用户观看历史
- [ ] `addReport(userId: string, type: string, targetId: string, reason: string, description?: string): Report` - 添加举报

## 创作者模块

- [ ] `getCreatorStats(userId: string): {...}` - 获取创作者统计数据
- [ ] `getCreatorVideos(userId: string, params: {...}): { data: Video[]; total: number }` - 获取创作者视频列表
- [ ] `getCreatorVideoById(userId: string, videoId: string): Video | null` - 获取创作者视频详情
- [ ] `updateCreatorVideo(userId: string, videoId: string, data: Partial<Video>): { success: boolean; video?: Video; error?: string }` - 更新创作者视频
- [ ] `deleteCreatorVideo(userId: string, videoId: string): { success: boolean; error?: string }` - 删除创作者视频
- [ ] `getVideoAnalytics(userId: string, videoId: string): {...} | null` - 获取视频分析数据
- [ ] `getCreatorVideoComments(userId: string, videoId: string, params: { page?: number; limit?: number }): { data: Comment[]; total: number }` - 获取创作者视频评论
- [ ] `getCreatorChannel(userId: string): {...}` - 获取创作者频道设置
- [ ] `updateCreatorChannel(userId: string, data: any): any` - 更新创作者频道设置
- [ ] `getCreatorRevenue(userId: string, period: 'day' | 'week' | 'month' | 'year'): { labels: string[]; data: number[]; total: number }` - 获取创作者收入数据

## 用户模块

- [ ] `updateUser(userId: string, data: Partial<User>): { success: boolean; user?: User; error?: string }` - 更新用户信息
- [ ] `getUserFavorites(userId: string, params: { page?: number; limit?: number }): { data: Video[]; total: number }` - 获取用户收藏列表
- [ ] `getUserLikes(userId: string, params: { page?: number; limit?: number }): { data: Video[]; total: number }` - 获取用户点赞列表
- [ ] `getUserComments(userId: string, params: { page?: number; limit?: number }): { data: Comment[]; total: number }` - 获取用户评论列表
- [ ] `getUserSubscriptions(userId: string, params: { page?: number; limit?: number }): { data: User[]; total: number }` - 获取用户关注列表
- [ ] `toggleSubscription(userId: string, targetUserId: string): boolean` - 切换关注状态
- [ ] `getUserNotifications(userId: string, params: { page?: number; limit?: number }): { data: Notification[]; total: number }` - 获取用户通知
- [ ] `markNotificationRead(userId: string, notificationId: string): { success: boolean; error?: string }` - 标记通知为已读
- [ ] `markAllNotificationsRead(userId: string): void` - 标记所有通知为已读
- [ ] `changePassword(userId: string, currentPassword: string, newPassword: string): { success: boolean; error?: string }` - 修改密码

## 播放列表模块

- [x] `getUserPlaylists(userId: string, params: { page?: number; limit?: number; search?: string; visibility?: 'public' | 'private' | 'unlisted' | 'all' }): { data: Playlist[]; total: number }` - 获取用户播放列表
- [x] `getPlaylistById(id: string): Playlist | null` - 获取播放列表详情
- [x] `getPlaylistVideos(playlistId: string, params: { page?: number; limit?: number }): { data: Video[]; total: number }` - 获取播放列表中的视频
- [x] `createPlaylist(userId: string, data: { title: string; description?: string; visibility: 'public' | 'private' | 'unlisted'; videoIds?: string[] }): Playlist` - 创建播放列表
- [x] `updatePlaylist(playlistId: string, userId: string, data: Partial<Playlist>): { success: boolean; playlist?: Playlist; error?: string }` - 更新播放列表
- [x] `deletePlaylist(playlistId: string, userId: string): { success: boolean; error?: string }` - 删除播放列表
- [x] `addVideoToPlaylist(playlistId: string, userId: string, videoId: string): { success: boolean; error?: string }` - 添加视频到播放列表
- [x] `removeVideoFromPlaylist(playlistId: string, userId: string, videoId: string): { success: boolean; error?: string }` - 从播放列表中移除视频
- [x] `reorderPlaylistVideos(playlistId: string, userId: string, videoIds: string[]): { success: boolean; error?: string }` - 重新排序播放列表视频

## 实施计划

1. ✅ 优先实现通用方法和认证相关方法
2. ✅ 实现视频模块的方法
3. ✅ 实现用户模块的方法
4. ✅ 实现播放列表模块的方法 
5. ⬜ 实现通知系统和搜索增强功能
6. ⬜ 实现数据导出功能
7. ⬜ 实现管理员模块剩余的方法

## 注意事项

- 实现过程中需要保持数据一致性，例如在更新视频时更新相关的用户视频计数
- 建议为所有模拟数据都生成唯一的ID（区分不同类型的实体）
- 方法实现时应考虑参数验证和错误处理
- 添加适当的注释，说明方法的作用和实现逻辑 