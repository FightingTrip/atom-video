/**
 * 应用程序根模块
 *
 * 组织和导入所有子模块
 */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
// @ts-ignore 模块存在但TypeScript无法解析
import { PrismaModule } from './prisma/prisma.module';
// @ts-ignore 模块存在但TypeScript无法解析
import { AuthModule } from './modules/auth/auth.module';
// @ts-ignore 模块存在但TypeScript无法解析
import { UserModule } from './modules/user/user.module';
// @ts-ignore 模块存在但TypeScript无法解析
import { CommonModule } from './modules/common/common.module';
import { VideoModule } from './modules/video/video.module';
import { InteractionModule } from './modules/interaction/interaction.module';

/**
 * 应用程序根模块
 * 组织和导入所有子模块
 */
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
    UserModule,
    AuthModule,
    VideoModule,
    InteractionModule,
  ],
})
export class AppModule {}
