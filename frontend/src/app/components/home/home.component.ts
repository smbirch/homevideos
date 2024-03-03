import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {User} from "../../interfaces/user";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {NgIf} from "@angular/common";
import {CredentialsDto} from "../../DTOs/credentialsDto";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  credentials: CredentialsDto = { username: '', password: '' };
  loginError: boolean = false;

  constructor(private userService: UserService, private router: Router) {
  }

  login() {
    this.userService.login(this.credentials).subscribe(
      (user: any) => {
        console.log(user)
        // Save user info to local storage
        localStorage.setItem('currentUser', JSON.stringify({
          id: user.id,
          username: user.username,
          firstName: user.profile?.firstName,
          lastName: user.profile?.lastName,
          email: user.email,
          active: user.active,
          status: user.status,
          admin: user.admin,
          isLoggedIn: true
        }));

        // Navigate based on user role
        if (user.admin) {
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      (error) => {
        this.loginError = true;
        setTimeout(() => {
          this.loginError = false;
        }, 5000);
      }
    );
  }
}