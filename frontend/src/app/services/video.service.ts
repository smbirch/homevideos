import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Video} from "../interfaces/video";
import {VideoRequestDto} from "../DTOs/video-request-dto";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private apiServerUrl = `${environment.apiServerUrl}/content`;

  constructor(private http: HttpClient) {}


  public getVideos(): Observable<Video[]> {
    return this.http.get<Video[]>(`${this.apiServerUrl}/all`);
  }

  public getThumbnails(): Observable<String[]> {
    return this.http.get<String[]>(`${this.apiServerUrl}/all/thumbnails`)
  }

  public getVideoById(id: number): Observable<Video> {
    return this.http.get<Video>(`${this.apiServerUrl}/${id}`);
  }

  public getPage(pageNumber: number) {
    return this.http.get<Video[]>(`${this.apiServerUrl}/page?page=${pageNumber}`)
  }

  public updateVideoTitle(videoRequestDto: VideoRequestDto): Observable<Video> {
    return this.http.patch<Video>(`${this.apiServerUrl}/update/title`, videoRequestDto);
  }

  updateVideoDescription(videoRequestDto: VideoRequestDto) {
    return this.http.patch<Video>(`${this.apiServerUrl}/update/description`, videoRequestDto);
  }
}
