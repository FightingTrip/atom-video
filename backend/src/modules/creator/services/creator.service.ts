/**
 * 创作者服务模块
 *
 * 实现创作者相关的业务逻辑
 * @module creator/services/creator
 */

import { PrismaClient } from '@prisma/client';
import { 
  CreatorApplicationDto, 
  CreatorApplicationStatus, 
  CreatorQueryDto, 
  ReviewCreatorApplicationDto, 
  UpdateCreatorProfileDto,
  buildCreatorApplicationWhereClause,
  CreatorStatsDto
} from '../models/creator.model';
import { UserRole } from '../../common/middleware/auth.middleware';
import { HttpException } from '../../common/exceptions/http.exception';

/**
 * 创作者服务类
 * 处理与创作者相关的业务逻辑
 */
export class CreatorService {
  private prisma: PrismaClient;

  /**
   * 构造函数
   */
  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * 提交创作者申请
   * @param applicationData 申请数据
   * @returns 创建的申请
   */
  public async applyForCreator(applicationData: CreatorApplicationDto): Promise<any> {
    // 检查用户是否存在
    const user = await this.prisma.user.findUnique({
      where: { id: applicationData.userId },
    });

    if (!user) {
      throw new HttpException(404, '用户不存在');
    }

    // 检查用户是否已经是创作者
    if (user.isCreator) {
      throw new HttpException(400, '用户已经是创作者');
    }

    // 检查是否有待审核的申请
    const pendingApplication = await this.prisma.creatorApplication.findFirst({
      where: {
        userId: applicationData.userId,
        status: CreatorApplicationStatus.PENDING,
      },
    });

    if (pendingApplication) {
      throw new HttpException(400, '已有待审核的申请');
    }

    // 创建申请
    const creatorApplication = await this.prisma.creatorApplication.create({
      data: {
        userId: applicationData.userId,
        motivation: applicationData.motivation,
        portfolioUrl: applicationData.portfolioUrl,
        experienceDescription: applicationData.experienceDescription,
        socialMediaLinks: applicationData.socialMediaLinks,
        creatorType: applicationData.creatorType,
        specializations: applicationData.specializations,
        programmingLanguages: applicationData.programmingLanguages,
        technologies: applicationData.technologies,
        status: CreatorApplicationStatus.PENDING,
      },
    });

    return creatorApplication;
  }

