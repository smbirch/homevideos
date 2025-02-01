import {User} from './user';
import {Video} from './video';

export interface Comment {
  id: number;
  text: string;
  author: string;
  createdAt: Date;
  deleted: boolean;
  user: User;
  video: Video;
}
