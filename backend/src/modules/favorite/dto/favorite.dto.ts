/**
 * 收藏功能数据传输对象
 *
 * 定义收藏模块所需的DTO
 * @module favorite/dto/favorite.dto
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

/**
 * 创建收藏DTO
 */
export class CreateFavoriteDto {
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
   * 收藏备注
   * @example "这个视频讲解得很清晰"
   */
  @ApiProperty({
    description: '收藏备注',
    example: '这个视频讲解得很清晰',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;

  /**
   * 收藏夹ID
   * @example "b2c3d4e5-f6a7-8901-bcde-f12345678901"
   */
  @ApiProperty({
    description: '收藏夹ID',
    example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  collectionId?: string;
}

/**
 * 更新收藏DTO
 */
export class UpdateFavoriteDto {
  /**
   * 收藏备注
   * @example "这个视频非常有用"
   */
  @ApiProperty({
    description: '收藏备注',
    example: '这个视频非常有用',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;

  /**
   * 收藏夹ID
   * @example "c3d4e5f6-a7b8-9012-cdef-123456789012"
   */
  @ApiProperty({
    description: '收藏夹ID',
    example: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  collectionId?: string;
}

/**
 * 批量检查收藏状态DTO
 */
export class BulkCheckFavoriteDto {
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

/**
 * 收藏响应DTO
 */
export class FavoriteResponseDto {
  /**
   * 收藏ID
   */
  @ApiProperty({
    description: '收藏ID',
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
   * 收藏备注
   */
  @ApiProperty({
    description: '收藏备注',
    example: '这个视频讲解得很清晰',
    nullable: true,
  })
  note: string | null;

  /**
   * 收藏夹ID
   */
  @ApiProperty({
    description: '收藏夹ID',
    example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    nullable: true,
  })
  collectionId: string | null;

  /**
   * 收藏时间
   */
  @ApiProperty({
    description: '收藏时间',
    example: '2023-01-01T12:00:00Z',
  })
  createdAt: Date;

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

  /**
   * 收藏夹信息
   */
  @ApiProperty({
    description: '收藏夹信息',
    type: 'object',
    nullable: true,
  })
  collection: {
    id: string;
    name: string;
  } | null;
}

/**
 * 收藏状态响应DTO
 */
export class FavoriteStatusResponseDto {
  /**
   * 是否已收藏
   */
  @ApiProperty({
    description: '是否已收藏',
    example: true,
  })
  isFavorited: boolean;

  /**
   * 收藏ID
   */
  @ApiProperty({
    description: '收藏ID',
    example: 'd4e5f6a7-b8c9-0123-def4-56789abcdef0',
    nullable: true,
  })
  favoriteId: string | null;

  /**
   * 收藏夹ID
   */
  @ApiProperty({
    description: '收藏夹ID',
    example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    nullable: true,
  })
  collectionId: string | null;
}
