/**
 * 收藏功能模块
 *
 * 处理视频收藏相关功能
 * @module favorite/favorite.module
 */

import { Module } from '@nestjs/common';
import { FavoriteService } from './services/favorite.service';
import { FavoriteController } from './controllers/favorite.controller';
import { PrismaModule } from '../../prisma/prisma.module';

/**
 * 收藏模块类
 */
@Module({
  imports: [PrismaModule],
  controllers: [FavoriteController],
  providers: [FavoriteService],
  exports: [FavoriteService],
})
export class FavoriteModule {}
