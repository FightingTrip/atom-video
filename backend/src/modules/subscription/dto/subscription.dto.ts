/**
 * 订阅数据传输对象
 *
 * 定义订阅模块所需的DTO
 * @module subscription/dto/subscription.dto
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

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
