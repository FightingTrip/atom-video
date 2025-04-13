/**
 * 更新通知DTO
 *
 * @module notification/dto/update-notification
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateNotificationDto {
  @ApiProperty({
    description: '是否已读',
    example: true,
  })
  @IsBoolean()
  isRead: boolean;
}
