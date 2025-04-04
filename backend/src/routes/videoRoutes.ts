import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// 创建视频
router.post('/', async (req, res) => {
  try {
    const { title, description, url, thumbnail, userId } = req.body;
    const video = await prisma.video.create({
      data: {
        title,
        description,
        url,
        thumbnail,
        userId: Number(userId),
      },
    });
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ error: 'Error creating video' });
  }
});

// 获取所有视频
router.get('/', async (req, res) => {
  try {
    const videos = await prisma.video.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching videos' });
  }
});

// 获取单个视频
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const video = await prisma.video.findUnique({
      where: { id: Number(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching video' });
  }
});

// 更新视频
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, url, thumbnail } = req.body;
    const video = await prisma.video.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        url,
        thumbnail,
      },
    });
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Error updating video' });
  }
});

// 删除视频
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.video.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting video' });
  }
});

export default router;
