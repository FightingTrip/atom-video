/**
 * 点赞控制器
 *
 * 处理点赞相关的HTTP请求
 * @module interaction/controllers/like
 */

import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  BadRequestException,
  NotFoundException,
  Logger,
  ParseUUIDPipe,
  Req,
  ConflictException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { LikeService, CreateLikeDto, CheckLikeStatusDto } from '../services/like.service';
import { Request } from 'express';

/**
 * 点赞控制器类
 * 处理点赞相关的HTTP请求
 */
@ApiTags('点赞')
@Controller('likes')
export class LikeController {
  private readonly logger = new Logger(LikeController.name);

  /**
   * 构造函数，注入点赞服务
   * @param likeService 点赞服务
   */
  constructor(private readonly likeService: LikeService) {}

  /**
   * 添加点赞
   * @param createLikeDto 创建点赞数据
   * @returns 创建的点赞信息
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '添加点赞', description: '为视频添加点赞' })
  @ApiBody({ type: Object, description: '点赞数据' })
  @ApiResponse({ status: 201, description: '点赞成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 409, description: '已经点赞过' })
  async addLike(
    @Body('videoId', ParseUUIDPipe) videoId: string,
    @Req() req: Request & { user: { id: string } }
  ) {
    try {
      // 从认证用户中获取用户ID
      const userId = req.user.id;

      const likeData: CreateLikeDto = {
        videoId,
        userId,
      };

      return await this.likeService.addLike(likeData);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`添加点赞失败: ${error.message}`, error.stack);
      throw new BadRequestException(`添加点赞失败: ${error.message}`);
    }
  }

  /**
   * 取消点赞
   * @param videoId 视频ID
   * @returns 成功消息
   */
  @Delete(':videoId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '取消点赞', description: '取消为视频的点赞' })
  @ApiParam({ name: 'videoId', description: '视频ID' })
  @ApiResponse({ status: 200, description: '取消点赞成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '未点赞或视频不存在' })
  async removeLike(
    @Param('videoId', ParseUUIDPipe) videoId: string,
    @Req() req: Request & { user: { id: string } }
  ) {
    try {
      // 从认证用户中获取用户ID
      const userId = req.user.id;

      return await this.likeService.removeLike(videoId, userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`取消点赞失败: ${error.message}`, error.stack);
      throw new BadRequestException(`取消点赞失败: ${error.message}`);
    }
  }

  /**
   * 检查点赞状态
   * @param videoId 视频ID
   * @returns 点赞状态
   */
  @Get('status/:videoId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '检查点赞状态', description: '检查用户是否已点赞视频' })
  @ApiParam({ name: 'videoId', description: '视频ID' })
  @ApiResponse({ status: 200, description: '成功获取点赞状态' })
  @ApiResponse({ status: 401, description: '未授权' })
  async checkLikeStatus(
    @Param('videoId', ParseUUIDPipe) videoId: string,
    @Req() req: Request & { user: { id: string } }
  ) {
    try {
      // 从认证用户中获取用户ID
      const userId = req.user.id;

      const checkStatusDto: CheckLikeStatusDto = {
        videoId,
        userId,
      };

      return await this.likeService.checkLikeStatus(checkStatusDto);
    } catch (error) {
      this.logger.error(`检查点赞状态失败: ${error.message}`, error.stack);
      throw new BadRequestException(`检查点赞状态失败: ${error.message}`);
    }
  }

  /**
   * 获取用户的所有点赞视频
   * @param page 页码
   * @param limit 每页数量
   * @returns 点赞的视频列表
   */
  @Get('user/videos')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取用户点赞的视频', description: '获取当前用户点赞的所有视频' })
  @ApiQuery({ name: 'page', required: false, description: '页码，默认1' })
  @ApiQuery({ name: 'limit', required: false, description: '每页数量，默认10' })
  @ApiResponse({ status: 200, description: '成功获取点赞的视频列表' })
  @ApiResponse({ status: 401, description: '未授权' })
  async getUserLikedVideos(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() req: Request & { user: { id: string } }
  ) {
    try {
      // 从认证用户中获取用户ID
      const userId = req.user.id;

      return await this.likeService.getUserLikedVideos(userId, page, limit);
    } catch (error) {
      this.logger.error(`获取用户点赞视频失败: ${error.message}`, error.stack);
      throw new BadRequestException(`获取用户点赞视频失败: ${error.message}`);
    }
  }
}
