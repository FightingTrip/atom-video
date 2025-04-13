/**
 * 订阅模块
 *
 * 处理视频平台用户订阅相关功能
 * @module subscription/subscription.module
 */

import { Module } from '@nestjs/common';
import { SubscriptionService } from './services/subscription.service';
import { SubscriptionController } from './controllers/subscription.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserModule } from '../user/user.module';

/**
 * 订阅模块类
 *
 * 包含订阅相关的控制器和服务
 */
@Module({
  imports: [
    PrismaModule,
    UserModule, // 用于用户验证和信息检索
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService], // 导出服务以供其他模块使用
})
export class SubscriptionModule {}
