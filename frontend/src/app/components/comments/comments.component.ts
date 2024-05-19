import { Component, OnInit, Input } from '@angular/core';
import { Comment } from '../../interfaces/comment';
import { CommentService } from '../../services/comment.service';
import { ActivatedRoute } from '@angular/router';
import {NgForOf, NgIf} from "@angular/common";
import {CommentComponent} from "../comment/comment.component";
import {FormsModule} from "@angular/forms";

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

  constructor(
    private commentService: CommentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fetchComments();
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
    if (this.newCommentText.trim()) {
      this.commentService.addComment(this.videoId, this.newCommentText).subscribe(
        (comment: Comment) => {
          this.comments.push(comment);
          this.newCommentText = '';
        },
        (error) => {
          console.log('Error adding comment:', error);
        }
      );
    }
  }

  deleteComment(commentId: number): void {
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
    this.commentService.updateComment(updatedComment).subscribe(
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
