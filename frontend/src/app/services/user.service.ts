import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, catchError, throwError} from 'rxjs';
import {CredentialsDto} from "../DTOs/credentialsDto";
import {User} from "../interfaces/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiServerUrl = 'http://localhost:8080/users';

  constructor(private http: HttpClient) {
  }

  validateUser(username: string, password: string): Observable<any> {
    const requestBody = {username, password};
    return this.http.post<any>(`${this.apiServerUrl}/validate`, requestBody, {observe: 'response'});
  }

  public login(credentials: CredentialsDto): Observable<User> {
    // @ts-ignore
    return this.http.post<User>(`${this.apiServerUrl}/validate`, credentials).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }
}
