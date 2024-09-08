import {Video} from './video';
import {Credentials} from './credentials';
import {Profile} from './profile';

export interface User {
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
}

export interface UserResponseDto {
  id: number;
  username: string;
  profile: Profile;
}
