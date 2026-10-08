import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';

@Injectable()
export class YoutubeDownloader {
  download(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const outputDir = path.join(
        process.cwd(),
        'media-files',
        'input',
      );

      const outputTemplate = path.join(
        outputDir,
        '%(title)s.%(ext)s',
      );

      const ytDlpProcess = spawn('yt-dlp', [
        '-f',
        'bv*+ba/b',
        '--merge-output-format',
        'mp4',
        '--print',
        'after_move:filepath',
        '-o',
        outputTemplate,
        url,
      ]);

      let output = '';
      let errorOutput = '';

      ytDlpProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      ytDlpProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      ytDlpProcess.on('error', (error) => {
  reject(
    new Error(
      `Não foi possível executar o yt-dlp: ${error.message}`,
    ),
  );
});

      ytDlpProcess.on('close', (code) => {
        if (code !== 0) {
          reject(
            new Error(
              `Erro ao baixar o vídeo: ${errorOutput}`,
            ),
          );
          return;
        }

        const filePath = output
          .trim()
          .split(/\r?\n/)
          .pop();

        if (!filePath) {
          reject(
            new Error(
              'Não foi possível encontrar o arquivo baixado.',
            ),
          );
          return;
        }

        resolve(filePath);
      });
    });
  }
}