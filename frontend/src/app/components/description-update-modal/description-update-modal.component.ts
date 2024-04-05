import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

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
  @Output() closeModal = new EventEmitter<void>();
  newDescription: string = '';


  updateDescription(): void {
    console.log('Updating description to:', this.newDescription);
    // Implement logic to update title
    this.closeModal.emit();
  }

  onCloseModal(): void {
    this.closeModal.emit();
  }
}
