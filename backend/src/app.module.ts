/**
 * 应用程序主模块
 *
 * @module app.module
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { VideoModule } from './modules/video/video.module';
import { InteractionModule } from './modules/interaction/interaction.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { NotificationModule } from './modules/notification/notification.module';
import { SearchModule } from './modules/search/search.module'; // 新增搜索模块
import { RecommendationModule } from './modules/recommendation/recommendation.module'; // 新增推荐系统模块
import { TagModule } from './modules/tag/tag.module'; // 新增标签模块
import { CommonModule } from './modules/common/common.module';
import { FavoriteModule } from './modules/favorite/favorite.module';
import { SharedModule } from './shared/shared.module'; // 新增共享模块

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    PrismaModule,
    SharedModule, // 注册共享模块
    AuthModule,
    UserModule,
    VideoModule,
    InteractionModule,
    SubscriptionModule,
    NotificationModule,
    SearchModule, // 注册搜索模块
    RecommendationModule, // 注册推荐系统模块
    TagModule, // 注册标签模块
    CommonModule,
    FavoriteModule,
  ],
})
export class AppModule {}
