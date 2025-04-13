/**
 * 标签控制器
 *
 * 处理标签相关的API请求
 * @module tag/controllers/tag
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Logger,
  HttpStatus,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TagService } from '../services/tag.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CreateTagDto, UpdateTagDto, TagDetailResponseDto, MergeTagsDto } from '../dto/tag.dto';

@ApiTags('标签')
@Controller('tags')
export class TagController {
  private readonly logger = new Logger(TagController.name);

  constructor(private readonly tagService: TagService) {}

  @Get()
  @ApiOperation({ summary: '获取标签列表' })
  @ApiQuery({ name: 'type', description: '标签类型', required: false })
  @ApiQuery({ name: 'page', description: '页码', required: false, type: Number })
  @ApiQuery({ name: 'limit', description: '每页数量', required: false, type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: '获取成功' })
  async findAll(
    @Query('type') type?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number
  ) {
    this.logger.log(`获取标签列表, type: ${type || 'all'}, page: ${page}, limit: ${limit}`);
    const result = await this.tagService.findAll(type, page, limit);
    return {
      statusCode: HttpStatus.OK,
      message: '获取标签列表成功',
      data: result.data,
      pagination: result.pagination,
    };
  }

  @Get('hot')
  @ApiOperation({ summary: '获取热门标签' })
  @ApiQuery({ name: 'limit', description: '数量限制', required: false, type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: '获取成功' })
  async getHotTags(@Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number) {
    this.logger.log(`获取热门标签, limit: ${limit}`);
    const hotTags = await this.tagService.getHotTags(limit);
    return {
      statusCode: HttpStatus.OK,
      message: '获取热门标签成功',
      data: hotTags,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '获取标签详情' })
  @ApiParam({ name: 'id', description: '标签ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取成功',
    type: TagDetailResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '标签不存在' })
  async findById(@Param('id') id: string) {
    this.logger.log(`获取标签详情, id: ${id}`);
    const tag = await this.tagService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      message: '获取标签详情成功',
      data: tag,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MODERATOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建新标签' })
  @ApiResponse({ status: HttpStatus.CREATED, description: '创建成功' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '标签名已存在' })
  async create(@Body() createTagDto: CreateTagDto) {
    this.logger.log(`创建标签: ${createTagDto.name}`);
    const tag = await this.tagService.create(createTagDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: '创建标签成功',
      data: tag,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MODERATOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新标签' })
  @ApiParam({ name: 'id', description: '标签ID' })
  @ApiResponse({ status: HttpStatus.OK, description: '更新成功' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '标签不存在' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '标签名已存在' })
  async update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    this.logger.log(`更新标签, id: ${id}`);
    const tag = await this.tagService.update(id, updateTagDto);
    return {
      statusCode: HttpStatus.OK,
      message: '更新标签成功',
      data: tag,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除标签' })
  @ApiParam({ name: 'id', description: '标签ID' })
  @ApiResponse({ status: HttpStatus.OK, description: '删除成功' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '标签不存在' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '标签已被关联无法删除' })
  async delete(@Param('id') id: string) {
    this.logger.log(`删除标签, id: ${id}`);
    const result = await this.tagService.delete(id);
    return {
      statusCode: HttpStatus.OK,
      message: '删除标签成功',
      data: result,
    };
  }

  @Get(':id/videos')
  @ApiOperation({ summary: '获取标签下的视频列表' })
  @ApiParam({ name: 'id', description: '标签ID' })
  @ApiQuery({ name: 'page', description: '页码', required: false, type: Number })
  @ApiQuery({ name: 'limit', description: '每页数量', required: false, type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: '获取成功' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '标签不存在' })
  async getTagVideos(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number
  ) {
    this.logger.log(`获取标签视频, id: ${id}, page: ${page}, limit: ${limit}`);
    const result = await this.tagService.getTagVideos(id, page, limit);
    return {
      statusCode: HttpStatus.OK,
      message: '获取标签视频成功',
      data: result.data,
      pagination: result.pagination,
      tag: result.tagInfo,
    };
  }

  @Get('search/by-name')
  @ApiOperation({ summary: '按名称搜索标签' })
  @ApiQuery({ name: 'q', description: '搜索关键词' })
  @ApiQuery({ name: 'limit', description: '返回数量', required: false, type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: '搜索成功' })
  async searchTags(
    @Query('q') query: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number
  ) {
    this.logger.log(`搜索标签, query: ${query}, limit: ${limit}`);
    const tags = await this.tagService.searchTags(query, limit);
    return {
      statusCode: HttpStatus.OK,
      message: '搜索标签成功',
      data: tags,
    };
  }

  @Post('merge')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '合并标签' })
  @ApiResponse({ status: HttpStatus.OK, description: '合并成功' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '标签不存在' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '合并失败' })
  async mergeTags(@Body() mergeTagsDto: MergeTagsDto) {
    this.logger.log(`合并标签, 源: ${mergeTagsDto.sourceTagId}, 目标: ${mergeTagsDto.targetTagId}`);
    const result = await this.tagService.mergeTags(
      mergeTagsDto.sourceTagId,
      mergeTagsDto.targetTagId
    );
    return {
      statusCode: HttpStatus.OK,
      message: '合并标签成功',
      data: result,
    };
  }
}
