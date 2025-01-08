import {User} from "@/app/types/user";

export function getLocalUserData() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('user');
  }
}

export function parseLocalUserData(userData: string | null | undefined) {
  if (userData) {
    try {
      return JSON.parse(userData) as User;
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      return null;
    }
  }
  return null;
}
