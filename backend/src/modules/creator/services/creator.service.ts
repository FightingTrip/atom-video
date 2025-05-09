/**
 * 创作者服务模块
 *
 * 实现创作者相关的业务逻辑
 * @module creator/services/creator
 */

import { PrismaClient, Prisma } from '@prisma/client';
import { 
  CreatorApplicationDto, 
  CreatorApplicationStatus, 
  CreatorQueryDto, 
  ReviewCreatorApplicationDto, 
  UpdateCreatorProfileDto,
  CreatorStatsDto,
  buildCreatorApplicationWhereClause
} from '../models/creator.model';
import { UserRole } from '../../common/middleware/auth.middleware';
import { HttpException } from '../../common/exceptions/http.exception';

interface VideoWithContentAccuracy {
  contentAccuracy?: {
    overallRating: number;
  } | null;
}

interface CreatorWithCounts {
  id: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  channelDescription: string | null;
  _count: {
    videos: number;
    subscribersFrom: number;
  };
}

/**
 * 创作者服务类
 * 处理与创作者相关的业务逻辑
 */
export class CreatorService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * 提交创作者申请
   * @param userId 用户ID
   * @param applicationData 申请数据
   * @returns 创建的申请记录
   */
  public async submitCreatorApplication(
    userId: string,
    applicationData: CreatorApplicationDto
  ): Promise<any> {
    // 检查用户是否已经是创作者
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException(404, '用户不存在');
    }

    if (user.isCreator) {
      throw new HttpException(400, '用户已经是创作者');
    }

    // 检查是否有待审核的申请
    const pendingApplication = await this.prisma.creatorApplication.findFirst({
      where: {
        userId,
        status: CreatorApplicationStatus.PENDING,
      },
    });

    if (pendingApplication) {
      throw new HttpException(400, '已有待审核的创作者申请');
    }

    // 创建申请记录
    return this.prisma.creatorApplication.create({
      data: {
        userId,
        ...applicationData,
        status: CreatorApplicationStatus.PENDING,
        submittedAt: new Date(),
      },
    });
  }

  /**
   * 获取创作者申请列表
   * @param query 查询参数
   * @returns 申请列表和总数
   */
  public async getCreatorApplications(query: CreatorQueryDto): Promise<{ data: any[]; total: number }> {
    const { page = 1, pageSize = 10, ...filters } = query;
    const skip = (page - 1) * pageSize;

    const where = buildCreatorApplicationWhereClause(filters);

    const [applications, total] = await Promise.all([
      this.prisma.creatorApplication.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: {
          submittedAt: 'desc',
        },
      }),
      this.prisma.creatorApplication.count({ where }),
    ]);

    return { data: applications, total };
  }

  /**
   * 审核创作者申请
   * @param id 申请ID
   * @param reviewData 审核数据
   * @param reviewerId 审核人ID
   * @returns 更新后的申请记录
   */
  public async reviewCreatorApplication(
    id: string,
    reviewData: ReviewCreatorApplicationDto,
    reviewerId: string
  ): Promise<any> {
    // 检查申请是否存在
    const application = await this.prisma.creatorApplication.findUnique({
      where: { id },
    });

    if (!application) {
      throw new HttpException(404, '创作者申请不存在');
    }

    if (application.status !== CreatorApplicationStatus.PENDING) {
      throw new HttpException(400, '该申请已被审核');
    }

    // 使用事务确保数据一致性
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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
   * 更新创作者资料
   * @param userId 用户ID
   * @param profileData 资料数据
   * @returns 更新后的用户信息
   */
  public async updateCreatorProfile(
    userId: string,
    profileData: UpdateCreatorProfileDto
  ): Promise<any> {
    // 检查用户是否是创作者
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException(404, '用户不存在');
    }

    if (!user.isCreator) {
      throw new HttpException(403, '只有创作者才能更新资料');
    }

    // 更新用户资料
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        channelDescription: profileData.channelDescription,
        channelBannerUrl: profileData.channelBannerUrl,
        programmingLanguages: profileData.programmingLanguages,
        technologies: profileData.technologies,
      },
    });
  }

  /**
   * 获取创作者统计数据
   * @param userId 用户ID
   * @returns 统计数据
   */
  public async getCreatorStats(userId: string): Promise<CreatorStatsDto> {
    // 检查用户是否是创作者
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException(404, '用户不存在');
    }

    if (!user.isCreator) {
      throw new HttpException(403, '只有创作者才能查看统计数据');
    }

    // 获取视频相关统计
    const [videos, subscribers] = await Promise.all([
      this.prisma.video.findMany({
        where: { creatorId: userId },
        include: {
          _count: {
            select: {
              views: true,
              likes: true,
              comments: true,
            },
          },
          contentAccuracy: {
            select: {
              overallRating: true,
            },
          },
        },
      }),
      this.prisma.subscription.count({
        where: { creatorId: userId },
      }),
    ]);

    // 计算统计数据
    const totalVideos = videos.length;
    const totalViews = videos.reduce((sum, video) => sum + video._count.views, 0);
    const totalLikes = videos.reduce((sum, video) => sum + video._count.likes, 0);
    const totalComments = videos.reduce((sum, video) => sum + video._count.comments, 0);
    const totalSubscribers = subscribers;

    // 计算平均视频评分
    const ratings = videos
      .map((video) => video.contentAccuracy?.overallRating)
      .filter((rating): rating is number => rating !== null && rating !== undefined);

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
    }) as CreatorWithCounts[];

    return creators.map((creator: CreatorWithCounts) => ({
      ...creator,
      videosCount: creator._count.videos,
      subscribersCount: creator._count.subscribersFrom,
      _count: undefined,
    }));
  }
} 