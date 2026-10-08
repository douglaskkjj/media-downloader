import {
  BadRequestException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';

import * as path from 'path';
import { randomUUID } from 'crypto';
import { createReadStream, existsSync, unlink } from 'fs';

import { MediaProcessor } from './processors/media.processor';

@Injectable()
export class MediaService {
  constructor(
    private readonly mediaProcessor: MediaProcessor,
  ) {}

  async download(file: any, format: string) {
    const inputPath = file.path;
    const originalName = path.parse(file.originalname).name;

    return this.processFile(
      inputPath,
      originalName,
      format,
    );
  }

  async downloadFromDownloadedFile(
    inputPath: string,
    format: string,
  ) {
    const originalName = path.parse(inputPath).name;

    return this.processFile(
      inputPath,
      originalName,
      format,
    );
  }

  private async processFile(
    inputPath: string,
    originalName: string,
    format: string,
  ) {
    if (format !== 'mp3' && format !== 'mp4') {
      throw new BadRequestException(
        'O formato deve ser mp3 ou mp4',
      );
    }

    const uniqueId = randomUUID();

    const outputFileName =
      `${originalName}-${uniqueId}.${format}`;

    const outputPath = path.join(
      process.cwd(),
      'media-files',
      'output',
      outputFileName,
    );

    if (format === 'mp3') {
      await this.mediaProcessor.processToMp3(
        inputPath,
        outputPath,
      );
    } else {
      await this.mediaProcessor.processToMp4(
        inputPath,
        outputPath,
      );
    }

    await new Promise<void>((resolve, reject) => {
      unlink(inputPath, (error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });

    return {
      status: 'concluido',
      mensagem: 'Arquivo convertido com sucesso',
      arquivo: outputFileName,
      download: `/media/download/${outputFileName}`,
    };
  }

  downloadFile(fileName: string) {
    const outputDir = path.resolve(
      process.cwd(),
      'media-files',
      'output',
    );

    const safeFileName = path.basename(fileName);

    const filePath = path.join(
      outputDir,
      safeFileName,
    );

    if (!existsSync(filePath)) {
      throw new NotFoundException(
        'Arquivo não encontrado',
      );
    }

    const file = createReadStream(filePath);

    const extension =
      path.extname(safeFileName).toLowerCase();

    const contentType =
      extension === '.mp3'
        ? 'audio/mpeg'
        : extension === '.mp4'
          ? 'video/mp4'
          : 'application/octet-stream';

    return new StreamableFile(file, {
      type: contentType,
      disposition: `attachment; filename="${safeFileName}"`,
    });
  }
}