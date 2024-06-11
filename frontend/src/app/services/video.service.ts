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
  private apiServerUrl = environment.apiServerUrl;

  constructor(private http: HttpClient) {}


  public getVideos(): Observable<Video[]> {
    return this.http.get<Video[]>(`${this.apiServerUrl}/content/all`);
  }

  public getThumbnails(): Observable<String[]> {
    return this.http.get<String[]>(`${this.apiServerUrl}/content/all/thumbnails`)
  }

  public getVideoById(id: number): Observable<Video> {
    return this.http.get<Video>(`${this.apiServerUrl}/content/${id}`);
  }

  public getPage(pageNumber: number) {
    return this.http.get<Video[]>(`${this.apiServerUrl}/content/page?page=${pageNumber}`)
  }

  public updateVideoTitle(videoRequestDto: VideoRequestDto): Observable<Video> {
    return this.http.patch<Video>(`${this.apiServerUrl}/content/update/title`, videoRequestDto);
  }

  updateVideoDescription(videoRequestDto: VideoRequestDto) {
    return this.http.patch<Video>(`${this.apiServerUrl}/content/update/description`, videoRequestDto);
  }
}
