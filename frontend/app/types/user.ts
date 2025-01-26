import {Video} from './video';
import {Credentials} from './credentials';
import {Profile} from './profile';

export interface User {
  username: any;
  id: number;
  joined: Date;
  deleted: boolean;
  credentials: Credentials;
  profile: Profile;
  likedVideos: Video[];
}

export interface UserRequestDto {
  credentials: Credentials;
  profile: Profile;
  token: string;
}

export interface UserResponseDto {
  id: number;
  username: string;
  token: string;
  profile: Profile;
}
