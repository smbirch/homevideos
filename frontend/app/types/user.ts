export interface User {
  username: string;
  id: number;
  joined: Date;
  deleted: boolean;
  credentials: Credentials;
  profile: Profile;
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

export interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  admin: boolean;
}

export interface Credentials {
  username: string;
  password: string;
}
