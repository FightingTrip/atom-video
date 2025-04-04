import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 1024, // 1GB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传视频文件'));
    }
  },
});

export const uploadToStorage = async (file: Express.Multer.File, type: string): Promise<string> => {
  // TODO: 实现文件上传到云存储服务（如 AWS S3、阿里云 OSS 等）
  // 这里暂时返回本地文件路径
  return `/uploads/${file.filename}`;
};

export const deleteFile = async (filePath: string): Promise<void> => {
  const fullPath = path.join(__dirname, '../../', filePath);
  await promisify(fs.unlink)(fullPath);
};
