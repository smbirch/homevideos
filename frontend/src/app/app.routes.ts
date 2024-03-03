import { Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {VideoComponent} from "./components/video/video.component";
import {VideoshomeComponent} from "./components/videoshome/videoshome.component";

export const routes: Routes = [
  { path: '', redirectTo: '/videoshome', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'videos/:id', component: VideoComponent },
  { path: 'videoshome', component: VideoshomeComponent },

];
