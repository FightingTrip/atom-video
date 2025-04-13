/**
 * 创作者品牌设置服务
 */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ICreatorBranding } from '../models/creator.branding.model';
import { BrandingSettingsDto } from '../dto/creator.branding.dto';
import { FileService } from '../../common/services/file.service';

@Injectable()
export class CreatorBrandingService {
  constructor(
    @InjectModel('CreatorBranding') private brandingModel: Model<ICreatorBranding>,
    private fileService: FileService
  ) {}

  /**
   * 获取创作者品牌设置
   * @param creatorId 创作者ID
   */
  async getBrandingSettings(creatorId: string): Promise<ICreatorBranding | null> {
    return this.brandingModel.findOne({ creatorId: new Types.ObjectId(creatorId) }).exec();
  }

  /**
   * 保存创作者品牌设置
   * @param creatorId 创作者ID
   * @param brandingSettings 品牌设置数据
   */
  async saveBrandingSettings(
    creatorId: string,
    brandingSettings: BrandingSettingsDto
  ): Promise<ICreatorBranding> {
    // 转换base64图像到URL
    let watermarkUrl: string | undefined;
    let introUrl: string | undefined;
    let outroUrl: string | undefined;

    // 处理水印图像
    if (brandingSettings.watermark?.image) {
      if (brandingSettings.watermark.image.startsWith('data:')) {
        watermarkUrl = await this.fileService.uploadBase64Image(
          brandingSettings.watermark.image,
          `creator/${creatorId}/watermark.png`
        );
      } else {
        watermarkUrl = brandingSettings.watermark.image;
      }
    }

    // 处理片头视频
    if (brandingSettings.intro?.video) {
      if (brandingSettings.intro.video.startsWith('data:')) {
        introUrl = await this.fileService.uploadBase64Video(
          brandingSettings.intro.video,
          `creator/${creatorId}/intro.mp4`
        );
      } else {
        introUrl = brandingSettings.intro.video;
      }
    }

    // 处理片尾视频
    if (brandingSettings.outro?.video) {
      if (brandingSettings.outro.video.startsWith('data:')) {
        outroUrl = await this.fileService.uploadBase64Video(
          brandingSettings.outro.video,
          `creator/${creatorId}/outro.mp4`
        );
      } else {
        outroUrl = brandingSettings.outro.video;
      }
    }

    // 准备更新的数据
    const updateData: Partial<ICreatorBranding> = {};

    if (brandingSettings.watermark) {
      updateData.watermark = {
        url: watermarkUrl,
        position: brandingSettings.watermark.position,
        opacity: brandingSettings.watermark.opacity,
        size: brandingSettings.watermark.size,
      };
    }

    if (brandingSettings.intro) {
      updateData.intro = {
        url: introUrl,
        autoAdd: brandingSettings.intro.autoAdd,
        transition: brandingSettings.intro.transition,
      };
    }

    if (brandingSettings.outro) {
      updateData.outro = {
        url: outroUrl,
        autoAdd: brandingSettings.outro.autoAdd,
        transition: brandingSettings.outro.transition,
        addSubscribeButton: brandingSettings.outro.addSubscribeButton,
      };
    }

    if (brandingSettings.theme) {
      updateData.theme = {
        color: brandingSettings.theme.color,
      };
    }

    // 查找并更新，如果不存在则创建
    const existingBranding = await this.brandingModel.findOne({
      creatorId: new Types.ObjectId(creatorId),
    });

    if (existingBranding) {
      return this.brandingModel
        .findByIdAndUpdate(existingBranding._id, { $set: updateData }, { new: true })
        .exec();
    } else {
      const newBranding = new this.brandingModel({
        creatorId: new Types.ObjectId(creatorId),
        ...updateData,
      });
      return newBranding.save();
    }
  }

  /**
   * 应用水印到视频
   * @param videoUrl 视频URL
   * @param creatorId 创作者ID
   */
  async applyWatermarkToVideo(videoUrl: string, creatorId: string): Promise<string> {
    const branding = await this.getBrandingSettings(creatorId);
    if (!branding || !branding.watermark?.url) {
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
    if (branding.intro?.url && branding.intro.autoAdd) {
      // TODO: 集成视频处理服务，添加片头
    }

    // 添加片尾
    if (branding.outro?.url && branding.outro.autoAdd) {
      // TODO: 集成视频处理服务，添加片尾
    }

    return processedVideoUrl;
  }
}
