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

  constructor(
  private mediaService: MediaService,
  private cdr: ChangeDetectorRef,
  private sanitizer: DomSanitizer
) {}

  selectFormat(format: string) {
    this.format = format;
  }

  convert() {
    this.loading = true;
    this.downloadUrl.set('');

    this.mediaService
      .downloadFromUrl(this.url, this.format)
      .subscribe({
        next: (response: any) => {
          console.log(response);

          const url =
  'https://media-downloader-bzg5.onrender.com' +
  response.download;

this.downloadUrl.set(
  this.sanitizer.bypassSecurityTrustUrl(url)
);

          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error(error);
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
