import { Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {VideoComponent} from "./components/video/video.component";
import {VideoshomeComponent} from "./components/videoshome/videoshome.component";
import {UserProfileComponent} from "./components/user-profile/user-profile.component";
import {SignupComponent} from "./components/signup/signup.component";

export const routes: Routes = [
  { path: '', redirectTo: '/videoshome', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'video/:id', component: VideoComponent },
  { path: 'videoshome', component: VideoshomeComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'signup', component: SignupComponent },
];
