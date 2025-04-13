/**
 * 管理员通知控制器
 *
 * 提供管理员发送通知的API
 * @module notification/controllers/admin-notification
 */
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { NotificationService } from '../services/notification.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';

@ApiTags('admin/notifications')
@Controller('admin/notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminNotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @Roles('ADMIN', 'MODERATOR')
  @ApiOperation({ summary: '创建新通知' })
  @ApiResponse({ status: 201, description: '成功创建通知' })
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Post('batch')
  @Roles('ADMIN')
  @ApiOperation({ summary: '批量创建通知' })
  @ApiResponse({ status: 201, description: '成功批量创建通知' })
  async createBatch(@Body() createNotificationDtos: CreateNotificationDto[]) {
    return this.notificationService.createMany(createNotificationDtos);
  }
}
