/**
 * 用户控制器
 *
 * 处理用户相关的HTTP请求
 * @module user/controllers/user
 */

import { Controller, Get, Param, UseGuards, NotFoundException, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserService } from '../services/user.service';

/**
 * 用户控制器
 * 处理用户相关的HTTP请求
 */
@ApiTags('用户')
@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  /**
   * 构造函数，注入用户服务
   * @param userService 用户服务
   */
  constructor(private readonly userService: UserService) {}

  /**
   * 根据ID获取用户信息
   * @param id 用户ID
   * @returns 用户信息
   */
  @ApiOperation({ summary: '获取用户信息' })
  @ApiParam({ name: 'id', description: '用户ID' })
  @ApiResponse({ status: 200, description: '成功返回用户信息' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    try {
      return await this.userService.findById(id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`获取用户信息失败: ${error.message}`, error.stack);
      } else {
        this.logger.error(`获取用户信息失败: ${String(error)}`);
      }

      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('获取用户信息失败');
    }
  }
}
