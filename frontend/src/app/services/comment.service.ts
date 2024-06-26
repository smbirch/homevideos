import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../interfaces/comment';
import { environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = environment.apiServerUrl;

  constructor(private http: HttpClient) {}

  getCommentsByVideoId(videoId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/comments/get/${videoId}`);
  }

  addComment(videoId: number, text: string, author: string): Observable<Comment> {
    const body = { videoId, text, author };
    return this.http.post<Comment>(`${this.apiUrl}/comments/post`, body);
  }

  deleteComment(commentId: number): Observable<Comment> {
    const options = {
      body: { commentId }
    };
    return this.http.delete<Comment>(`${this.apiUrl}/comments/delete`, options);
  }


  updateComment(comment: { commentId: number; text: string }): Observable<Comment> {
    return this.http.patch<Comment>(`${this.apiUrl}/comments/update`, comment);
  }
}
