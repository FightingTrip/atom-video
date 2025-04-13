/**
 * 创作者品牌设置控制器
 */
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
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../../shared/enums/user.enum';
import { BrandingSettingsDto } from '../dto/creator.branding.dto';
import { CreatorBrandingService } from '../services/creator.branding.service';
import { Request } from 'express';
import { BrandingSettingsResponse } from '@atom-video/shared-types/api';

@Controller('api/creator/branding')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.CREATOR, UserRole.ADMIN)
export class CreatorBrandingController {
  constructor(private brandingService: CreatorBrandingService) {}

  /**
   * 获取创作者品牌设置
   */
  @Get('settings')
  async getBrandingSettings(@Req() req: Request): Promise<BrandingSettingsResponse> {
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
          url: branding.watermark?.url || '',
          position: branding.watermark?.position || 'bottomRight',
          opacity: branding.watermark?.opacity || 70,
          size: branding.watermark?.size || 15,
        },
        intro: {
          url: branding.intro?.url || '',
          autoAdd: branding.intro?.autoAdd || true,
          transition: branding.intro?.transition || 'fade',
        },
        outro: {
          url: branding.outro?.url || '',
          autoAdd: branding.outro?.autoAdd || true,
          transition: branding.outro?.transition || 'fade',
          addSubscribeButton: branding.outro?.addSubscribeButton || true,
        },
        theme: {
          color: branding.theme?.color || '58a6ff',
        },
        updatedAt: branding.updatedAt.toISOString(),
      };
    } catch (error) {
      throw new HttpException('Failed to get branding settings', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 保存创作者品牌设置
   */
  @Post('settings')
  async saveBrandingSettings(
    @Req() req: Request,
    @Body() brandingSettingsDto: BrandingSettingsDto
  ): Promise<BrandingSettingsResponse> {
    try {
      const userId = req.user['id'];
      const branding = await this.brandingService.saveBrandingSettings(userId, brandingSettingsDto);

      return {
        watermark: {
          url: branding.watermark?.url || '',
          position: branding.watermark?.position || 'bottomRight',
          opacity: branding.watermark?.opacity || 70,
          size: branding.watermark?.size || 15,
        },
        intro: {
          url: branding.intro?.url || '',
          autoAdd: branding.intro?.autoAdd || true,
          transition: branding.intro?.transition || 'fade',
        },
        outro: {
          url: branding.outro?.url || '',
          autoAdd: branding.outro?.autoAdd || true,
          transition: branding.outro?.transition || 'fade',
          addSubscribeButton: branding.outro?.addSubscribeButton || true,
        },
        theme: {
          color: branding.theme?.color || '58a6ff',
        },
        updatedAt: branding.updatedAt.toISOString(),
      };
    } catch (error) {
      throw new HttpException('Failed to save branding settings', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
