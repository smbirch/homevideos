import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../interfaces/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:8080/comments'; // Adjust the URL to match your backend API

  constructor(private http: HttpClient) {}

  getCommentsByVideoId(videoId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/get/${videoId}`);
  }

  addComment(videoId: number, text: string): Observable<Comment> {
    const body = { videoId, text };
    return this.http.post<Comment>(`${this.apiUrl}/post`, body);
  }

  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${commentId}`);
  }

  updateComment(comment: Comment): Observable<Comment> {
    return this.http.patch<Comment>(`${this.apiUrl}/update`, comment);
  }
}
