import { Injectable } from '@nestjs/common';
import ffmpeg from 'fluent-ffmpeg';

@Injectable()
export class MediaProcessor {
  processToMp3(
    inputPath: string,
    outputPath: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .noVideo()
        .audioCodec('libmp3lame')
        .on('end', () => {
          resolve();
        })
        .on('error', (error: Error) => {
          reject(error);
        })
        .save(outputPath);
    });
  }

  processToMp4(
    inputPath: string,
    outputPath: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .on('end', () => {
          resolve();
        })
        .on('error', (error: Error) => {
          reject(error);
        })
        .save(outputPath);
    });
  }
}