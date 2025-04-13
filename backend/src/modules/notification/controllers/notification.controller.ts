/**
 * 通知控制器
 *
 * 处理通知相关的API请求
 * @module notification/controllers/notification
 */
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  ParseBoolPipe,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { NotificationService } from '../services/notification.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前用户的通知列表' })
  @ApiQuery({ name: 'page', description: '页码', required: false, type: Number })
  @ApiQuery({ name: 'limit', description: '每页数量', required: false, type: Number })
  @ApiQuery({ name: 'isRead', description: '是否已读', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: '成功获取通知列表' })
  async findAll(
    @CurrentUser('id') userId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('isRead', new DefaultValuePipe(undefined), ParseBoolPipe) isRead?: boolean
  ) {
    return this.notificationService.findAllForUser(userId, page, limit, isRead);
  }

  @Get('unread-count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取未读通知数量' })
  @ApiResponse({ status: 200, description: '成功获取未读通知数量' })
  async getUnreadCount(@CurrentUser('id') userId: string) {
    return this.notificationService.getUnreadCount(userId);
  }

  @Post(':id/mark-read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '标记通知为已读' })
  @ApiParam({ name: 'id', description: '通知ID' })
  @ApiResponse({ status: 200, description: '成功标记通知为已读' })
  async markAsRead(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.notificationService.markAsRead(id, userId);
  }

  @Post('mark-all-read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '标记所有通知为已读' })
  @ApiResponse({ status: 200, description: '成功标记所有通知为已读' })
  async markAllAsRead(@CurrentUser('id') userId: string) {
    return this.notificationService.markAllAsRead(userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除通知' })
  @ApiParam({ name: 'id', description: '通知ID' })
  @ApiResponse({ status: 200, description: '成功删除通知' })
  async remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.notificationService.remove(id, userId);
  }

  @Delete('clear-read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '清除所有已读通知' })
  @ApiResponse({ status: 200, description: '成功清除已读通知' })
  async clearReadNotifications(@CurrentUser('id') userId: string) {
    return this.notificationService.clearReadNotifications(userId);
  }
}
