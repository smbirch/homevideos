import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, catchError, throwError} from 'rxjs';
import {CredentialsDto} from "../DTOs/credentialsDto";
import {User} from "../interfaces/user";
import { environment} from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiServerUrl = `${environment.apiServerUrl}/users`;
  public currentUser: null | undefined;

  constructor(private http: HttpClient) {
  }

  // Checks local storage to see if user is logged in
  getCurrentUser = ():null | undefined  => {
    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString) {
      if (this.isSessionValid()) {
        this.currentUser = JSON.parse(currentUserString);
      } else {
        this.currentUser = null;
        console.log("Current user does not exist or session has expired");
      }
    }
    return this.currentUser;
  };

  // Checks to see if current user session has timed out
  isSessionValid(): boolean {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      const currentTime = new Date().getTime();
      const sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
      if (currentTime - userData.timestamp > sessionTimeout) {
        // Session has expired - remove expired session data
        localStorage.removeItem('currentUser');
        return false;
      }
      return true; // Session is still valid
    }
    return false; // something broke, assume no local user data
  }

  // calls API to test username/password. TODO: is this different than 'login'?
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

  createUser(credentials: CredentialsDto, email: string, firstName: string, lastName: string): Observable<User> {
    const requestBody = {
      credentials: {
        username: credentials.username,
        password: credentials.password
      },
      profile: {
        email: email,
        firstName: firstName,
        lastName: lastName,
        admin: 'false'
      }
    };

    return this.http.post<User>(`${this.apiServerUrl}`, requestBody).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }
}
