/**
 * 订阅控制器
 *
 * 处理订阅相关的HTTP请求
 * @module subscription/controllers/subscription
 */

import {
  Controller,
  Post,
  Delete,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  NotFoundException,
  BadRequestException,
  HttpStatus,
  Logger,
  Req,
  ParseBoolPipe,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SubscriptionService } from '../services/subscription.service';
import { CreatorGuard } from '../../auth/guards/creator.guard';
import { User } from '../../auth/decorators/user.decorator';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
  CheckSubscriptionDto,
  SubscriptionResponseDto,
  PaginatedResponseDto,
  UserSubscriptionItemDto,
  SubscriberItemDto,
  SubscriptionStatusResponseDto,
} from '../dto';
import { SUBSCRIPTION_ROUTES } from '../routes';

/**
 * 订阅控制器类
 * 处理订阅相关的HTTP请求
 */
@ApiTags('订阅')
@Controller(SUBSCRIPTION_ROUTES.BASE)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SubscriptionController {
  private readonly logger = new Logger(SubscriptionController.name);

  constructor(private readonly subscriptionService: SubscriptionService) {}

  /**
   * 订阅创作者
   * @param userId 用户ID
   * @param subscriptionDto 订阅数据
   * @returns 订阅信息
   */
  @Post(SUBSCRIPTION_ROUTES.SUBSCRIBE)
  @ApiOperation({ summary: '订阅创作者' })
  @ApiBody({ type: CreateSubscriptionDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '订阅成功',
    type: SubscriptionResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效请求' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '创作者不存在' })
  async subscribe(@User('id') userId: string, @Body() subscriptionDto: CreateSubscriptionDto) {
    this.logger.log(
      `用户 ${userId} 请求订阅创作者 ${subscriptionDto.creatorId}, 通知设置: ${subscriptionDto.notificationEnabled}`
    );
    const subscription = await this.subscriptionService.subscribe(
      userId,
      subscriptionDto.creatorId,
      subscriptionDto.notificationEnabled
    );
    return {
      statusCode: HttpStatus.CREATED,
      message: '订阅成功',
      data: subscription,
    };
  }

  /**
   * 取消订阅创作者
   * @param userId 用户ID
   * @param creatorId 创作者ID
   * @returns 成功消息
   */
  @Delete(SUBSCRIPTION_ROUTES.UNSUBSCRIBE)
  @ApiOperation({ summary: '取消订阅创作者' })
  @ApiParam({ name: 'creatorId', description: '创作者ID' })
  @ApiResponse({ status: HttpStatus.OK, description: '取消订阅成功' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '未找到订阅记录' })
  async unsubscribe(@User('id') userId: string, @Param('creatorId') creatorId: string) {
    this.logger.log(`用户 ${userId} 请求取消订阅创作者 ${creatorId}`);
    await this.subscriptionService.unsubscribe(userId, creatorId);
    return {
      statusCode: HttpStatus.OK,
      message: '取消订阅成功',
    };
  }

  /**
   * 获取用户的订阅列表
   * @param userId 用户ID
   * @param page 页码
   * @param limit 每页数量
   * @returns 订阅列表及分页信息
   */
  @Get(SUBSCRIPTION_ROUTES.MY_SUBSCRIPTIONS)
  @ApiOperation({ summary: '获取当前用户的订阅列表' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: '页码' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: '每页数量' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取成功',
    type: PaginatedResponseDto,
  })
  async getMySubscriptions(
    @User('id') userId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    this.logger.log(`用户 ${userId} 请求获取订阅列表, 页码: ${page}, 数量: ${limit}`);
    const result = await this.subscriptionService.getUserSubscriptions(userId, page, limit);
    return {
      statusCode: HttpStatus.OK,
      message: '获取订阅列表成功',
      data: result.data,
      pagination: result.pagination,
    };
  }

  /**
   * 获取用户的订阅列表
   * @param userId 用户ID
   * @param page 页码
   * @param limit 每页数量
   * @returns 订阅列表及分页信息
   */
  @Get('user/:userId')
  @ApiOperation({ summary: '获取指定用户的订阅列表' })
  @ApiParam({ name: 'userId', description: '用户ID' })
  @ApiQuery({ name: 'page', description: '页码', required: false, type: Number })
  @ApiQuery({ name: 'limit', description: '每页数量', required: false, type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: '获取订阅列表成功' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '获取订阅列表失败' })
  async getUserSubscriptions(
    @Param('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    try {
      return await this.subscriptionService.getUserSubscriptions(userId, page, limit);
    } catch (error) {
      this.logger.error(`获取用户订阅列表失败: ${error.message}`, error.stack);
      throw new BadRequestException(`获取订阅列表失败: ${error.message}`);
    }
  }

  /**
   * 获取创作者的订阅者列表
   * @param creatorId 创作者ID
   * @param page 页码
   * @param limit 每页数量
   * @returns 订阅者列表及分页信息
   */
  @Get(SUBSCRIPTION_ROUTES.CREATOR_SUBSCRIBERS)
  @ApiOperation({ summary: '获取创作者的订阅者列表' })
  @ApiParam({ name: 'creatorId', description: '创作者ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: '页码' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: '每页数量' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取成功',
    type: PaginatedResponseDto,
  })
  async getCreatorSubscribers(
    @Param('creatorId') creatorId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    this.logger.log(`请求获取创作者 ${creatorId} 的订阅者列表, 页码: ${page}, 数量: ${limit}`);
    const result = await this.subscriptionService.getCreatorSubscribers(creatorId, page, limit);
    return {
      statusCode: HttpStatus.OK,
      message: '获取订阅者列表成功',
      data: result.data,
      pagination: result.pagination,
    };
  }

  /**
   * 获取创作者的订阅者数量
   */
  @Get(SUBSCRIPTION_ROUTES.CREATOR_SUBSCRIBER_COUNT)
  @ApiOperation({ summary: '获取创作者的订阅者数量' })
  @ApiParam({ name: 'creatorId', description: '创作者ID' })
  @ApiResponse({ status: HttpStatus.OK, description: '获取成功' })
  async getSubscriberCount(@Param('creatorId') creatorId: string) {
    this.logger.log(`请求获取创作者 ${creatorId} 的订阅者数量`);
    const count = await this.subscriptionService.getSubscriberCount(creatorId);
    return {
      statusCode: HttpStatus.OK,
      message: '获取订阅者数量成功',
      data: { count },
    };
  }

  /**
   * 获取我作为创作者的订阅者列表
   * @param req 请求对象
   * @param page 页码
   * @param limit 每页数量
   * @returns 订阅者列表及分页信息
   */
  @Get('my/subscribers')
  @UseGuards(JwtAuthGuard, CreatorGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取我的订阅者列表' })
  @ApiQuery({ name: 'page', description: '页码', required: false, type: Number })
  @ApiQuery({ name: 'limit', description: '每页数量', required: false, type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: '获取订阅者列表成功' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '获取订阅者列表失败' })
  async getMySubscribers(
    @Req() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    try {
      const creatorId = req.user.id;
      return await this.subscriptionService.getCreatorSubscribers(creatorId, page, limit);
    } catch (error) {
      this.logger.error(`获取订阅者列表失败: ${error.message}`, error.stack);
      throw new BadRequestException(`获取订阅者列表失败: ${error.message}`);
    }
  }

  /**
   * 检查订阅状态
   * @param userId 用户ID
   * @param creatorId 创作者ID
   * @returns 订阅状态
   */
  @Get(SUBSCRIPTION_ROUTES.CHECK_SUBSCRIPTION)
  @ApiOperation({ summary: '检查用户是否已订阅创作者' })
  @ApiParam({ name: 'creatorId', description: '创作者ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取成功',
    type: SubscriptionStatusResponseDto,
  })
  async checkSubscriptionStatus(@User('id') userId: string, @Param('creatorId') creatorId: string) {
    this.logger.log(`用户 ${userId} 请求检查对创作者 ${creatorId} 的订阅状态`);
    const status = await this.subscriptionService.checkSubscriptionStatus(userId, creatorId);
    return {
      statusCode: HttpStatus.OK,
      message: '获取订阅状态成功',
      data: status,
    };
  }

  /**
   * 更新订阅通知设置
   * @param userId 用户ID
   * @param creatorId 创作者ID
   * @param updateSubscriptionDto 更新订阅DTO
   * @returns 更新后的订阅信息
   */
  @Patch(SUBSCRIPTION_ROUTES.UPDATE_NOTIFICATION)
  @ApiOperation({ summary: '更新订阅通知设置' })
  @ApiParam({ name: 'creatorId', description: '创作者ID' })
  @ApiBody({ type: UpdateSubscriptionDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '更新成功',
    type: SubscriptionResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '未找到订阅记录' })
  async updateNotificationSettings(
    @User('id') userId: string,
    @Param('creatorId') creatorId: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto
  ) {
    this.logger.log(
      `用户 ${userId} 请求更新对创作者 ${creatorId} 的通知设置为 ${updateSubscriptionDto.notificationEnabled}`
    );
    await this.subscriptionService.updateNotificationSettings(
      userId,
      creatorId,
      updateSubscriptionDto.notificationEnabled
    );
    return {
      statusCode: HttpStatus.OK,
      message: '更新通知设置成功',
    };
  }
}
