/**
 * 评论控制器
 *
 * 处理评论相关的HTTP请求
 * @module interaction/controllers/comment
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
  ForbiddenException,
  Logger,
  ParseUUIDPipe,
  Req,
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
import {
  CommentService,
  CreateCommentDto,
  UpdateCommentDto,
  CommentQueryParams,
} from '../services/comment.service';
import { Request } from 'express';

/**
 * 评论控制器类
 * 处理评论相关的HTTP请求
 */
@ApiTags('评论')
@Controller('comments')
export class CommentController {
  private readonly logger = new Logger(CommentController.name);

  /**
   * 构造函数，注入评论服务
   * @param commentService 评论服务
   */
  constructor(private readonly commentService: CommentService) {}

  /**
   * 获取评论列表
   * @param queryParams 查询参数
   * @returns 评论列表
   */
  @Get()
  @ApiOperation({ summary: '获取评论列表', description: '获取评论列表，支持分页和过滤' })
  @ApiQuery({ name: 'videoId', required: false, description: '视频ID过滤' })
  @ApiQuery({ name: 'authorId', required: false, description: '作者ID过滤' })
  @ApiQuery({ name: 'parentId', required: false, description: '父评论ID，查询回复' })
  @ApiQuery({ name: 'page', required: false, description: '页码，默认1' })
  @ApiQuery({ name: 'limit', required: false, description: '每页数量，默认10' })
  @ApiResponse({ status: 200, description: '成功获取评论列表' })
  async getComments(@Query() queryParams: CommentQueryParams) {
    try {
      return await this.commentService.getComments(queryParams);
    } catch (error) {
      this.logger.error(`获取评论列表失败: ${error.message}`, error.stack);
      throw new BadRequestException(`获取评论列表失败: ${error.message}`);
    }
  }

  /**
   * 创建评论
   * @param createCommentDto 创建评论数据
   * @returns 创建的评论信息
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建评论', description: '创建新评论或回复' })
  @ApiBody({ type: Object, description: '评论数据' })
  @ApiResponse({ status: 201, description: '评论创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request & { user: { id: string } }
  ) {
    try {
      // 从认证用户中获取作者ID
      const authorId = req.user.id;

      const commentData = {
        ...createCommentDto,
        authorId,
      };

      return await this.commentService.createComment(commentData);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`创建评论失败: ${error.message}`, error.stack);
      throw new BadRequestException(`创建评论失败: ${error.message}`);
    }
  }

  /**
   * 更新评论
   * @param id 评论ID
   * @param updateCommentDto 更新数据
   * @returns 更新后的评论信息
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新评论', description: '根据ID更新评论内容' })
  @ApiParam({ name: 'id', description: '评论ID' })
  @ApiBody({ type: Object, description: '评论更新数据' })
  @ApiResponse({ status: 200, description: '评论更新成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 403, description: '无权限修改此评论' })
  @ApiResponse({ status: 404, description: '评论不存在' })
  async updateComment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: Request & { user: { id: string } }
  ) {
    try {
      // 从认证用户中获取用户ID
      const userId = req.user.id;

      return await this.commentService.updateComment(id, userId, updateCommentDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof ForbiddenException) {
        throw error;
      }
      this.logger.error(`更新评论失败: ${error.message}`, error.stack);
      throw new BadRequestException(`更新评论失败: ${error.message}`);
    }
  }

  /**
   * 删除评论
   * @param id 评论ID
   * @returns 成功消息
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除评论', description: '根据ID删除评论' })
  @ApiParam({ name: 'id', description: '评论ID' })
  @ApiResponse({ status: 200, description: '评论删除成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 403, description: '无权限删除此评论' })
  @ApiResponse({ status: 404, description: '评论不存在' })
  async deleteComment(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request & { user: { id: string } }
  ) {
    try {
      // 从认证用户中获取用户ID
      const userId = req.user.id;

      return await this.commentService.deleteComment(id, userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof ForbiddenException) {
        throw error;
      }
      this.logger.error(`删除评论失败: ${error.message}`, error.stack);
      throw new BadRequestException(`删除评论失败: ${error.message}`);
    }
  }
}
