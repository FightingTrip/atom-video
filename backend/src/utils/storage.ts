import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { config } from '../config/env';

// 初始化 S3 客户端
const s3Client = new S3Client({
  region: config.storage.region,
  endpoint: config.storage.endpoint,
  credentials: {
    accessKeyId: config.storage.accessKey,
    secretAccessKey: config.storage.secretKey,
  },
});

// 本地存储配置
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

export const uploadToStorage = async (filePath: string, type: string): Promise<string> => {
  if (config.storage.type === 'local') {
    // 本地存储
    return `/uploads/${path.basename(filePath)}`;
  } else if (config.storage.type === 's3') {
    // S3 存储
    const fileContent = await promisify(fs.readFile)(filePath);
    const key = `${type}/${path.basename(filePath)}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: config.storage.bucket,
        Key: key,
        Body: fileContent,
        ContentType: type === 'videos' ? 'video/mp4' : 'image/jpeg',
      })
    );

    // 返回可访问的 URL
    return `${config.storage.endpoint}/${config.storage.bucket}/${key}`;
  }

  throw new Error('不支持的存储类型');
};

export const deleteFile = async (filePath: string): Promise<void> => {
  if (config.storage.type === 'local') {
    // 本地存储
    const fullPath = path.join(__dirname, '../../', filePath);
    await promisify(fs.unlink)(fullPath);
  } else if (config.storage.type === 's3') {
    // S3 存储
    const key = filePath.replace(`${config.storage.endpoint}/${config.storage.bucket}/`, '');
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: config.storage.bucket,
        Key: key,
      })
    );
  }
};
