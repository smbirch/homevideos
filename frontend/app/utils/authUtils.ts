import { setCookie, removeCookie } from './cookieUtils';
import {useEffect, useState} from "react";
import {getCookie} from "cookies-next";

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  admin: boolean;
}

export interface User {
  id: number;
  username: string;
  profile: UserProfile;
}

const USER_COOKIE_NAME = 'homevideosCookie';

export const getStoredUser = (): User | null => {
  try {
    // First try to get from cookie
    const cookieData = getCookie(USER_COOKIE_NAME);
    if (cookieData) {
      return JSON.parse(<string>cookieData) as User;
    }

    // If no cookie, try localStorage
    const localData = localStorage.getItem('user');
    if (localData) {
      return JSON.parse(localData) as User;
    }

    return null;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    removeCookie(USER_COOKIE_NAME);
    try {
      localStorage.removeItem('user');
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
    return null;
  }
};

export const setStoredUser = (user: User): void => {
  try {
    setCookie(USER_COOKIE_NAME, JSON.stringify(user));
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

export const removeStoredUser = (): void => {
  try {
    removeCookie(USER_COOKIE_NAME);
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error removing user data:', error);
  }
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    const storedUser = getStoredUser();
    setUser(storedUser);
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    setStoredUser(userData);
    setUser(userData);
  };

  const logout = () => {
    removeStoredUser();
    setUser(null);
  };

  return {
    user,
    isClient,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };
};
