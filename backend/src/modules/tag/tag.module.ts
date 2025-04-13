/**
 * 标签模块
 *
 * 提供标签管理功能
 * @module tag/tag.module
 */

import { Module } from '@nestjs/common';
import { TagController } from './controllers/tag.controller';
import { TagService } from './services/tag.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
