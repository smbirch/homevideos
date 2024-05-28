import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Comment} from '../../interfaces/comment';
import {UserService} from '../../services/user.service';
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
export class CommentComponent implements OnInit {
  @Input() comment!: Comment;
  @Output() deleteComment = new EventEmitter<number>();
  @Output() editComment = new EventEmitter<Comment>();
  isEditing: boolean = false;
  editedText: string = '';
  isAdmin: boolean = false;
  private currentUser: string | null = null;
  private userProfile: any;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.currentUser = localStorage.getItem('currentUser');

    if (this.currentUser) {
      this.userProfile = JSON.parse(this.currentUser);

      if (this.userProfile && this.userProfile.admin) {
        this.isAdmin = true;
      }
    }
  }

  onEdit(): void {
    this.isEditing = true;
    this.editedText = this.comment.text;
  }

  saveEdit(): void {
    // Implementation for saving the edited comment
    this.isEditing = false;
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  onDelete(): void {
    // Implementation for deleting the comment
  }
}
