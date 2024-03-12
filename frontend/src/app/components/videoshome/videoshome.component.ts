import {Component, NgModule, OnInit} from '@angular/core';
import {VideoService} from "../../services/video.service";
import {Video} from "../../interfaces/video";
import {HttpErrorResponse} from "@angular/common/http";
import {RouterLink} from "@angular/router";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";


@Component({
  selector: 'app-videoshome',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    NgOptimizedImage,
    NgIf
  ],
  templateUrl: './videoshome.component.html',
  styleUrl: './videoshome.component.css'
})
export class VideoshomeComponent implements OnInit {
  public videos: Video[] = [];
  public currentPage: number = 0;
  public totalPages: number = 0;

  constructor(public videoService: VideoService) {
  }

  ngOnInit(): void {
    const storedPage = localStorage.getItem('currentPage');
    if (storedPage !== null) {
      this.currentPage = parseInt(storedPage, 10);
    }
    this.getPage(this.currentPage);
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

  public nextPage(): void {
    this.currentPage++;
    this.getPage(this.currentPage);
    localStorage.setItem('currentPage', this.currentPage.toString());
  }

  public previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getPage(this.currentPage);
      localStorage.setItem('currentPage', this.currentPage.toString());
    }
  }

  private getPage(pageNumber: number): void {
    this.videoService.getPage(pageNumber).subscribe(
      (response: Video[]) => {
        this.videos = response;
      },
      (error: HttpErrorResponse) => {
        console.error("An error occurred while fetching videos: ", error);
      }
    );
  }
}
