import { Component } from '@angular/core';
import {NgIf} from "@angular/common";
import {Video} from "../../interfaces/video";
import {ActivatedRoute} from "@angular/router";
import {VideoService} from "../../services/video.service";

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './video.component.html',
  styleUrl: './video.component.css'
})
export class VideoComponent {
  public video!: Video;

  constructor(
    public route: ActivatedRoute,
    public videoService: VideoService
  ) {
  }

  ngOnInit(): void {
    this.getVideo();
  }

  public getVideo(): void {
    // @ts-ignore
    const id = +this.route.snapshot.paramMap.get('id');
    this.videoService.getVideoById(id)
      .subscribe(
        (video: Video) => {
          this.video = video;
          console.log(this.video)
        },
        (error) => {
          console.log("this was an error in getVideo");
        }
      )
  }

}
