import {Component, OnInit, SimpleChanges} from '@angular/core';
import {NgIf} from "@angular/common";
import {ActivatedRoute, Router} from '@angular/router';
import {Video} from '../../interfaces/video';
import {VideoService} from '../../services/video.service';
import {UserService} from '../../services/user.service';
import {TitleUpdateModalComponent} from "../title-update-modal/title-update-modal.component";
import {DescriptionUpdateModalComponent} from "../description-update-modal/description-update-modal.component";

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  standalone: true,
  styleUrls: ['./video.component.css'],
  imports: [
    NgIf,
    TitleUpdateModalComponent,
    DescriptionUpdateModalComponent
  ]
})

export class VideoComponent implements OnInit {
  public video!: Video;
  public currentUser: null | undefined = null;
  isTitleModalOpen: boolean = false;
  isDescriptionModalOpen: boolean = false;

  constructor(
    public route: ActivatedRoute,
    public videoService: VideoService,
    private router: Router,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.getVideo();
    this.userService.getCurrentUser()
  }

  public getVideo(): void {
    // @ts-ignore
    const id = +this.route.snapshot.paramMap.get('id');
    this.videoService.getVideoById(id).subscribe(
      (video: Video) => {
        this.video = video;
      },
      (error) => {
        console.log('Error fetching video:', error);
      }
    );
  }

  goBack() {
    this.router.navigate(['/']);
  }

  onClickTitle(): void {
    if (this.checkIfAdmin()) {
      this.openDescriptionModal()
    } else {
      window.alert('You must be logged in as an admin user to change the title');
    }
  }

  getCurrentUser(): void {
    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString) {
      if (this.userService.isSessionValid()) {
        this.currentUser = JSON.parse(currentUserString);
      } else {
        this.currentUser = null;
        console.log("Current user does not exist or session has expired");
      }
    }
  }

  onClickDescription() {
    if (this.checkIfAdmin()) {
      this.openDescriptionModal()
    } else {
      window.alert('You must be logged in as an admin user to change the description');
    }
  }

  checkIfAdmin(): boolean {
    this.currentUser = this.userService.getCurrentUser()
    return !!(this.currentUser && this.currentUser["profile"]["admin"]);
  }

  openTitleModal(): void {
    this.isTitleModalOpen = true;
  }

  onCloseTitleModal(): void {
    this.isTitleModalOpen = false;
  }

  openDescriptionModal() {
    this.isDescriptionModalOpen = true;
  }

  onCloseDescriptionModal() {
    this.isDescriptionModalOpen = false;
  }

  updateTitle(newTitle: string) {
    this.video.title = newTitle;
  }

  updateDescription(newDescription: string) {
    this.video.description = newDescription;
  }

  allowDownload(): boolean {
    if (!this.checkIfAdmin()) {
      window.alert('Only admins may download this video')
      return false;
    }
    else return true;
  }
}
