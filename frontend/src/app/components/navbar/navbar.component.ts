import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {UserService} from "../../services/user.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [
    NgIf,
    RouterLink
  ],
  standalone: true
})
export class NavbarComponent implements OnInit {
  showModal: boolean = false;
  userProfile: any;

  constructor(private userService: UserService, private router: Router) {
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

  isCurrentRoute(route: string): boolean {
    return this.router.url === route;
  }

  toggleModal() {
    this.showModal = !this.showModal;
  }

  closeModal() {
    this.showModal = false;
  }

  isAdmin(): boolean {
    // @ts-ignore
    const user = JSON.parse(localStorage.getItem('currentUser'));
    // Check if admin
    return user && user.admin;
  }

  logout() {
    this.toggleModal();
    localStorage.clear();
    this.router.navigate(['/home']);
  }

  goHome() {
    this.closeModal();
    localStorage.setItem('currentPage', '0')
    if (this.isCurrentRoute('/videoshome')) {
      window.location.reload();
    } else {
      this.router.navigate(['/videoshome']);
    }
  }

  isLoggedIn(): boolean {
    return this.userService.isSessionValid();
  }
}
