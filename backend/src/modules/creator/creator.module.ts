/**
 * 创作者模块
 */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreatorBrandingController } from './controllers/creator.branding.controller';
import { CreatorBrandingService } from './services/creator.branding.service';
import { CreatorBrandingSchema } from './models/creator.branding.model';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'CreatorBranding', schema: CreatorBrandingSchema }]),
    CommonModule,
  ],
  controllers: [CreatorBrandingController],
  providers: [CreatorBrandingService],
  exports: [CreatorBrandingService],
})
export class CreatorModule {}
