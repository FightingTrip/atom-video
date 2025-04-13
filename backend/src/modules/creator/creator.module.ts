/**
 * 创作者模块
 */
import { Module } from '@nestjs/common';
import { BrandingController } from './controllers/branding.controller';
import { BrandingService } from './services/branding.service';

@Module({
  controllers: [BrandingController],
  providers: [BrandingService],
  exports: [BrandingService],
})
export class CreatorModule {}
