/**
 * 订阅服务单元测试
 */
import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from '../services/subscription.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let prismaService: PrismaService;

  // 创建模拟的PrismaService
  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    subscription: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SubscriptionService>(SubscriptionService);
    prismaService = module.get<PrismaService>(PrismaService);

    // 在每个测试前重置所有模拟函数
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('subscribe', () => {
    it('should create a subscription successfully', async () => {
      // 设置模拟数据
      const userId = 'user1';
      const creatorId = 'creator1';
      const notificationEnabled = true;

      // 设置模拟函数返回值
      mockPrismaService.user.findUnique.mockResolvedValue({ id: creatorId });
      mockPrismaService.subscription.findUnique.mockResolvedValue(null);
      mockPrismaService.subscription.create.mockResolvedValue({
        id: 'sub1',
        userId,
        creatorId,
        notificationEnabled,
        subscribedAt: new Date(),
      });

      // 调用服务方法
      const result = await service.subscribe(userId, creatorId, notificationEnabled);

      // 验证结果
      expect(result).toBeDefined();
      expect(result.userId).toBe(userId);
      expect(result.creatorId).toBe(creatorId);
      expect(result.notificationEnabled).toBe(notificationEnabled);

      // 验证模拟函数是否被正确调用
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: creatorId },
      });
      expect(mockPrismaService.subscription.findUnique).toHaveBeenCalledWith({
        where: {
          userId_creatorId: {
            userId,
            creatorId,
          },
        },
      });
      expect(mockPrismaService.subscription.create).toHaveBeenCalledWith({
        data: {
          userId,
          creatorId,
          notificationEnabled,
          subscribedAt: expect.any(Date),
        },
      });
    });

    it('should return existing subscription if already subscribed', async () => {
      // 设置模拟数据
      const userId = 'user1';
      const creatorId = 'creator1';
      const existingSubscription = {
        id: 'sub1',
        userId,
        creatorId,
        notificationEnabled: true,
        subscribedAt: new Date(),
      };

      // 设置模拟函数返回值
      mockPrismaService.user.findUnique.mockResolvedValue({ id: creatorId });
      mockPrismaService.subscription.findUnique.mockResolvedValue(existingSubscription);

      // 调用服务方法
      const result = await service.subscribe(userId, creatorId, true);

      // 验证结果
      expect(result).toEqual(existingSubscription);

      // 验证模拟函数是否被正确调用
      expect(mockPrismaService.subscription.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when user tries to subscribe to themselves', async () => {
      const userId = 'user1';

      await expect(service.subscribe(userId, userId, true)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.user.findUnique).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when creator does not exist', async () => {
      const userId = 'user1';
      const creatorId = 'nonexistent';

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.subscribe(userId, creatorId, true)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.subscription.findUnique).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException on subscription creation failure', async () => {
      const userId = 'user1';
      const creatorId = 'creator1';

      mockPrismaService.user.findUnique.mockResolvedValue({ id: creatorId });
      mockPrismaService.subscription.findUnique.mockResolvedValue(null);
      mockPrismaService.subscription.create.mockRejectedValue(new Error('Database error'));

      await expect(service.subscribe(userId, creatorId, true)).rejects.toThrow(BadRequestException);
    });
  });

  // 可以添加更多测试用例，例如unsubscribe, getUserSubscriptions, checkSubscriptionStatus等
});
