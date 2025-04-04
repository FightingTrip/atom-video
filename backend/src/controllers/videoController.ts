import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getVideoDuration } from '../utils/video';
import { uploadToStorage } from '../utils/storage';
import { authenticateToken } from '../middleware/auth';

const prisma = new PrismaClient();

export const uploadVideo = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '请上传视频文件' });
    }

    if (!req.user) {
      return res.status(401).json({ message: '未授权' });
    }

    const videoFile = req.file;
    const duration = await getVideoDuration(videoFile.path);

    // 上传到存储服务
    const videoUrl = await uploadToStorage(videoFile, 'videos');

    // 创建视频记录
    const video = await prisma.video.create({
      data: {
        title: req.body.title || videoFile.originalname,
        description: req.body.description || '',
        url: videoUrl,
        duration: Math.round(duration),
        userId: req.user.id,
        tags: req.body.tags || [],
        visibility: req.body.visibility || 'PUBLIC',
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    res.status(201).json(video);
  } catch (error) {
    console.error('上传视频失败:', error);
    res.status(500).json({ message: '上传视频失败' });
  }
};

export const getVideos = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { visibility: 'PUBLIC' };
    if (req.user) {
      where.OR = [{ visibility: 'PUBLIC' }, { userId: req.user.id }];
    }

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { [sort as string]: order === 'desc' ? 'desc' : 'asc' },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      }),
      prisma.video.count({ where }),
    ]);

    res.json({
      videos,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('获取视频列表失败:', error);
    res.status(500).json({ message: '获取视频列表失败' });
  }
};

export const getVideo = async (req: Request, res: Response) => {
  try {
    const video = await prisma.video.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (!video) {
      return res.status(404).json({ message: '视频不存在' });
    }

    if (video.visibility === 'PRIVATE' && (!req.user || video.userId !== req.user.id)) {
      return res.status(403).json({ message: '无权访问此视频' });
    }

    res.json(video);
  } catch (error) {
    console.error('获取视频详情失败:', error);
    res.status(500).json({ message: '获取视频详情失败' });
  }
};

export const updateVideo = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: '未授权' });
    }

    const video = await prisma.video.findUnique({
      where: { id: req.params.id },
    });

    if (!video) {
      return res.status(404).json({ message: '视频不存在' });
    }

    if (video.userId !== req.user.id) {
      return res.status(403).json({ message: '无权修改此视频' });
    }

    const updatedVideo = await prisma.video.update({
      where: { id: req.params.id },
      data: {
        title: req.body.title,
        description: req.body.description,
        tags: req.body.tags,
        visibility: req.body.visibility,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    res.json(updatedVideo);
  } catch (error) {
    console.error('更新视频失败:', error);
    res.status(500).json({ message: '更新视频失败' });
  }
};

export const deleteVideo = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: '未授权' });
    }

    const video = await prisma.video.findUnique({
      where: { id: req.params.id },
    });

    if (!video) {
      return res.status(404).json({ message: '视频不存在' });
    }

    if (video.userId !== req.user.id) {
      return res.status(403).json({ message: '无权删除此视频' });
    }

    await prisma.video.delete({
      where: { id: req.params.id },
    });

    // TODO: 删除存储中的视频文件

    res.json({ message: '视频删除成功' });
  } catch (error) {
    console.error('删除视频失败:', error);
    res.status(500).json({ message: '删除视频失败' });
  }
};
