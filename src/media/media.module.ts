import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { DownloadMediaUseCase } from './use-cases/download-media.use-case';
import { MediaProcessor } from './processors/media.processor';
import { YoutubeDownloader } from './downloaders/youtube.downloader';

@Module({
  controllers: [MediaController],
  providers: [
    MediaService,
    DownloadMediaUseCase,
    MediaProcessor,
    YoutubeDownloader,
  ],
})
export class MediaModule {}