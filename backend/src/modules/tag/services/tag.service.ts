/**
 * 标签服务模块
 *
 * 提供标签相关的业务逻辑
 * @module tag/services/tag
 */

import { TagDto, CreateTagDto, UpdateTagDto, TagQueryParams } from '../models/tag.model';
import { withDbClient, performTransaction } from '../../common/utils/db-helpers';
import { NotFoundError, ConflictError, ValidationError } from '../../common/utils/app-error';
import { removeNullUndefined } from '../../common/utils/helpers';

/**
 * 标签服务类
 */
export class TagService {
  /**
   * 创建标签
   * @param dto 创建标签数据
   * @returns 创建的标签
   */
  async createTag(dto: CreateTagDto): Promise<TagDto> {
    const { name, slug } = dto;
    
    // 生成slug（如果没有提供）
    const tagSlug = slug || this.generateSlug(name);
    
    return performTransaction(async prisma => {
      // 检查标签名或slug是否已存在
      const existingTag = await prisma.tag.findFirst({
        where: {
          OR: [
            { name: { equals: name, mode: 'insensitive' } },
            { slug: { equals: tagSlug, mode: 'insensitive' } }
          ]
        }
      });
      
      if (existingTag) {
        throw new ConflictError(
          '标签已存在',
          existingTag.name === name ? '此标签名已被使用' : '此标签slug已被使用'
        );
      }
      
      // 创建标签
      const tag = await prisma.tag.create({
        data: {
          name,
          slug: tagSlug
        }
      });
      
      return this.mapToDto(tag);
    });
  }
  
  /**
   * 根据ID获取标签
   * @param id 标签ID
   * @returns 标签
   */
  async getTagById(id: string): Promise<TagDto> {
    return withDbClient(async prisma => {
      const tag = await prisma.tag.findUnique({
        where: { id }
      });
      
      if (!tag) {
        throw new NotFoundError('标签不存在', `没有找到ID为 ${id} 的标签`);
      }
      
      // 获取使用该标签的视频数量
      const count = await prisma.videoTag.count({
        where: { tagId: id }
      });
      
      return {
        ...this.mapToDto(tag),
        count
      };
    });
  }
  
  /**
   * 根据slug获取标签
   * @param slug 标签slug
   * @returns 标签
   */
  async getTagBySlug(slug: string): Promise<TagDto> {
    return withDbClient(async prisma => {
      const tag = await prisma.tag.findUnique({
        where: { slug }
      });
      
      if (!tag) {
        throw new NotFoundError('标签不存在', `没有找到slug为 ${slug} 的标签`);
      }
      
      // 获取使用该标签的视频数量
      const count = await prisma.videoTag.count({
        where: { tagId: tag.id }
      });
      
      return {
        ...this.mapToDto(tag),
        count
      };
    });
  }
  
