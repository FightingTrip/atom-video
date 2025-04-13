import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { BrandingService } from '../services/branding.service';
import { BrandingSettingsDto, BrandingSettingsResponseDto } from '../dto/branding.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('creator/branding')
@Controller('creator/branding')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class BrandingController {
  constructor(private readonly brandingService: BrandingService) {}

  @Get('settings')
  @Roles(UserRole.CREATOR, UserRole.ADMIN)
  @ApiOperation({ summary: '获取创作者品牌设置' })
  @ApiResponse({
    status: 200,
    description: '成功获取品牌设置',
    type: BrandingSettingsResponseDto,
  })
  async getBrandingSettings(@Req() req: Request): Promise<BrandingSettingsResponseDto> {
    try {
      const userId = req.user['id'];
      const branding = await this.brandingService.getBrandingSettings(userId);

      if (!branding) {
        return {
          watermark: {
            url: '',
            position: 'bottomRight',
            opacity: 70,
            size: 15,
          },
          intro: {
            url: '',
            autoAdd: true,
            transition: 'fade',
          },
          outro: {
            url: '',
            autoAdd: true,
            transition: 'fade',
            addSubscribeButton: true,
          },
          theme: {
            color: '58a6ff',
          },
          updatedAt: new Date().toISOString(),
        };
      }

      return {
        watermark: {
          url: branding.watermarkUrl || '',
          position: branding.watermarkPosition,
          opacity: branding.watermarkOpacity,
          size: branding.watermarkSize,
        },
        intro: {
          url: branding.introUrl || '',
          autoAdd: branding.introAutoAdd,
          transition: branding.introTransition,
        },
        outro: {
          url: branding.outroUrl || '',
          autoAdd: branding.outroAutoAdd,
          transition: branding.outroTransition,
          addSubscribeButton: branding.outroAddSubscribe,
        },
        theme: {
          color: branding.themeColor,
        },
        updatedAt: branding.updatedAt.toISOString(),
      };
    } catch (error) {
      throw new HttpException('Failed to get branding settings', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('settings')
  @Roles(UserRole.CREATOR, UserRole.ADMIN)
  @ApiOperation({ summary: '保存创作者品牌设置' })
  @ApiResponse({
    status: 200,
    description: '成功保存品牌设置',
    type: BrandingSettingsResponseDto,
  })
  async saveBrandingSettings(
    @Req() req: Request,
    @Body() brandingSettingsDto: BrandingSettingsDto
  ): Promise<BrandingSettingsResponseDto> {
    try {
      const userId = req.user['id'];
      const branding = await this.brandingService.saveBrandingSettings(userId, brandingSettingsDto);

      return {
        watermark: {
          url: branding.watermarkUrl || '',
          position: branding.watermarkPosition,
          opacity: branding.watermarkOpacity,
          size: branding.watermarkSize,
        },
        intro: {
          url: branding.introUrl || '',
          autoAdd: branding.introAutoAdd,
          transition: branding.introTransition,
        },
        outro: {
          url: branding.outroUrl || '',
          autoAdd: branding.outroAutoAdd,
          transition: branding.outroTransition,
          addSubscribeButton: branding.outroAddSubscribe,
        },
        theme: {
          color: branding.themeColor,
        },
        updatedAt: branding.updatedAt.toISOString(),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to save branding settings', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
