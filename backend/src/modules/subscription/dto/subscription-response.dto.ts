/**
 * 订阅响应DTO
 * 
 * 用于规范订阅模块的API响应格式
 * @module subscription/dto/subscription-response.dto
 */

import { ApiProperty } from '@nestjs/swagger';

/**
 * 订阅基础信息
 */
export class SubscriptionResponseDto {
  @ApiProperty({ description: '订阅ID' })
  id: string;

  @ApiProperty({ description: '用户ID' })
  userId: string;

  @ApiProperty({ description: '创作者ID' })
  creatorId: string;

  @ApiProperty({ description: '是否启用通知' })
  notificationEnabled: boolean;

  @ApiProperty({ description: '订阅创建时间' })
  subscribedAt: Date;
}

/**
 * 订阅状态响应
 */
export class SubscriptionStatusResponseDto {
  @ApiProperty({ description: '是否已订阅' })
  isSubscribed: boolean;

  @ApiProperty({ description: '是否启用通知', nullable: true })
  notificationEnabled: boolean | null;

  @ApiProperty({ description: '订阅时间', nullable: true })
  subscribedAt: Date | null;
}

/**
 * 创作者信息基础类
 */
class CreatorInfoDto {
  @ApiProperty({ description: '创作者ID' })
  id: string;

  @ApiProperty({ description: '创作者用户名' })
  username: string;

  @ApiProperty({ description: '创作者头像', nullable: true })
  avatar?: string;

  @ApiProperty({ description: '创作者简介', nullable: true })
  bio?: string;
}

/**
 * 用户订阅项目
 */
export class UserSubscriptionItemDto {
  @ApiProperty({ description: '订阅ID' })
  id: string;

  @ApiProperty({ type: CreatorInfoDto, description: '创作者信息' })
  creator: CreatorInfoDto;

  @ApiProperty({ description: '订阅创建时间' })
  subscribedAt: Date;

  @ApiProperty({ description: '是否启用通知' })
  notificationEnabled: boolean;
}

/**
 * 分页信息
 */
export class PaginationInfoDto {
  @ApiProperty({ description: '总记录数' })
  total: number;

  @ApiProperty({ description: '当前页码' })
  page: number;

  @ApiProperty({ description: '每页数量' })
  limit: number;

  @ApiProperty({ description: '总页数' })
  totalPages: number;
}

/**
 * 分页数据响应
 */
export class PaginatedResponseDto<T> {
  @ApiProperty({ description: '数据列表', isArray: true })
  data: T[];

  @ApiProperty({ type: PaginationInfoDto, description: '分页信息' })
  pagination: PaginationInfoDto;
}

/**
 * 订阅者基础信息
 */
class SubscriberInfoDto {
  @ApiProperty({ description: '用户ID' })
  id: string;

  @ApiProperty({ description: '用户名' })
  username: string;

  @ApiProperty({ description: '头像', nullable: true })
  avatar?: string;
}

/**
 * 订阅者项目
 */
export class SubscriberItemDto {
  @ApiProperty({ description: '订阅ID' })
  id: string;

  @ApiProperty({ type: SubscriberInfoDto, description: '订阅者信息' })
  user: SubscriberInfoDto;

  @ApiProperty({ description: '订阅创建时间' })
  subscribedAt: Date;

  @ApiProperty({ description: '是否启用通知' })
  notificationEnabled: boolean;
} 