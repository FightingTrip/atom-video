/**
 * 模块类型声明
 */

declare module './prisma/prisma.module' {
  export class PrismaModule {}
}

declare module './modules/auth/auth.module' {
  export class AuthModule {}
}

declare module './modules/user/user.module' {
  export class UserModule {}
}

declare module './modules/common/common.module' {
  export class CommonModule {}
}

declare module './modules/video/video.module' {
  export class VideoModule {}
}

declare module './modules/interaction/interaction.module' {
  export class InteractionModule {}
}

declare module './modules/subscription/subscription.module' {
  export class SubscriptionModule {}
}

declare module './modules/notification/notification.module' {
  export class NotificationModule {}
}

declare module './modules/search/search.module' {
  export class SearchModule {}
}

declare module './modules/recommendation/recommendation.module' {
  export class RecommendationModule {}
}

declare module './modules/tag/tag.module' {
  export class TagModule {}
}
