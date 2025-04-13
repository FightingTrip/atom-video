/**
 * 订阅响应DTO
 *
 * @module subscription/dto
 */
import { ApiProperty } from '@nestjs/swagger';

/**
 * 基础创作者信息DTO
 */
export class CreatorBasicDto {
  @ApiProperty({
    description: '创作者ID',
    example: 'e87a1881-c917-4214-a365-1f4b2e40ab65',
  })
  id: string;

  @ApiProperty({
    description: '创作者用户名',
    example: 'johndoe',
  })
  username: string;

  @ApiProperty({
    description: '创作者昵称',
    example: '约翰·多伊',
  })
  nickname: string;

  @ApiProperty({
    description: '创作者头像',
    example: 'https://example.com/avatars/johndoe.jpg',
  })
  avatar: string;
}

/**
 * 订阅响应DTO
 */
export class SubscriptionResponseDto {
  @ApiProperty({
    description: '订阅ID',
    example: 'f6a76f5d-9263-4f6e-862d-5a6f87b9e4c3',
  })
  id: string;

  @ApiProperty({
    description: '创作者ID',
    example: 'e87a1881-c917-4214-a365-1f4b2e40ab65',
  })
  creatorId: string;

  @ApiProperty({
    description: '订阅者ID',
    example: 'a1b2c3d4-e5f6-4a5b-8c7d-9e8f7a6b5c4d',
  })
  subscriberId: string;

  @ApiProperty({
    description: '是否接收通知',
    example: true,
  })
  notificationsEnabled: boolean;

  @ApiProperty({
    description: '创建时间',
    example: '2024-01-01T12:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: '创作者信息',
    type: CreatorBasicDto,
  })
  creator: CreatorBasicDto;
}

/**
 * 创作者订阅信息DTO
 */
export class CreatorSubscriptionDto {
  @ApiProperty({
    description: '订阅ID',
    example: 'f6a76f5d-9263-4f6e-862d-5a6f87b9e4c3',
  })
  id: string;

  @ApiProperty({
    description: '创作者ID',
    example: 'e87a1881-c917-4214-a365-1f4b2e40ab65',
  })
  creatorId: string;

  @ApiProperty({
    description: '是否接收通知',
    example: true,
  })
  notificationsEnabled: boolean;

  @ApiProperty({
    description: '创建时间',
    example: '2024-01-01T12:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: '创作者详细信息',
    type: () => CreatorDetailDto,
  })
  creator: CreatorDetailDto;
}

/**
 * 创作者详细信息DTO
 */
export class CreatorDetailDto extends CreatorBasicDto {
  @ApiProperty({
    description: '视频数量',
    example: 42,
  })
  videosCount: number;

  @ApiProperty({
    description: '订阅者数量',
    example: 1024,
  })
  subscribersCount: number;
}

/**
 * 订阅者信息DTO
 */
export class SubscriberBasicDto {
  @ApiProperty({
    description: '用户ID',
    example: 'a1b2c3d4-e5f6-4a5b-8c7d-9e8f7a6b5c4d',
  })
  id: string;

  @ApiProperty({
    description: '用户名',
    example: 'janedoe',
  })
  username: string;

  @ApiProperty({
    description: '昵称',
    example: '简·多伊',
  })
  nickname: string;

  @ApiProperty({
    description: '头像',
    example: 'https://example.com/avatars/janedoe.jpg',
  })
  avatar: string;
}

/**
 * 订阅者项目DTO
 */
export class SubscriberItemDto {
  @ApiProperty({
    description: '订阅ID',
    example: 'f6a76f5d-9263-4f6e-862d-5a6f87b9e4c3',
  })
  id: string;

  @ApiProperty({
    description: '订阅者ID',
    example: 'a1b2c3d4-e5f6-4a5b-8c7d-9e8f7a6b5c4d',
  })
  subscriberId: string;

  @ApiProperty({
    description: '创建时间',
    example: '2024-01-01T12:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: '订阅者信息',
    type: SubscriberBasicDto,
  })
  subscriber: SubscriberBasicDto;
}
