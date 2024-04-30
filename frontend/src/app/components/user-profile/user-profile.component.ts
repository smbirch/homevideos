import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  userProfile: any;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.userProfile = JSON.parse(currentUser);
    } else {
      // @ts-ignore
      this.userService.getCurrentUser().subscribe((data: any) => {
        this.userProfile = data;
      });
    }
  }
}
