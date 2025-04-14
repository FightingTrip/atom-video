/**
 * 推荐系统DTO
 *
 * @module recommendation/dto/recommendation
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { RecommendationReason } from '../../../models/enums';

class VideoCreatorDto {
  @ApiProperty({
    description: '创作者ID',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  id: string;

  @ApiProperty({
    description: '创作者用户名',
    example: 'techguru',
  })
  username: string;

  @ApiProperty({
    description: '创作者头像URL',
    example: 'https://example.com/avatar.jpg',
  })
  avatarUrl: string;
}

class VideoTagDto {
  @ApiProperty({
    description: '标签ID',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  id: string;

  @ApiProperty({
    description: '标签名称',
    example: 'JavaScript',
  })
  name: string;
}

class RecommendedVideoDto {
  @ApiProperty({
    description: '视频ID',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  id: string;

  @ApiProperty({
    description: '视频标题',
    example: '10分钟学会JavaScript基础',
  })
  title: string;

  @ApiProperty({
    description: '视频描述',
    example: '这是一个适合初学者的JavaScript基础教程...',
  })
  description: string;

  @ApiProperty({
    description: '视频缩略图URL',
    example: 'https://example.com/thumbnail.jpg',
  })
  thumbnailUrl: string;

  @ApiProperty({
    description: '视频时长（秒）',
    example: 600,
  })
  duration: number;

  @ApiProperty({
    description: '视频播放次数',
    example: 10000,
  })
  views: number;

  @ApiProperty({
    description: '视频点赞数',
    example: 500,
  })
  likes: number;

  @ApiProperty({
    description: '视频发布时间',
    example: '2023-05-15T10:00:00Z',
  })
  publishedAt: string;

  @ApiProperty({
    description: '视频创建时间',
    example: '2023-05-14T15:30:00Z',
  })
  createdAt: string;

  @ApiProperty({
    description: '视频创作者信息',
    type: VideoCreatorDto,
  })
  creator: VideoCreatorDto;

  @ApiProperty({
    description: '视频标签列表',
    type: [VideoTagDto],
  })
  tags: VideoTagDto[];

  @ApiProperty({
    description: '推荐原因',
    enum: RecommendationReason,
    example: RecommendationReason.WATCH_HISTORY,
  })
  recommendationReason: RecommendationReason;
}

export class RecommendationResponseDto {
  @ApiProperty({
    description: '状态码',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: '消息',
    example: '获取推荐成功',
  })
  message: string;

  @ApiProperty({
    description: '推荐内容列表',
    type: [RecommendedVideoDto],
  })
  @IsArray()
  data: RecommendedVideoDto[];
}
