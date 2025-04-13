/**
 * 标签服务
 *
 * 提供标签相关的业务逻辑
 * @module tag/services/tag
 */

import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateTagDto, UpdateTagDto } from '../dto/tag.dto';

@Injectable()
export class TagService {
  private readonly logger = new Logger(TagService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 获取所有标签
   *
   * @param type 标签类型（可选）
   * @param page 页码
   * @param limit 每页数量
   * @returns 标签列表及分页信息
   */
  async findAll(type?: string, page = 1, limit = 50) {
    try {
      const skip = (page - 1) * limit;
      const where = type ? { type } : {};

      const [tags, total] = await Promise.all([
        this.prisma.tag.findMany({
          where,
          skip,
          take: limit,
          orderBy: { name: 'asc' },
          include: {
            _count: {
              select: {
                videos: true,
              },
            },
          },
        }),
        this.prisma.tag.count({ where }),
      ]);

      return {
        data: tags.map(tag => ({
          id: tag.id,
          name: tag.name,
          type: tag.type,
          description: tag.description,
          isActive: tag.isActive,
          isHot: tag.isHot,
          videoCount: tag._count.videos,
          createdAt: tag.createdAt,
          updatedAt: tag.updatedAt,
        })),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(`获取标签列表失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 获取热门标签
   *
   * @param limit 数量限制
   * @returns 热门标签列表
   */
  async getHotTags(limit = 20) {
    try {
      // 方法1: 使用isHot标记获取热门标签
      const hotTags = await this.prisma.tag.findMany({
        where: { isHot: true, isActive: true },
        take: limit,
        include: {
          _count: {
            select: {
              videos: true,
            },
          },
        },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      });

      // 如果没有足够的热门标签，补充视频数最多的标签
      if (hotTags.length < limit) {
        const additionalTags = await this.prisma.tag.findMany({
          where: {
            isActive: true,
            id: { notIn: hotTags.map(tag => tag.id) },
          },
          take: limit - hotTags.length,
          include: {
            _count: {
              select: {
                videos: true,
              },
            },
          },
          orderBy: {
            videos: { _count: 'desc' },
          },
        });

        hotTags.push(...additionalTags);
      }

      return hotTags.map(tag => ({
        id: tag.id,
        name: tag.name,
        type: tag.type,
        description: tag.description,
        videoCount: tag._count.videos,
      }));
    } catch (error) {
      this.logger.error(`获取热门标签失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 根据ID获取标签
   *
   * @param id 标签ID
   * @returns 标签信息
   */
  async findById(id: string) {
    try {
      const tag = await this.prisma.tag.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              videos: true,
            },
          },
        },
      });

      if (!tag) {
        throw new NotFoundException(`标签不存在: ${id}`);
      }

      return {
        id: tag.id,
        name: tag.name,
        type: tag.type,
        description: tag.description,
        isActive: tag.isActive,
        isHot: tag.isHot,
        sortOrder: tag.sortOrder,
        videoCount: tag._count.videos,
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
      };
    } catch (error) {
      this.logger.error(`获取标签详情失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 创建新标签
   *
   * @param createTagDto 创建标签DTO
   * @returns 创建的标签
   */
  async create(createTagDto: CreateTagDto) {
    try {
      // 检查标签名是否已存在
      const existingTag = await this.prisma.tag.findFirst({
        where: { name: { equals: createTagDto.name, mode: 'insensitive' } },
      });

      if (existingTag) {
        throw new BadRequestException(`标签名 "${createTagDto.name}" 已存在`);
      }

      const tag = await this.prisma.tag.create({
        data: {
          name: createTagDto.name,
          type: createTagDto.type,
          description: createTagDto.description,
          isActive: createTagDto.isActive ?? true,
          isHot: createTagDto.isHot ?? false,
          sortOrder: createTagDto.sortOrder ?? 0,
        },
      });

      return tag;
    } catch (error) {
      this.logger.error(`创建标签失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 更新标签信息
   *
   * @param id 标签ID
   * @param updateTagDto 更新标签DTO
   * @returns 更新后的标签
   */
  async update(id: string, updateTagDto: UpdateTagDto) {
    try {
      // 检查标签是否存在
      const existingTag = await this.prisma.tag.findUnique({
        where: { id },
      });

      if (!existingTag) {
        throw new NotFoundException(`标签不存在: ${id}`);
      }

      // 如果更改了名称，检查新名称是否已存在
      if (updateTagDto.name && updateTagDto.name !== existingTag.name) {
        const nameExists = await this.prisma.tag.findFirst({
          where: {
            name: { equals: updateTagDto.name, mode: 'insensitive' },
            id: { not: id },
          },
        });

        if (nameExists) {
          throw new BadRequestException(`标签名 "${updateTagDto.name}" 已被使用`);
        }
      }

      // 更新标签
      const updatedTag = await this.prisma.tag.update({
        where: { id },
        data: {
          name: updateTagDto.name,
          type: updateTagDto.type,
          description: updateTagDto.description,
          isActive: updateTagDto.isActive,
          isHot: updateTagDto.isHot,
          sortOrder: updateTagDto.sortOrder,
        },
      });

      return updatedTag;
    } catch (error) {
      this.logger.error(`更新标签失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 删除标签
   *
   * @param id 标签ID
   * @returns 删除结果
   */
  async delete(id: string) {
    try {
      // 检查标签是否存在
      const tag = await this.prisma.tag.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              videos: true,
            },
          },
        },
      });

      if (!tag) {
        throw new NotFoundException(`标签不存在: ${id}`);
      }

      // 如果标签关联了视频，不允许删除
      if (tag._count.videos > 0) {
        throw new BadRequestException(`无法删除标签，该标签已关联 ${tag._count.videos} 个视频`);
      }

      // 删除标签
      await this.prisma.tag.delete({
        where: { id },
      });

      return { success: true, message: `标签 "${tag.name}" 已成功删除` };
    } catch (error) {
      this.logger.error(`删除标签失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 获取标签下的视频
   *
   * @param tagId 标签ID
   * @param page 页码
   * @param limit 每页数量
   * @returns 视频列表及分页信息
   */
  async getTagVideos(tagId: string, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;

      // 检查标签是否存在
      const tag = await this.prisma.tag.findUnique({
        where: { id: tagId },
      });

      if (!tag) {
        throw new NotFoundException(`标签不存在: ${tagId}`);
      }

      const [videos, total] = await Promise.all([
        this.prisma.video.findMany({
          where: {
            isPublished: true,
            visibility: 'PUBLIC',
            tags: {
              some: {
                id: tagId,
              },
            },
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
              },
            },
            tags: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          skip,
          take: limit,
          orderBy: { publishedAt: 'desc' },
        }),
        this.prisma.video.count({
          where: {
            isPublished: true,
            visibility: 'PUBLIC',
            tags: {
              some: {
                id: tagId,
              },
            },
          },
        }),
      ]);

      return {
        data: videos.map(video => ({
          id: video.id,
          title: video.title,
          description: video.description,
          thumbnailUrl: video.thumbnailUrl,
          duration: video.duration,
          views: video.viewCount,
          likes: video.likeCount,
          creator: {
            id: video.user.id,
            username: video.user.username,
            avatarUrl: video.user.avatarUrl,
          },
          tags: video.tags,
          publishedAt: video.publishedAt,
          createdAt: video.createdAt,
        })),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        tagInfo: {
          id: tag.id,
          name: tag.name,
          type: tag.type,
          description: tag.description,
        },
      };
    } catch (error) {
      this.logger.error(`获取标签视频失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 根据名称查询标签
   *
   * @param query 查询字符串
   * @param limit 数量限制
   * @returns 标签列表
   */
  async searchTags(query: string, limit = 10) {
    try {
      const tags = await this.prisma.tag.findMany({
        where: {
          name: { contains: query, mode: 'insensitive' },
          isActive: true,
        },
        take: limit,
        orderBy: [{ name: 'asc' }],
      });

      return tags.map(tag => ({
        id: tag.id,
        name: tag.name,
        type: tag.type,
      }));
    } catch (error) {
      this.logger.error(`搜索标签失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 合并标签
   *
   * @param sourceTagId 源标签ID
   * @param targetTagId 目标标签ID
   * @returns 合并结果
   */
  async mergeTags(sourceTagId: string, targetTagId: string) {
    try {
      // 验证两个标签都存在
      const [sourceTag, targetTag] = await Promise.all([
        this.prisma.tag.findUnique({ where: { id: sourceTagId } }),
        this.prisma.tag.findUnique({ where: { id: targetTagId } }),
      ]);

      if (!sourceTag) {
        throw new NotFoundException(`源标签不存在: ${sourceTagId}`);
      }

      if (!targetTag) {
        throw new NotFoundException(`目标标签不存在: ${targetTagId}`);
      }

      // 获取与源标签关联的所有视频
      const videoTags = await this.prisma.videoTag.findMany({
        where: { tagId: sourceTagId },
      });

      // 开始事务处理
      await this.prisma.$transaction(async tx => {
        // 1. 为目标标签添加所有源标签的视频关联
        for (const videoTag of videoTags) {
          // 检查视频是否已经与目标标签关联
          const existingTag = await tx.videoTag.findUnique({
            where: {
              videoId_tagId: {
                videoId: videoTag.videoId,
                tagId: targetTagId,
              },
            },
          });

          // 如果不存在关联，则创建
          if (!existingTag) {
            await tx.videoTag.create({
              data: {
                videoId: videoTag.videoId,
                tagId: targetTagId,
              },
            });
          }
        }

        // 2. 删除源标签的所有视频关联
        await tx.videoTag.deleteMany({
          where: { tagId: sourceTagId },
        });

        // 3. 删除源标签
        await tx.tag.delete({
          where: { id: sourceTagId },
        });
      });

      return {
        success: true,
        message: `标签 "${sourceTag.name}" 已成功合并到 "${targetTag.name}"`,
        mergedTag: targetTag,
      };
    } catch (error) {
      this.logger.error(`合并标签失败: ${error.message}`, error.stack);
      throw error;
    }
  }
}
