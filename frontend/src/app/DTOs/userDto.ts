import {ProfileDto} from "./profileDto";

export interface UserDto {
  id: number;
  username: string;
  profile: ProfileDto;
}
