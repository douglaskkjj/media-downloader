import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { DownloadFromUrlDto } from './dto/download-from-url.dto';
import { DownloadMediaUseCase } from './use-cases/download-media.use-case';

@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(
    private readonly downloadMediaUseCase: DownloadMediaUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Converte um vídeo para MP3 ou MP4',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        format: {
          type: 'string',
          enum: ['mp3', 'mp4'],
          example: 'mp3',
        },
      },
      required: ['file', 'format'],
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './media-files/input',
    }),
  )
  download(
    @UploadedFile() file: any,
    @Body('format') format: string,
  ) {
    return this.downloadMediaUseCase.execute(
      file,
      format,
    );
  }

  @Get('download/:fileName')
  downloadFile(@Param('fileName') fileName: string) {
    return this.downloadMediaUseCase.downloadFile(
      fileName,
    );
  }

  @Post('url')
  @ApiOperation({
    summary: 'Baixa e converte uma mídia a partir de uma URL',
  })
  @ApiBody({
    type: DownloadFromUrlDto,
  })
  downloadFromUrl(
    @Body() dto: DownloadFromUrlDto,
  ) {
    return this.downloadMediaUseCase.downloadFromUrl(
      dto.url,
      dto.format,
    );
  }
}