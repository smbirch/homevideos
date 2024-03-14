import {ProfileDto} from "../DTOs/profileDto";

export interface User {
  username: string;
  profile: ProfileDto;
}
// export const DEFAULT_USER: User = {
//   username: '',
//   password: null,
//   firstName: '',
//   lastName: '',
//   email: '',
//   admin: false
// };
