import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsUrl } from 'class-validator';

export class DownloadFromUrlDto {
  @ApiProperty({
    description: 'URL do vídeo que será processado',
    example: 'https://www.youtube.com/watch?v=exemplo',
  })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    description: 'Formato desejado para o arquivo final',
    enum: ['mp3', 'mp4'],
    example: 'mp3',
  })
  @IsIn(['mp3', 'mp4'])
  @IsNotEmpty()
  format: string;
}