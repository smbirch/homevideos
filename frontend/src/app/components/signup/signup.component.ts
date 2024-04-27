import {Component} from '@angular/core';
import {UserService} from '../../services/user.service';
import {FormBuilder, FormsModule} from "@angular/forms";
import {CredentialsDto} from "../../DTOs/credentialsDto";
import {User} from "../../interfaces/user";
import {Router} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  formData: any = {};
  loginError: boolean = false;
  formError: boolean = false;

  constructor(private userService: UserService, private router: Router) {
  }

  onSubmit() {
    if (this.formData.password !== this.formData.confirmPassword) {
      this.loginError = true;
      return;
    }

    if (!this.formData.username || !this.formData.password || !this.formData.firstName || !this.formData.lastName) {
      this.formError = true;
      return;
    }

    this.userService.createUser(
      {username: this.formData.username, password: this.formData.password},
      this.formData.email,
      this.formData.firstName,
      this.formData.lastName
    ).subscribe(
      (user) => {

        localStorage.setItem('currentUser', JSON.stringify({
          username: user.username,
          profile: {
            firstName: user.profile.firstName,
            lastName: user.profile.lastName,
            email: user.profile.email,
            admin: user.profile.admin
          },
          isLoggedIn: true,
          timestamp: new Date().getTime()
        }));
        this.router.navigate(['/videoshome']);


      },
      (error) => {
        this.loginError = true;
        setTimeout(() => {
          this.loginError = false;
        }, 5000);
      }
    );
    this.formData = {}; // Reset formData object
  }

  loginAfterSignup(username: string, password: string) {
    const credentials: CredentialsDto = {
      username: username,
      password: password
    };

    if (!credentials.username || !credentials.password) {
      console.log(credentials);
      console.error('Username or password is missing.');
      return;
    }

    this.userService.login(credentials).subscribe(
      (user: User) => {
        this.router.navigate(['/videoshome']);
        // Redirect to /videoshome
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
