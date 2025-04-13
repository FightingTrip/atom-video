/**
 * 标签相关DTO
 *
 * @module tag/dto/tag
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNumber,
  MinLength,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';

export class CreateTagDto {
  @ApiProperty({
    description: '标签名称',
    example: 'JavaScript',
  })
  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: '标签类型',
    example: 'TECH',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiPropertyOptional({
    description: '标签描述',
    example: 'JavaScript是一种高级编程语言',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: '是否启用',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: '是否热门',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isHot?: boolean;

  @ApiPropertyOptional({
    description: '排序值(数值越小越靠前)',
    example: 0,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}

export class UpdateTagDto {
  @ApiPropertyOptional({
    description: '标签名称',
    example: 'JavaScript',
  })
  @IsString()
  @MinLength(2)
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: '标签类型',
    example: 'TECH',
  })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({
    description: '标签描述',
    example: 'JavaScript是一种高级编程语言',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: '是否启用',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: '是否热门',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isHot?: boolean;

  @ApiPropertyOptional({
    description: '排序值(数值越小越靠前)',
    example: 0,
  })
  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}

export class TagDetailResponseDto {
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

  @ApiProperty({
    description: '标签类型',
    example: 'TECH',
  })
  type: string;

  @ApiProperty({
    description: '标签描述',
    example: 'JavaScript是一种高级编程语言',
  })
  description: string;

  @ApiProperty({
    description: '是否启用',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: '是否热门',
    example: false,
  })
  isHot: boolean;

  @ApiProperty({
    description: '排序值',
    example: 0,
  })
  sortOrder: number;

  @ApiProperty({
    description: '关联视频数量',
    example: 120,
  })
  videoCount: number;

  @ApiProperty({
    description: '创建时间',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '更新时间',
    example: '2023-01-02T00:00:00.000Z',
  })
  updatedAt: Date;
}

export class MergeTagsDto {
  @ApiProperty({
    description: '源标签ID（将被合并）',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  @IsNotEmpty()
  sourceTagId: string;

  @ApiProperty({
    description: '目标标签ID（合并到此标签）',
    example: 'e37bc10b-48cc-4372-b567-9e02b2c3d123',
  })
  @IsUUID()
  @IsNotEmpty()
  targetTagId: string;
}
