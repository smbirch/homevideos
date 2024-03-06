import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Video} from "../interfaces/video";

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private apiServerUrl = 'http://localhost:8080/content';

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
}
