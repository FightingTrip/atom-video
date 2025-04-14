/**
 * 收藏功能控制器
 *
 * 处理收藏相关的API请求
 * @module favorite/controllers/favorite.controller
 */

import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  HttpStatus,
  BadRequestException,
  Logger,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { User } from '../../auth/decorators/user.decorator';
import { FavoriteService } from '../services/favorite.service';
import {
  CreateFavoriteDto,
  UpdateFavoriteDto,
  BulkCheckFavoriteDto,
  FavoriteResponseDto,
  FavoriteStatusResponseDto,
} from '../dto/favorite.dto';

/**
 * 收藏控制器类
 */
@ApiTags('收藏')
@Controller('favorites')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FavoriteController {
  private readonly logger = new Logger(FavoriteController.name);

  constructor(private readonly favoriteService: FavoriteService) {}

  /**
   * 收藏视频
   */
  @Post()
  @ApiOperation({ summary: '收藏视频' })
  @ApiBody({ type: CreateFavoriteDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '收藏成功',
    type: FavoriteResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效请求' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '视频不存在' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: '已经收藏过该视频' })
  async addFavorite(@User('id') userId: string, @Body() createFavoriteDto: CreateFavoriteDto) {
    this.logger.log(`用户 ${userId} 请求收藏视频 ${createFavoriteDto.videoId}`);
    const favorite = await this.favoriteService.addFavorite(userId, createFavoriteDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: '收藏成功',
      data: favorite,
    };
  }

  /**
   * 取消收藏
   */
  @Delete(':id')
  @ApiOperation({ summary: '取消收藏' })
  @ApiParam({ name: 'id', description: '收藏ID' })
  @ApiResponse({ status: HttpStatus.OK, description: '取消收藏成功' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '收藏记录不存在' })
  async removeFavorite(@User('id') userId: string, @Param('id') favoriteId: string) {
    this.logger.log(`用户 ${userId} 请求取消收藏 ${favoriteId}`);
    const result = await this.favoriteService.removeFavorite(userId, favoriteId);
    return {
      statusCode: HttpStatus.OK,
      message: result.message,
    };
  }

  /**
   * 更新收藏
   */
  @Patch(':id')
  @ApiOperation({ summary: '更新收藏备注或收藏夹' })
  @ApiParam({ name: 'id', description: '收藏ID' })
  @ApiBody({ type: UpdateFavoriteDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '更新成功',
    type: FavoriteResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '收藏记录不存在' })
  async updateFavorite(
    @User('id') userId: string,
    @Param('id') favoriteId: string,
    @Body() updateFavoriteDto: UpdateFavoriteDto
  ) {
    this.logger.log(`用户 ${userId} 请求更新收藏 ${favoriteId}`);
    const favorite = await this.favoriteService.updateFavorite(
      userId,
      favoriteId,
      updateFavoriteDto
    );
    return {
      statusCode: HttpStatus.OK,
      message: '更新收藏成功',
      data: favorite,
    };
  }

  /**
   * 获取当前用户的收藏列表
   */
  @Get('my')
  @ApiOperation({ summary: '获取当前用户的收藏列表' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: '页码' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: '每页数量' })
  @ApiQuery({ name: 'collectionId', required: false, type: String, description: '收藏夹ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取成功',
  })
  async getMyFavorites(
    @User('id') userId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('collectionId') collectionId?: string
  ) {
    this.logger.log(`用户 ${userId} 请求获取收藏列表, 页码: ${page}, 数量: ${limit}`);
    const result = await this.favoriteService.getUserFavorites(userId, page, limit, collectionId);
    return {
      statusCode: HttpStatus.OK,
      message: '获取收藏列表成功',
      data: result.data,
      pagination: result.pagination,
    };
  }

  /**
   * 检查视频是否已收藏
   */
  @Get('check/:videoId')
  @ApiOperation({ summary: '检查视频是否已收藏' })
  @ApiParam({ name: 'videoId', description: '视频ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '检查成功',
    type: FavoriteStatusResponseDto,
  })
  async checkVideoFavorited(@User('id') userId: string, @Param('videoId') videoId: string) {
    this.logger.log(`用户 ${userId} 请求检查视频 ${videoId} 是否已收藏`);
    const result = await this.favoriteService.checkVideoFavorited(userId, videoId);
    return {
      statusCode: HttpStatus.OK,
      message: '检查收藏状态成功',
      data: result,
    };
  }

  /**
   * 批量检查视频是否已收藏
   */
  @Post('bulk-check')
  @ApiOperation({ summary: '批量检查视频是否已收藏' })
  @ApiBody({ type: BulkCheckFavoriteDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '检查成功',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: '批量检查收藏状态成功' },
        data: {
          type: 'object',
          additionalProperties: {
            type: 'object',
            properties: {
              isFavorited: { type: 'boolean' },
              favoriteId: { type: 'string', nullable: true },
              collectionId: { type: 'string', nullable: true },
            },
          },
        },
      },
    },
  })
  async bulkCheckFavoriteStatus(@User('id') userId: string, @Body() dto: BulkCheckFavoriteDto) {
    this.logger.log(`用户 ${userId} 请求批量检查收藏状态，视频数量: ${dto.videoIds.length}`);
    const result = await this.favoriteService.bulkCheckFavoriteStatus(userId, dto.videoIds);
    return {
      statusCode: HttpStatus.OK,
      message: '批量检查收藏状态成功',
      data: result,
    };
  }
}
