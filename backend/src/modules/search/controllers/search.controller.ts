/**
 * 搜索控制器
 *
 * 处理搜索相关的API请求
 * @module search/controllers/search
 */
import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
  Optional,
  HttpStatus,
  Logger,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../auth/guards/optional-jwt-auth.guard';
import { User } from '../../auth/decorators/user.decorator';
import { SearchService } from '../services/search.service';
import {
  SearchRequestDto,
  SearchResultDto,
  SearchHistoryDto,
  PopularSearchesDto,
} from '../dto/search.dto';

@ApiTags('搜索')
@Controller('search')
export class SearchController {
  private readonly logger = new Logger(SearchController.name);

  constructor(private readonly searchService: SearchService) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: '搜索内容' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '搜索成功',
    type: SearchResultDto,
  })
  async search(@Body() searchRequest: SearchRequestDto, @User('id') userId?: string) {
    this.logger.log(`搜索请求: ${searchRequest.query} (userId: ${userId || 'anonymous'})`);

    // 记录搜索历史（如果用户已登录）
    if (userId) {
      await this.searchService.recordSearchHistory(userId, searchRequest.query);
    }

    const result = await this.searchService.search(searchRequest);
    return {
      statusCode: HttpStatus.OK,
      message: '搜索成功',
      data: result,
    };
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取用户搜索历史' })
  @ApiQuery({ name: 'limit', description: '限制数量', required: false, type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取成功',
    type: SearchHistoryDto,
  })
  async getSearchHistory(
    @User('id') userId: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    const history = await this.searchService.getUserSearchHistory(userId, limit);
    return {
      statusCode: HttpStatus.OK,
      message: '获取搜索历史成功',
      data: { history },
    };
  }

  @Get('popular')
  @ApiOperation({ summary: '获取热门搜索' })
  @ApiQuery({ name: 'limit', description: '限制数量', required: false, type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取成功',
    type: PopularSearchesDto,
  })
  async getPopularSearches(@Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number) {
    const popularSearches = await this.searchService.getPopularSearches(limit);
    return {
      statusCode: HttpStatus.OK,
      message: '获取热门搜索成功',
      data: { popularSearches },
    };
  }
}
