import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Comment } from '../../interfaces/comment';
import {DatePipe, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    DatePipe
  ],
  styleUrls: ['./comment.component.css']
})
export class CommentComponent {
  @Input() comment!: Comment;
  @Output() deleteComment = new EventEmitter<number>();
  @Output() editComment = new EventEmitter<Comment>();

  isEditing: boolean = false;
  editedText: string = '';

  onDelete() {
    this.deleteComment.emit(this.comment.id);
  }

  onEdit() {
    this.isEditing = true;
    this.editedText = this.comment.text;
  }

  saveEdit() {
    if (this.editedText.trim()) {
      const updatedComment = { ...this.comment, text: this.editedText };
      this.editComment.emit(updatedComment);
      this.isEditing = false;
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.editedText = '';
  }
}
