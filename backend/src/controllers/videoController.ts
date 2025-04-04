import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 创建视频
export const createVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, video_url, thumbnail_url, duration, version } = req.body;
    const video = await prisma.video.create({
      data: {
        title,
        description,
        video_url,
        thumbnail_url,
        duration,
        version,
        uploader_id: 1, // 临时使用固定值，实际应用中应该从认证信息中获取
      },
    });
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ error: 'Error creating video' });
  }
};

// 获取所有视频
export const getVideos = async (req: Request, res: Response): Promise<void> => {
  try {
    const videos = await prisma.video.findMany();
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching videos' });
  }
};

// 获取单个视频
export const getVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const video = await prisma.video.findUnique({
      where: { id: parseInt(id) },
    });

    if (!video) {
      res.status(404).json({ error: 'Video not found' });
      return;
    }

    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching video' });
  }
};

// 更新视频
export const updateVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, video_url, thumbnail_url, duration, version } = req.body;
    const video = await prisma.video.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        video_url,
        thumbnail_url,
        duration,
        version,
      },
    });
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Error updating video' });
  }
};

// 删除视频
export const deleteVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.video.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting video' });
  }
};
