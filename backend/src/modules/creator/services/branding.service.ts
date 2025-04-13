import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { BrandingSettingsDto } from '../dto/branding.dto';
import { CreatorBranding } from '@prisma/client';

@Injectable()
export class BrandingService {
  constructor(private prisma: PrismaService) {}

  /**
   * 获取创作者品牌设置
   * @param creatorId 创作者ID
   */
  async getBrandingSettings(creatorId: string): Promise<CreatorBranding | null> {
    return this.prisma.creatorBranding.findUnique({
      where: { creatorId },
    });
  }

  /**
   * 保存创作者品牌设置
   * @param creatorId 创作者ID
   * @param brandingSettings 品牌设置数据
   */
  async saveBrandingSettings(
    creatorId: string,
    brandingSettings: BrandingSettingsDto
  ): Promise<CreatorBranding> {
    // 处理水印图像和视频
    // 在实际实现中，这里应该有文件上传服务来处理base64转文件等逻辑
    const watermarkUrl = brandingSettings.watermark?.image || null;
    const introUrl = brandingSettings.intro?.video || null;
    const outroUrl = brandingSettings.outro?.video || null;

    // 准备更新的数据
    const updateData: any = {};

    if (brandingSettings.watermark) {
      updateData.watermarkUrl = watermarkUrl;
      updateData.watermarkPosition = brandingSettings.watermark.position;
      updateData.watermarkOpacity = brandingSettings.watermark.opacity;
      updateData.watermarkSize = brandingSettings.watermark.size;
    }

    if (brandingSettings.intro) {
      updateData.introUrl = introUrl;
      updateData.introAutoAdd = brandingSettings.intro.autoAdd;
      updateData.introTransition = brandingSettings.intro.transition;
    }

    if (brandingSettings.outro) {
      updateData.outroUrl = outroUrl;
      updateData.outroAutoAdd = brandingSettings.outro.autoAdd;
      updateData.outroTransition = brandingSettings.outro.transition;
      updateData.outroAddSubscribe = brandingSettings.outro.addSubscribeButton;
    }

    if (brandingSettings.theme) {
      updateData.themeColor = brandingSettings.theme.color;
    }

    // 检查用户是否存在
    const userExists = await this.prisma.user.findUnique({
      where: { id: creatorId },
      select: { id: true },
    });

    if (!userExists) {
      throw new NotFoundException(`Creator with ID "${creatorId}" not found`);
    }

    // 使用upsert实现创建或更新
    return this.prisma.creatorBranding.upsert({
      where: { creatorId },
      update: updateData,
      create: {
        creatorId,
        ...updateData,
      },
    });
  }

  /**
   * 应用水印到视频
   * @param videoUrl 视频URL
   * @param creatorId 创作者ID
   */
  async applyWatermarkToVideo(videoUrl: string, creatorId: string): Promise<string> {
    const branding = await this.getBrandingSettings(creatorId);
    if (!branding || !branding.watermarkUrl) {
      return videoUrl; // 如果没有水印设置，返回原始视频
    }

    // TODO: 集成视频处理服务，添加水印
    // 这里需要实现真正的视频水印处理逻辑
    return videoUrl;
  }

  /**
   * 应用片头片尾到视频
   * @param videoUrl 视频URL
   * @param creatorId 创作者ID
   */
  async applyIntroOutroToVideo(videoUrl: string, creatorId: string): Promise<string> {
    const branding = await this.getBrandingSettings(creatorId);
    if (!branding) {
      return videoUrl; // 如果没有品牌设置，返回原始视频
    }

    let processedVideoUrl = videoUrl;

    // 添加片头
    if (branding.introUrl && branding.introAutoAdd) {
      // TODO: 集成视频处理服务，添加片头
    }

    // 添加片尾
    if (branding.outroUrl && branding.outroAutoAdd) {
      // TODO: 集成视频处理服务，添加片尾
    }

    return processedVideoUrl;
  }
}
