/**
 * 订阅数据传输对象
 *
 * 定义订阅模块所需的DTO
 * @module subscription/dto/subscription.dto
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, IsArray } from 'class-validator';

/**
 * 订阅请求DTO
 */
export class SubscriptionDto {
  @ApiProperty({
    description: '创作者ID',
    example: 'e87a1881-c917-4214-a365-1f4b2e40ab65',
  })
  @IsNotEmpty()
  @IsString()
  creatorId: string;

  @ApiProperty({
    description: '是否接收通知',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  notificationsEnabled?: boolean;
}

/**
 * 创建订阅DTO
 */
export class CreateSubscriptionDto {
  /**
   * 创作者ID
   * @example "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
   */
  @ApiProperty({
    description: '创作者ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsNotEmpty()
  @IsUUID()
  creatorId: string;

  /**
   * 是否启用通知
   * @example true
   */
  @ApiProperty({
    description: '是否启用通知',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  notificationEnabled?: boolean = true;
}

/**
 * 更新订阅通知设置DTO
 */
export class UpdateSubscriptionDto {
  /**
   * 是否启用通知
   * @example true
   */
  @ApiProperty({
    description: '是否启用通知',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  notificationEnabled: boolean;
}

/**
 * 订阅检查请求DTO
 */
export class CheckSubscriptionDto {
  /**
   * 创作者ID
   * @example "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
   */
  @ApiProperty({
    description: '创作者ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsNotEmpty()
  @IsUUID()
  creatorId: string;
}

/**
 * 批量检查订阅状态请求DTO
 */
export class BulkCheckSubscriptionDto {
  /**
   * 创作者ID数组
   * @example ["a1b2c3d4-e5f6-7890-abcd-ef1234567890", "b2c3d4e5-f6a7-8901-bcde-f12345678901"]
   */
  @ApiProperty({
    description: '创作者ID数组',
    type: [String],
    example: ['a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'b2c3d4e5-f6a7-8901-bcde-f12345678901'],
  })
  @IsNotEmpty()
  @IsArray()
  @IsUUID(undefined, { each: true })
  creatorIds: string[];
}
