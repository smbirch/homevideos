import { Component, EventEmitter, Input, Output } from '@angular/core';
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

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
  @Output() closeModal = new EventEmitter<void>();
  newTitle: string = '';

  updateTitle(): void {
    console.log('Updating title to:', this.newTitle);
    // Implement logic to update title
    this.closeModal.emit();
  }

  onCloseModal(): void {
    this.closeModal.emit();
  }
}
