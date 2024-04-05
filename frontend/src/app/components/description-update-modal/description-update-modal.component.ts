import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Location, NgIf} from "@angular/common";
import {VideoRequestDto} from "../../DTOs/video-request-dto";
import {VideoService} from "../../services/video.service";

@Component({
  selector: 'app-description-update-modal',
  standalone: true,
    imports: [
        FormsModule,
        NgIf
    ],
  templateUrl: './description-update-modal.component.html',
  styleUrl: './description-update-modal.component.css'
})
export class DescriptionUpdateModalComponent {
  @Input() isOpen: boolean = false;
  @Input() currentDescription: string = '';
  @Input() videoId: number = 0;
  @Output() closeModal = new EventEmitter<void>();
  @Output() descriptionUpdated = new EventEmitter<string>();
  newDescription: string = '';
  @Input() currentTitle: string = '';

  constructor(private videoService: VideoService) {
  }

  updateDescription(): void {
    console.log('Updating description to:', this.newDescription);
    const videoRequestDto: VideoRequestDto = {
      description: this.newDescription,
      id: this.videoId,
      title: ""
    };
    this.videoService.updateVideoDescription(videoRequestDto).subscribe(
     response => {
        this.descriptionUpdated.emit(this.newDescription);
        this.closeModal.emit();
    },
      error => {
        console.error('Failed to update title:', error);
        // TODO handle error
      }
    );
  }

  onCloseModal(): void {
    this.closeModal.emit();
  }
}
