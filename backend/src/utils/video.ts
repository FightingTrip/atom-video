import ffmpeg from 'fluent-ffmpeg';
import { promisify } from 'util';
import { createReadStream } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/env';

export const getVideoDuration = async (filePath: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(metadata.format.duration || 0);
    });
  });
};

export const generateThumbnail = async (
  filePath: string,
  outputPath: string,
  time: string = '00:00:01'
): Promise<string> => {
  const thumbnailName = `${uuidv4()}.jpg`;
  const thumbnailPath = path.join(outputPath, thumbnailName);

  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .screenshots({
        timestamps: [time],
        filename: thumbnailName,
        folder: outputPath,
        size: '320x180',
      })
      .on('end', () => resolve(thumbnailPath))
      .on('error', reject);
  });
};

export const getVideoInfo = async (filePath: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({
        duration: metadata.format.duration,
        size: metadata.format.size,
        bitrate: metadata.format.bit_rate,
        codec: metadata.streams[0].codec_name,
        width: metadata.streams[0].width,
        height: metadata.streams[0].height,
      });
    });
  });
};

export const processVideo = async (
  file: Express.Multer.File
): Promise<{
  videoPath: string;
  thumbnailPath: string;
  duration: number;
}> => {
  const videoId = uuidv4();
  const videoDir = config.video.storageDir;
  const thumbnailDir = config.video.thumbnailDir;
  const videoPath = path.join(videoDir, `${videoId}.mp4`);
  const thumbnailPath = path.join(thumbnailDir, `${videoId}.jpg`);

  // 转码视频
  await new Promise((resolve, reject) => {
    ffmpeg(file.path)
      .outputOptions([
        '-c:v libx264', // 视频编码
        '-preset medium', // 编码速度
        '-crf 23', // 视频质量
        '-c:a aac', // 音频编码
        '-b:a 128k', // 音频比特率
        '-movflags +faststart', // 快速启动
      ])
      .output(videoPath)
      .on('end', resolve)
      .on('error', reject)
      .run();
  });

  // 生成缩略图
  await generateThumbnail(videoPath, thumbnailDir);

  // 获取视频时长
  const duration = await getVideoDuration(videoPath);

  return {
    videoPath,
    thumbnailPath,
    duration,
  };
};
