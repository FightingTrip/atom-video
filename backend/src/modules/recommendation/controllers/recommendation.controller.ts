/**
 * 推荐系统控制器
 *
 * 处理推荐相关的API请求
 * @module recommendation/controllers/recommendation
 */
import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  Logger,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../auth/guards/optional-jwt-auth.guard';
import { User } from '../../auth/decorators/user.decorator';
import { RecommendationService } from '../services/recommendation.service';
import { RecommendationResponseDto } from '../dto/recommendation.dto';

@ApiTags('推荐')
@Controller('recommendations')
export class RecommendationController {
  private readonly logger = new Logger(RecommendationController.name);

  constructor(private readonly recommendationService: RecommendationService) {}

  @Get('home')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: '获取首页推荐内容' })
  @ApiQuery({ name: 'limit', description: '返回数量', required: false, type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取推荐成功',
    type: RecommendationResponseDto,
  })
  async getHomeRecommendations(
    @User('id') userId: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number
  ) {
    const source = userId ? '个性化' : '热门';
    this.logger.log(`获取${source}推荐内容, userId: ${userId || 'anonymous'}, limit: ${limit}`);

    const recommendations = await this.recommendationService.getHomeRecommendations(userId, limit);
    return {
      statusCode: HttpStatus.OK,
      message: '获取推荐成功',
      data: recommendations,
    };
  }

  @Get('personalized')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取个性化推荐内容' })
  @ApiQuery({ name: 'limit', description: '返回数量', required: false, type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取个性化推荐成功',
    type: RecommendationResponseDto,
  })
  async getPersonalizedRecommendations(
    @User('id') userId: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number
  ) {
    this.logger.log(`获取个性化推荐内容, userId: ${userId}, limit: ${limit}`);

    const recommendations = await this.recommendationService.getPersonalizedRecommendations(
      userId,
      limit
    );
    return {
      statusCode: HttpStatus.OK,
      message: '获取个性化推荐成功',
      data: recommendations,
    };
  }

  @Get('trending')
  @ApiOperation({ summary: '获取热门内容' })
  @ApiQuery({ name: 'limit', description: '返回数量', required: false, type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取热门内容成功',
    type: RecommendationResponseDto,
  })
  async getTrendingVideos(@Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number) {
    this.logger.log(`获取热门内容, limit: ${limit}`);

    const videos = await this.recommendationService.getTrendingVideos(limit);
    return {
      statusCode: HttpStatus.OK,
      message: '获取热门内容成功',
      data: videos,
    };
  }

  @Get('video/:videoId')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: '获取相关视频推荐' })
  @ApiParam({ name: 'videoId', description: '视频ID' })
  @ApiQuery({ name: 'limit', description: '返回数量', required: false, type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取相关视频成功',
    type: RecommendationResponseDto,
  })
  async getRelatedVideos(
    @Param('videoId') videoId: string,
    @User('id') userId: string,
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number
  ) {
    this.logger.log(
      `获取视频 ${videoId} 的相关推荐, userId: ${userId || 'anonymous'}, limit: ${limit}`
    );

    const relatedVideos = await this.recommendationService.getRelatedVideos(videoId, userId, limit);
    return {
      statusCode: HttpStatus.OK,
      message: '获取相关视频成功',
      data: relatedVideos,
    };
  }

  @Post(':videoId/click')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '标记推荐内容已点击' })
  @ApiParam({ name: 'videoId', description: '视频ID' })
  @ApiResponse({ status: HttpStatus.OK, description: '标记成功' })
  async markRecommendationAsClicked(@Param('videoId') videoId: string, @User('id') userId: string) {
    this.logger.log(`标记推荐内容已点击, userId: ${userId}, videoId: ${videoId}`);

    await this.recommendationService.markRecommendationAsClicked(userId, videoId);
    return {
      statusCode: HttpStatus.OK,
      message: '标记推荐点击成功',
    };
  }
}