  /**
   * 获取标签列表
   * @param params 查询参数
   * @returns 标签列表和总数
   */
  async getTags(params: TagQueryParams): Promise<{ tags: TagDto[]; total: number }> {
    const { search, sort = 'name', order = 'asc', limit = 20, offset = 0 } = params;
    
    return withDbClient(async prisma => {
      // 构建查询条件
      const where = search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { slug: { contains: search, mode: 'insensitive' } }
            ]
          }
        : {};
      
      // 查询标签
      const tags = await prisma.tag.findMany({
        where,
        orderBy: sort === 'count'
          ? { videoTags: { _count: order === 'asc' ? 'asc' : 'desc' } }
          : { [sort]: order },
        skip: offset,
        take: limit
      });
      
      // 查询总数
      const total = await prisma.tag.count({ where });
      
      // 获取每个标签的视频数量
      const tagsWithCount = await Promise.all(
        tags.map(async tag => {
          const count = await prisma.videoTag.count({
            where: { tagId: tag.id }
          });
          
          return {
            ...this.mapToDto(tag),
            count
          };
        })
      );
      
      return {
        tags: tagsWithCount,
        total
      };
    });
  }
  
  /**
   * 获取热门标签
   * @param limit 数量限制
   * @returns 热门标签列表
   */
  async getPopularTags(limit: number = 10): Promise<TagDto[]> {
    return withDbClient(async prisma => {
      // 获取具有最多视频的标签
      const tagsWithCount = await prisma.tag.findMany({
        take: limit,
        orderBy: {
          videoTags: { _count: 'desc' }
        }
      });
      
      // 获取每个标签的视频数量
      return Promise.all(
        tagsWithCount.map(async tag => {
          const count = await prisma.videoTag.count({
            where: { tagId: tag.id }
          });
          
          return {
            ...this.mapToDto(tag),
            count
          };
        })
      );
    });
  }
  
  /**
   * 更新标签
   * @param id 标签ID
   * @param dto 更新数据
   * @returns 更新后的标签
   */
  async updateTag(id: string, dto: UpdateTagDto): Promise<TagDto> {
    const updateData = removeNullUndefined(dto);
    
    if (Object.keys(updateData).length === 0) {
      throw new ValidationError('更新数据不能为空');
    }
    
    // 如果更新slug，生成新的slug
    if (updateData.name && !updateData.slug) {
      updateData.slug = this.generateSlug(updateData.name);
    }
    
    return performTransaction(async prisma => {
      // 检查标签是否存在
      const existingTag = await prisma.tag.findUnique({
        where: { id }
      });
      
      if (!existingTag) {
        throw new NotFoundError('标签不存在', `没有找到ID为 ${id} 的标签`);
      }
      
      // 检查是否有相同名称或slug的标签
      if (updateData.name || updateData.slug) {
        const duplicateTag = await prisma.tag.findFirst({
          where: {
            id: { not: id },
            OR: [
              updateData.name ? { name: { equals: updateData.name, mode: 'insensitive' } } : {},
              updateData.slug ? { slug: { equals: updateData.slug, mode: 'insensitive' } } : {}
            ]
          }
        });
        
        if (duplicateTag) {
          throw new ConflictError(
            '标签已存在',
            duplicateTag.name === updateData.name
              ? '此标签名已被使用'
              : '此标签slug已被使用'
          );
        }
      }
      
      // 更新标签
      const updatedTag = await prisma.tag.update({
        where: { id },
        data: updateData
      });
      
      return this.mapToDto(updatedTag);
    });
  }
  
  /**
   * 删除标签
   * @param id 标签ID
   * @returns 被删除的标签
   */
  async deleteTag(id: string): Promise<TagDto> {
    return performTransaction(async prisma => {
      // 检查标签是否存在
      const tag = await prisma.tag.findUnique({
        where: { id }
      });
      
      if (!tag) {
        throw new NotFoundError('标签不存在', `没有找到ID为 ${id} 的标签`);
      }
      
      // 删除标签与视频的关联
      await prisma.videoTag.deleteMany({
        where: { tagId: id }
      });
      
      // 删除标签
      const deletedTag = await prisma.tag.delete({
        where: { id }
      });
      
      return this.mapToDto(deletedTag);
    });
  }
  
  /**
   * 获取视频的标签
   * @param videoId 视频ID
   * @returns 标签列表
   */
  async getTagsByVideoId(videoId: string): Promise<TagDto[]> {
    return withDbClient(async prisma => {
      // 检查视频是否存在
      const videoExists = await prisma.video.findUnique({
        where: { id: videoId }
      });
      
      if (!videoExists) {
        throw new NotFoundError('视频不存在', `没有找到ID为 ${videoId} 的视频`);
      }
      
      // 获取视频的标签
      const videoTags = await prisma.videoTag.findMany({
        where: { videoId },
        include: { tag: true }
      });
      
      return videoTags.map(vt => this.mapToDto(vt.tag));
    });
  }
  
  /**
   * 生成标签slug
   * @param name 标签名
   * @returns 标签slug
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // 移除非单词/空格/连字符字符
      .replace(/[\s_-]+/g, '-') // 将空格和下划线替换为连字符
      .replace(/^-+|-+$/g, ''); // 移除前导和尾随连字符
  }
  
  /**
   * 映射数据库模型到DTO
   * @param model 数据库模型
   * @returns DTO
   */
  private mapToDto(model: any): TagDto {
    return {
      id: model.id,
      name: model.name,
      slug: model.slug,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt
    };
  }
} 