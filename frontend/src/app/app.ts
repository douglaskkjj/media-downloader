
import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MediaService } from './services/media.service';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  format = 'mp3';
  url = '';
  downloadUrl = signal<SafeUrl>('');
  loading = false;

  statusMessage = '';
  errorMessage = '';

  constructor(
    private mediaService: MediaService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  selectFormat(format: string) {
    this.format = format;
  }

  convert() {
    if (!this.url.trim()) {
      this.errorMessage = 'Cole a URL de um vídeo antes de continuar.';
      this.statusMessage = '';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.downloadUrl.set('');
    this.statusMessage =
      'esperarando o servidor. Isso pode levar um tempin...';

    this.mediaService
      .downloadFromUrl(this.url, this.format)
      .subscribe({
        next: (response: any) => {
          const url =
            'https://media-downloader-bzg5.onrender.com' +
            response.download;

          this.downloadUrl.set(
            this.sanitizer.bypassSecurityTrustUrl(url)
          );

          this.statusMessage = 'Arquivo pronto para baixar!';
          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error('Erro ao processar mídia:', error);

          if (error.status === 0) {
            this.errorMessage =
              'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';
          } else if (error.status === 502 || error.status === 504) {
            this.errorMessage =
              'O servidor demorou demais ou ficou indisponível. Aguarde um pouco e tente novamente.';
          } else {
            const message = error.error?.message;

            this.errorMessage = Array.isArray(message)
              ? message.join(' ')
              : typeof message === 'string'
                ? message
                : 'Não foi possível processar o vídeo. Tente novamente.';
          }

          this.statusMessage = '';
          this.loading = false;
          this.cdr.detectChanges();
        },

        complete: () => {
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }
}
