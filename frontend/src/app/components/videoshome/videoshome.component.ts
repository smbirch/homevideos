import { Component } from '@angular/core';
import {VideoService} from "../../services/video.service";
import {Video} from "../../interfaces/video";
import {HttpErrorResponse} from "@angular/common/http";
import {RouterLink} from "@angular/router";
import {NgForOf} from "@angular/common";


@Component({
  selector: 'app-videoshome',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf
  ],
  templateUrl: './videoshome.component.html',
  styleUrl: './videoshome.component.css'
})
export class VideoshomeComponent {
  public videos: Video[] = [];

  constructor(public videoService: VideoService) {}

  ngOnInit(): void {
    this.getVideos();
  }

  public getVideos(): void {
    this.videoService.getVideos().subscribe(
      (response: Video[]) => {
        this.videos = response;
      },
      (error: HttpErrorResponse) => {
        console.error("An error occurred while fetching videos: ", error);
      }
    );
  }

}
