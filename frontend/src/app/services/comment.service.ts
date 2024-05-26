import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../interfaces/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:8080/comments';

  constructor(private http: HttpClient) {}

  getCommentsByVideoId(videoId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/get/${videoId}`);
  }

  addComment(videoId: number, text: string, author: string): Observable<Comment> {
    const body = { videoId, text, author };
    return this.http.post<Comment>(`${this.apiUrl}/post`, body);
  }

  deleteComment(commentId: number): Observable<Comment> {
    const options = {
      body: { commentId }
    };
    return this.http.delete<Comment>(`${this.apiUrl}/delete`, options);
  }


  updateComment(comment: Comment): Observable<Comment> {
    return this.http.patch<Comment>(`${this.apiUrl}/update`, comment);
  }
}