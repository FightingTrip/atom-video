/**
 * 搜索相关DTO
 *
 * @module search/dto/search
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsObject, IsInt, Min, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchRequestDto {
  @ApiProperty({
    description: '搜索关键词',
    example: '前端开发',
  })
  @IsString()
  query: string;

  @ApiPropertyOptional({
    description: '搜索类型',
    enum: ['all', 'video', 'user', 'tag'],
    default: 'all',
  })
  @IsOptional()
  @IsEnum(['all', 'video', 'user', 'tag'])
  type?: 'all' | 'video' | 'user' | 'tag';

  @ApiPropertyOptional({
    description: '页码',
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    description: '每页数量',
    default: 20,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: '筛选条件',
    type: 'object',
    example: {
      duration: 'medium',
      uploadDate: 'week',
      sort: 'views',
      difficulty: 'BEGINNER',
    },
  })
  @IsOptional()
  @IsObject()
  filters?: Record<string, any>;
}

class PaginationDto {
  @ApiProperty({
    description: '总数',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: '页码',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: '每页数量',
    example: 20,
  })
  limit: number;

  @ApiProperty({
    description: '总页数',
    example: 5,
  })
  totalPages: number;
}

class VideoSearchResultDto {
  @ApiProperty({
    description: '视频搜索结果',
    isArray: true,
  })
  data: any[];

  @ApiProperty({
    description: '分页信息',
    type: PaginationDto,
  })
  pagination: PaginationDto;
}

class UserSearchResultDto {
  @ApiProperty({
    description: '用户搜索结果',
    isArray: true,
  })
  data: any[];

  @ApiProperty({
    description: '分页信息',
    type: PaginationDto,
  })
  pagination: PaginationDto;
}

class TagSearchResultDto {
  @ApiProperty({
    description: '标签搜索结果',
    isArray: true,
  })
  data: any[];

  @ApiProperty({
    description: '分页信息',
    type: PaginationDto,
  })
  pagination: PaginationDto;
}

export class SearchResultDto {
  @ApiProperty({
    description: '视频搜索结果',
    type: VideoSearchResultDto,
  })
  videos: VideoSearchResultDto;

  @ApiProperty({
    description: '用户搜索结果',
    type: UserSearchResultDto,
  })
  users: UserSearchResultDto;

  @ApiProperty({
    description: '标签搜索结果',
    type: TagSearchResultDto,
  })
  tags: TagSearchResultDto;
}

export class SearchHistoryDto {
  @ApiProperty({
    description: '搜索历史',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  history: string[];
}

export class PopularSearchesDto {
  @ApiProperty({
    description: '热门搜索',
    isArray: true,
    example: [
      { query: '前端开发', count: 120 },
      { query: 'React', count: 85 },
    ],
  })
  @IsArray()
  popularSearches: { query: string; count: number }[];
}
