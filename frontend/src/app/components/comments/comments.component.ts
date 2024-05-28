import { Component, OnInit, Input } from '@angular/core';
import { Comment } from '../../interfaces/comment';
import { CommentService } from '../../services/comment.service';
import { ActivatedRoute } from '@angular/router';
import { NgForOf, NgIf } from "@angular/common";
import { CommentComponent } from "../comment/comment.component";
import { FormsModule } from "@angular/forms";
import { UserService } from "../../services/user.service";

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    CommentComponent,
    FormsModule
  ],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent implements OnInit {
  @Input() videoId!: number;
  comments: Comment[] = [];
  newCommentText: string = '';
  public currentUser: string | null = null;
  currentUsername: string = '';
  private userProfile: any;
  errorMessage: string = '';

  constructor(
    private commentService: CommentService,
    private route: ActivatedRoute,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.fetchComments();

    this.currentUser = localStorage.getItem('currentUser');
    if (this.currentUser) {
      this.userProfile = JSON.parse(this.currentUser);
      this.currentUsername = this.userProfile.username;
    } else {
      // @ts-ignore
      this.userService.getCurrentUser().subscribe((data: any) => {
        this.userProfile = data;
      });
    }
  }

  fetchComments(): void {
    this.commentService.getCommentsByVideoId(this.videoId).subscribe(
      (comments: Comment[]) => {
        this.comments = comments;
      },
      (error) => {
        console.log('Error fetching comments:', error);
      }
    );
  }

  addComment(): void {
    if (!this.currentUser) {
      this.errorMessage = 'You must be logged in to add a comment.';
      return;
    }

    if (this.newCommentText.trim()) {
      this.commentService.addComment(this.videoId, this.newCommentText, this.currentUsername).subscribe(
        (comment: Comment) => {
          this.comments.push(comment);
          this.newCommentText = '';
          this.errorMessage = '';
        },
        (error) => {
          console.log('Error adding comment:', error);
          if (error.status === 404) {
            this.errorMessage = 'You must be logged in to add a comment.';
          }
        }
      );
    }
  }

  deleteComment(commentId: number): void {
    if (!this.currentUser) {
      this.errorMessage = 'You must be logged in to add a comment.';
      return;
    }
    this.commentService.deleteComment(commentId).subscribe(
      () => {
        this.comments = this.comments.filter(comment => comment.id !== commentId);
      },
      (error) => {
        console.log('Error deleting comment:', error);
      }
    );
  }

  editComment(updatedComment: Comment): void {
    console.log(updatedComment);
    const commentToSend: { commentId: number; text: string } = {
      commentId: updatedComment.id,
      text: updatedComment.text,
    };

    this.commentService.updateComment(commentToSend).subscribe(
      (comment: Comment) => {
        const index = this.comments.findIndex(c => c.id === comment.id);
        if (index !== -1) {
          this.comments[index] = comment;
        }
      },
      (error) => {
        console.log('Error updating comment:', error);
      }
    );
  }
}
