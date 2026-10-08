import { Injectable } from '@nestjs/common';
import { MediaService } from '../media.service';
import { YoutubeDownloader } from '../downloaders/youtube.downloader';

@Injectable()
export class DownloadMediaUseCase {
  constructor(
    private readonly mediaService: MediaService,
    private readonly youtubeDownloader: YoutubeDownloader,
  ) {}

  execute(file: any, format: string) {
    return this.mediaService.download(file, format);
  }

  async downloadFromUrl(
    url: string,
    format: string,
  ) {
    const inputPath =
      await this.youtubeDownloader.download(url);

    return this.mediaService.downloadFromDownloadedFile(
      inputPath,
      format,
    );
  }

  downloadFile(fileName: string) {
    return this.mediaService.downloadFile(fileName);
  }
}