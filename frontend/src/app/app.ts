import { ChangeDetectorRef, Component, signal } from '@angular/core';
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
  downloadUrl = signal('');
  loading = false;

  constructor(
    private mediaService: MediaService,
    private cdr: ChangeDetectorRef
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

          this.downloadUrl.set(
            'http://localhost:3000' + response.download
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
