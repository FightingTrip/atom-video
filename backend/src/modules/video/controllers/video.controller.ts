/**
 * 视频控制器
 *
 * 处理视频相关的API请求
 * @module video/controllers/video
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  BadRequestException,
  NotFoundException,
  Logger,
  ParseUUIDPipe,
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
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import {
  VideoService,
  CreateVideoDto,
  UpdateVideoDto,
  VideoQueryParams,
} from '../services/video.service';
import { UserRole } from '../../../models/enums';
import { formatError } from '../../../utils/error-handler.util';

/**
 * 视频控制器类
 * 处理视频相关的HTTP请求
 */
@ApiTags('视频')
@Controller('videos')
export class VideoController {
  private readonly logger = new Logger(VideoController.name);

  /**
   * 构造函数，注入视频服务
   * @param videoService 视频服务
   */
  constructor(private readonly videoService: VideoService) {}

  /**
   * 获取视频列表
   * @param queryParams 查询参数
   * @returns 视频列表
   */
  @Get()
  @ApiOperation({ summary: '获取视频列表', description: '获取视频列表，支持分页和过滤' })
  @ApiQuery({ name: 'page', required: false, description: '页码，默认1' })
  @ApiQuery({ name: 'limit', required: false, description: '每页数量，默认10' })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: '排序方式：newest, oldest, popular, views',
  })
  @ApiQuery({ name: 'searchTerm', required: false, description: '搜索关键词' })
  @ApiQuery({ name: 'creatorId', required: false, description: '创作者ID过滤' })
  @ApiQuery({ name: 'videoType', required: false, description: '视频类型过滤' })
  @ApiQuery({ name: 'difficultyLevel', required: false, description: '难度级别过滤' })
  @ApiResponse({ status: 200, description: '成功获取视频列表' })
  async getVideos(@Query() queryParams: VideoQueryParams) {
    try {
      return await this.videoService.getVideos(queryParams);
    } catch (error: unknown) {
      const { message, stack } = formatError(error);
      this.logger.error(`获取视频列表失败: ${message}`, stack);
      throw new BadRequestException(`获取视频列表失败: ${message}`);
    }
  }

  /**
   * 获取视频详情
   * @param id 视频ID
   * @returns 视频详情
   */
  @Get(':id')
  @ApiOperation({ summary: '获取视频详情', description: '根据ID获取视频详细信息' })
  @ApiParam({ name: 'id', description: '视频ID' })
  @ApiResponse({ status: 200, description: '成功获取视频信息' })
  @ApiResponse({ status: 404, description: '视频不存在' })
  async getVideoById(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await this.videoService.getVideoById(id);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const { message, stack } = formatError(error);
      this.logger.error(`获取视频详情失败: ${message}`, stack);
      throw new BadRequestException(`获取视频详情失败: ${message}`);
    }
  }

  /**
   * 创建视频
   * @param createVideoDto 创建视频数据
   * @returns 创建的视频信息
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CREATOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建视频', description: '创建新视频' })
  @ApiBody({ type: Object, description: '视频数据' })
  @ApiResponse({ status: 201, description: '视频创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 403, description: '无权限创建视频' })
  async createVideo(@Body() createVideoDto: CreateVideoDto) {
    try {
      return await this.videoService.createVideo(createVideoDto);
    } catch (error: unknown) {
      const { message, stack } = formatError(error);
      this.logger.error(`创建视频失败: ${message}`, stack);
      throw new BadRequestException(`创建视频失败: ${message}`);
    }
  }

  /**
   * 更新视频
   * @param id 视频ID
   * @param updateVideoDto 更新数据
   * @returns 更新后的视频信息
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CREATOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新视频', description: '根据ID更新视频信息' })
  @ApiParam({ name: 'id', description: '视频ID' })
  @ApiBody({ type: Object, description: '视频更新数据' })
  @ApiResponse({ status: 200, description: '视频更新成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '视频不存在' })
  async updateVideo(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVideoDto: UpdateVideoDto
  ) {
    try {
      return await this.videoService.updateVideo(id, updateVideoDto);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const { message, stack } = formatError(error);
      this.logger.error(`更新视频失败: ${message}`, stack);
      throw new BadRequestException(`更新视频失败: ${message}`);
    }
  }

  /**
   * 删除视频
   * @param id 视频ID
   * @returns 成功消息
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CREATOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除视频', description: '根据ID删除视频' })
  @ApiParam({ name: 'id', description: '视频ID' })
  @ApiResponse({ status: 200, description: '视频删除成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '视频不存在' })
  async deleteVideo(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await this.videoService.deleteVideo(id);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const { message, stack } = formatError(error);
      this.logger.error(`删除视频失败: ${message}`, stack);
      throw new BadRequestException(`删除视频失败: ${message}`);
    }
  }
}
