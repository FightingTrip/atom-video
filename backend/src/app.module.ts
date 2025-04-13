/**
 * 应用程序根模块
 *
 * 组织和导入所有子模块
 */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { VideoModule } from './modules/video/video.module';
import { CreatorModule } from './modules/creator/creator.module';
import { TagModule } from './modules/tag/tag.module';
import { InteractionModule } from './modules/interaction/interaction.module';
import { CommonModule } from './modules/common/common.module';

@Module({
  imports: [
    // 配置模块，处理环境变量和配置
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),

    // Prisma模块，处理数据库连接
    PrismaModule,

    // 业务模块
    CommonModule,
    AuthModule,
    UserModule,
    VideoModule,
    CreatorModule,
    TagModule,
    InteractionModule,
  ],
})
export class AppModule {}
