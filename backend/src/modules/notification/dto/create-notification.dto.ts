/**
 * 创建通知DTO
 *
 * @module notification/dto/create-notification
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsUUID, IsOptional, IsObject, IsNotEmpty } from 'class-validator';
import { NotificationType } from '@atom/shared-types/models';

export class CreateNotificationDto {
  @ApiProperty({
    description: '接收通知的用户ID',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: '通知类型',
    enum: NotificationType,
    example: NotificationType.NEW_VIDEO,
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({
    description: '通知标题',
    example: '新视频已发布',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: '通知正文',
    example: 'XXX发布了一个新视频',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({
    description: '相关用户ID',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  @IsOptional()
  relatedUserId?: string;

  @ApiPropertyOptional({
    description: '相关视频ID',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  @IsOptional()
  relatedVideoId?: string;

  @ApiPropertyOptional({
    description: '相关评论ID',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  @IsOptional()
  relatedCommentId?: string;

  @ApiPropertyOptional({
    description: '额外元数据',
    example: '{ "videoTitle": "如何学习编程" }',
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
