import ffmpeg from 'fluent-ffmpeg';
import { promisify } from 'util';
import { createReadStream } from 'fs';

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
): Promise<void> => {
  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .screenshots({
        timestamps: [time],
        filename: 'thumbnail.jpg',
        folder: outputPath,
        size: '320x180',
      })
      .on('end', resolve)
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
