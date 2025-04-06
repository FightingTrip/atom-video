import { PrismaClient, TechTag } from '@prisma/client';
import { AppError } from '../utils/app-error';

export class TagService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * 获取所有技术标签
   */
  async getAllTags(): Promise<TechTag[]> {
    try {
      return await this.prisma.techTag.findMany({
        orderBy: {
          name: 'asc',
        },
      });
    } catch (error) {
      throw new AppError('获取标签失败', 500);
    }
  }

  /**
   * 根据ID获取标签
   */
  async getTagById(id: string): Promise<TechTag> {
    try {
      const tag = await this.prisma.techTag.findUnique({
        where: { id },
      });

      if (!tag) {
        throw new AppError('标签不存在', 404);
      }

      return tag;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('获取标签失败', 500);
    }
  }

  /**
   * 创建新标签
   */
  async createTag(name: string): Promise<TechTag> {
    try {
      // 检查标签是否已存在
      const existingTag = await this.prisma.techTag.findFirst({
        where: {
          name: {
            equals: name,
            mode: 'insensitive',
          },
        },
      });

      if (existingTag) {
        throw new AppError('标签已存在', 400);
      }

      // 创建slug (URL友好的标识符)
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      return await this.prisma.techTag.create({
        data: {
          name,
          slug,
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('创建标签失败', 500);
    }
  }

  /**
   * 更新标签
   */
  async updateTag(id: string, name: string): Promise<TechTag> {
    try {
      // 检查标签是否存在
      const tag = await this.prisma.techTag.findUnique({
        where: { id },
      });

      if (!tag) {
        throw new AppError('标签不存在', 404);
      }

      // 检查名称是否已被其他标签使用
      if (name !== tag.name) {
        const existingTag = await this.prisma.techTag.findFirst({
          where: {
            name: {
              equals: name,
              mode: 'insensitive',
            },
            id: {
              not: id,
            },
          },
        });

        if (existingTag) {
          throw new AppError('标签名已被使用', 400);
        }
      }

      // 更新slug
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      return await this.prisma.techTag.update({
        where: { id },
        data: {
          name,
          slug,
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('更新标签失败', 500);
    }
  }

  /**
   * 删除标签
   */
  async deleteTag(id: string): Promise<void> {
    try {
      // 检查标签是否存在
      const tag = await this.prisma.techTag.findUnique({
        where: { id },
      });

      if (!tag) {
        throw new AppError('标签不存在', 404);
      }

      await this.prisma.techTag.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('删除标签失败', 500);
    }
  }
}
