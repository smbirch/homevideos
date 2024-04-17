import {Component} from '@angular/core';
import {UserService} from '../../services/user.service';
import {FormBuilder, FormsModule} from "@angular/forms";
import {CredentialsDto} from "../../DTOs/credentialsDto";
import {User} from "../../interfaces/user";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  standalone: true,
  imports: [
    FormsModule
  ],
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  formData: any = {};

  constructor(private userService: UserService, private router: Router) {
  }

  onSubmit() {
    // TODO: alert on screen if passwords do not match
    if (this.formData.password !== this.formData.confirmPassword) {
      console.log('Passwords do not match');
      return;
    }

    this.userService.createUser(
      {username: this.formData.username, password: this.formData.password},
      this.formData.email,
      this.formData.firstName,
      this.formData.lastName
    ).subscribe(
      (user) => {
        console.log('User created successfully:', user);

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

        // Optionally, you can redirect the user to a different page after successful signup
      },
      (error) => {
        console.error('Error creating user:', error);
        // Handle error, show error message to user, etc.
      }
    );
    // Optionally, you can reset the form after submission
    // form.reset(); // No need to pass form to reset() since we're using ngModel
    this.formData = {}; // Reset formData object
  }

  loginAfterSignup(username: string, password: string) {
    const credentials: CredentialsDto = {
      username: username,
      password: password
    };

    // Check if both username and password are provided
    if (!credentials.username || !credentials.password) {
      console.log(credentials);
      console.error('Username or password is missing.');
      return;
    }

    this.userService.login(credentials).subscribe(
      (user: User) => {
        console.log('User logged in successfully:', user);
        // Redirect to /videoshome
      },
      (error) => {
        console.error('Error logging in user:', error);
        // Handle error, show error message to user, etc.
      }
    );
  }

}
