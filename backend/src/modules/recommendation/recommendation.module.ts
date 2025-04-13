/**
 * 推荐系统模块
 *
 * 提供内容推荐功能
 * @module recommendation/recommendation.module
 */

import { Module } from '@nestjs/common';
import { RecommendationController } from './controllers/recommendation.controller';
import { RecommendationService } from './services/recommendation.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RecommendationController],
  providers: [RecommendationService],
  exports: [RecommendationService],
})
export class RecommendationModule {}
