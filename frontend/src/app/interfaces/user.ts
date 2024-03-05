export interface User {
  username: string;
  password: any;
  firstName: string;
  lastName: string;
  email: string;
}
export const DEFAULT_USER: User = {
  username: '',
  password: null,
  firstName: '',
  lastName: '',
  email: ''
};
