import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  private apiUrl = 'https://media-downloader-bzg5.onrender.com/media';

  constructor(private http: HttpClient) {}

  downloadFromUrl(url: string, format: string) {
    return this.http.post(
      `${this.apiUrl}/url`,
      {
        url,
        format
      }
    );
  }

}
