import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { VideoService } from "../../services/video.service";
import { VideoRequestDto } from "../../DTOs/video-request-dto";
import { Location } from '@angular/common';

@Component({
  selector: 'app-title-update-modal',
  templateUrl: './title-update-modal.component.html',
  standalone: true,
  imports: [
    NgIf,
    FormsModule
  ],
  styleUrls: ['./title-update-modal.component.css']
})
export class TitleUpdateModalComponent {
  @Input() isOpen: boolean = false;
  @Input() currentTitle: string = '';
  @Input() videoId: number = 0;
  @Output() closeModal = new EventEmitter<void>();
  @Output() titleUpdated = new EventEmitter<string>();
  newTitle: string = '';

  constructor(private videoService: VideoService, private location: Location) {
  }

  updateTitle(): void {
    const videoRequestDto: VideoRequestDto = {
      description: "",
      id: this.videoId,
      title: this.newTitle
    };
    this.videoService.updateVideoTitle(videoRequestDto).subscribe(
      response => {
        this.titleUpdated.emit(this.newTitle);
        this.closeModal.emit();
      },
      error => {
        console.error('Failed to update title:', error);
        // TODO handle error
      }
    );
  }

  CloseModal() {
    this.closeModal.emit();
  }
}
