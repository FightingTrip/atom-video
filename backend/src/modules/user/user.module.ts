/**
 * 用户模块
 *
 * 提供用户相关的功能
 * @module user/user.module
 */

import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
