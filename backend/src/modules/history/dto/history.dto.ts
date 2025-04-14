/**
 * 历史记录数据传输对象
 *
 * 定义历史记录模块所需的DTO
 * @module history/dto/history.dto
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

/**
 * 创建历史记录DTO
 */
export class CreateHistoryDto {
  /**
   * 视频ID
   * @example "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
   */
  @ApiProperty({
    description: '视频ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsNotEmpty()
  @IsUUID()
  videoId: string;

  /**
   * 当前播放进度（秒）
   * @example 120
   */
  @ApiProperty({
    description: '当前播放进度（秒）',
    example: 120,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  currentTime: number;

  /**
   * 是否已完成观看
   * @example false
   */
  @ApiProperty({
    description: '是否已完成观看',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;
}

/**
 * 更新历史记录DTO
 */
export class UpdateHistoryDto {
  /**
   * 当前播放进度（秒）
   * @example 180
   */
  @ApiProperty({
    description: '当前播放进度（秒）',
    example: 180,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  currentTime: number;

  /**
   * 是否已完成观看
   * @example true
   */
  @ApiProperty({
    description: '是否已完成观看',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;
}

/**
 * 历史记录响应DTO
 */
export class HistoryResponseDto {
  /**
   * 历史记录ID
   */
  @ApiProperty({
    description: '历史记录ID',
    example: 'd4e5f6a7-b8c9-0123-def4-56789abcdef0',
  })
  id: string;

  /**
   * 视频ID
   */
  @ApiProperty({
    description: '视频ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  videoId: string;

  /**
   * 观看进度（秒）
   */
  @ApiProperty({
    description: '观看进度（秒）',
    example: 180,
  })
  currentTime: number;

  /**
   * 是否已完成观看
   */
  @ApiProperty({
    description: '是否已完成观看',
    example: true,
  })
  isCompleted: boolean;

  /**
   * 最后观看时间
   */
  @ApiProperty({
    description: '最后观看时间',
    example: '2023-01-01T12:00:00Z',
  })
  updatedAt: string;

  /**
   * 首次观看时间
   */
  @ApiProperty({
    description: '首次观看时间',
    example: '2023-01-01T10:00:00Z',
  })
  createdAt: string;

  /**
   * 视频信息
   */
  @ApiProperty({
    description: '视频信息',
    type: 'object',
  })
  video: {
    id: string;
    title: string;
    thumbnailUrl: string;
    duration: number;
    creator: {
      id: string;
      username: string;
      avatar: string;
    };
  };
}

/**
 * 批量获取历史记录DTO
 */
export class BulkHistoryQueryDto {
  /**
   * 视频ID数组
   * @example ["a1b2c3d4-e5f6-7890-abcd-ef1234567890", "b2c3d4e5-f6a7-8901-bcde-f12345678901"]
   */
  @ApiProperty({
    description: '视频ID数组',
    type: [String],
    example: ['a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'b2c3d4e5-f6a7-8901-bcde-f12345678901'],
  })
  @IsNotEmpty()
  @IsUUID(undefined, { each: true })
  videoIds: string[];
}