  /**
   * 获取创作者申请列表
   * @param queryParams 查询参数
   * @returns 申请列表
   */
  public async getCreatorApplications(queryParams: CreatorQueryDto): Promise<{ items: any[]; total: number }> {
    const where = buildCreatorApplicationWhereClause(queryParams);

    // 获取总数
    const total = await this.prisma.creatorApplication.count({ where });

    // 获取分页数据
    const items = await this.prisma.creatorApplication.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
            avatarUrl: true,
            bio: true,
          },
        },
        reviewer: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
      orderBy: {
        [queryParams.sortBy || 'createdAt']: queryParams.sortOrder || 'desc',
      },
      skip: queryParams.page && queryParams.pageSize ? (queryParams.page - 1) * queryParams.pageSize : 0,
      take: queryParams.pageSize || 10,
    });

    return { items, total };
  }

  /**
   * 获取单个创作者申请
   * @param id 申请ID
   * @returns 申请详情
   */
  public async getCreatorApplicationById(id: string): Promise<any> {
    const application = await this.prisma.creatorApplication.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
            avatarUrl: true,
            bio: true,
          },
        },
        reviewer: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
    });

    if (!application) {
      throw new HttpException(404, '申请不存在');
    }

    return application;
  }

  /**
   * 审核创作者申请
   * @param id 申请ID
   * @param reviewData 审核数据
   * @param reviewerId 审核人ID
   * @returns 更新后的申请
   */
  public async reviewCreatorApplication(
    id: string,
    reviewData: ReviewCreatorApplicationDto,
    reviewerId: string
  ): Promise<any> {
    // 检查申请是否存在
    const application = await this.prisma.creatorApplication.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!application) {
      throw new HttpException(404, '申请不存在');
    }

    // 检查申请是否待审核
    if (application.status !== CreatorApplicationStatus.PENDING) {
      throw new HttpException(400, '该申请已经被审核');
    }

    // 开启事务
    return this.prisma.$transaction(async (tx) => {
      // 更新申请状态
      const updatedApplication = await tx.creatorApplication.update({
        where: { id },
        data: {
          status: reviewData.status,
          reviewerId,
          reviewerComment: reviewData.reviewerComment,
          reviewedAt: new Date(),
        },
      });

      // 如果批准申请，更新用户为创作者
      if (reviewData.status === CreatorApplicationStatus.APPROVED) {
        await tx.user.update({
          where: { id: application.userId },
          data: {
            isCreator: true,
            role: UserRole.CREATOR,
          },
        });

        // 创建通知
        await tx.notification.create({
          data: {
            userId: application.userId,
            type: 'CREATOR_APPROVED',
            title: '创作者申请已批准',
            content: '恭喜！您的创作者申请已获批准，现在您可以上传视频内容了。',
          },
        });
      } else if (reviewData.status === CreatorApplicationStatus.REJECTED) {
        // 创建拒绝通知
        await tx.notification.create({
          data: {
            userId: application.userId,
            type: 'CREATOR_REJECTED',
            title: '创作者申请被拒绝',
            content: `很遗憾，您的创作者申请未获批准。${
              reviewData.reviewerComment ? `原因：${reviewData.reviewerComment}` : ''
            }`,
          },
        });
      }

      return updatedApplication;
    });
  }

  /**
   * 获取用户的创作者申请
   * @param userId 用户ID
   * @returns 用户的创作者申请
   */
  public async getUserApplications(userId: string): Promise<any[]> {
    const applications = await this.prisma.creatorApplication.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return applications;
  }

  /**
   * 更新创作者资料
   * @param userId 用户ID
   * @param profileData 资料数据
   * @returns 更新后的用户
   */
  public async updateCreatorProfile(userId: string, profileData: UpdateCreatorProfileDto): Promise<any> {
    // 检查用户是否存在且是创作者
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException(404, '用户不存在');
    }

    if (!user.isCreator) {
      throw new HttpException(400, '用户不是创作者');
    }

    // 更新创作者资料
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        channelDescription: profileData.channelDescription,
        channelBannerUrl: profileData.channelBannerUrl,
      },
    });

    // 更新用户的专长领域、编程语言和技术栈
    if (profileData.programmingLanguages && profileData.programmingLanguages.length > 0) {
      // 先删除现有的关联
      await this.prisma.userProgrammingLanguage.deleteMany({
        where: { userId },
      });

      // 添加新的关联
      for (const langId of profileData.programmingLanguages) {
        await this.prisma.userProgrammingLanguage.create({
          data: {
            userId,
            languageId: langId,
          },
        });
      }
    }

    if (profileData.technologies && profileData.technologies.length > 0) {
      // 先删除现有的关联
      await this.prisma.userTechnology.deleteMany({
        where: { userId },
      });

      // 添加新的关联
      for (const techId of profileData.technologies) {
        await this.prisma.userTechnology.create({
          data: {
            userId,
            technologyId: techId,
          },
        });
      }
    }

    return updatedUser;
  }

  /**
   * 获取创作者统计数据
   * @param userId 用户ID
   * @returns 创作者统计数据
   */
  public async getCreatorStats(userId: string): Promise<CreatorStatsDto> {
    // 检查用户是否存在且是创作者
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException(404, '用户不存在');
    }

    if (!user.isCreator) {
      throw new HttpException(400, '用户不是创作者');
    }

    // 获取视频总数
    const totalVideos = await this.prisma.video.count({
      where: { creatorId: userId },
    });

    // 获取观看总数
    const viewsResult = await this.prisma.video.aggregate({
      where: { creatorId: userId },
      _sum: { viewCount: true },
    });
    const totalViews = viewsResult._sum.viewCount || 0;

    // 获取点赞总数
    const likesResult = await this.prisma.video.aggregate({
      where: { creatorId: userId },
      _sum: { likeCount: true },
    });
    const totalLikes = likesResult._sum.likeCount || 0;

    // 获取订阅者总数
    const totalSubscribers = await this.prisma.subscription.count({
      where: { creatorId: userId },
    });

    // 获取评论总数
    const commentsResult = await this.prisma.video.aggregate({
      where: { creatorId: userId },
      _sum: { commentCount: true },
    });
    const totalComments = commentsResult._sum.commentCount || 0;

    // 获取平均视频评分
    const videos = await this.prisma.video.findMany({
      where: { creatorId: userId },
      select: {
        contentAccuracy: {
          select: {
            overallRating: true,
          },
        },
      },
    });

    const ratings = videos
      .filter((v) => v.contentAccuracy?.overallRating !== undefined)
      .map((v) => v.contentAccuracy!.overallRating);
    const averageVideoRating =
      ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

    return {
      totalVideos,
      totalViews,
      totalLikes,
      totalSubscribers,
      totalComments,
      averageVideoRating,
    };
  }

  /**
   * 获取优秀创作者列表
   * @param limit 数量限制
   * @returns 创作者列表
   */
  public async getTopCreators(limit: number = 10): Promise<any[]> {
    // 获取所有创作者
    const creators = await this.prisma.user.findMany({
      where: { isCreator: true },
      select: {
        id: true,
        username: true,
        name: true,
        avatarUrl: true,
        bio: true,
        channelDescription: true,
        _count: {
          select: {
            videos: true,
            subscribersFrom: true,
          },
        },
      },
      take: limit,
      orderBy: [
        { subscribersFrom: { _count: 'desc' } },
        { videos: { _count: 'desc' } },
      ],
    });

    return creators.map((creator) => ({
      ...creator,
      videosCount: creator._count.videos,
      subscribersCount: creator._count.subscribersFrom,
      _count: undefined,
    }));
  }
} 