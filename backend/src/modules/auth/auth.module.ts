/**
 * 认证模块
 *
 * 管理用户认证、授权和身份验证功能
 */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { OAuthController } from './controllers/oauth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GitHubStrategy } from './strategies/github.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { PrismaModule } from '../../prisma/prisma.module';
import { RolesGuard } from './guards/roles.guard';
import { CreatorGuard } from './guards/creator.guard';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'super-secret'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1d'),
        },
      }),
    }),
    PrismaModule,
    UserModule,
  ],
  controllers: [AuthController, OAuthController],
  providers: [AuthService, JwtStrategy, GitHubStrategy, GoogleStrategy, RolesGuard, CreatorGuard],
  exports: [AuthService, JwtStrategy, RolesGuard, CreatorGuard],
})
export class AuthModule {}
