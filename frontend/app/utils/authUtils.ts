import { useEffect, useState } from 'react';
import { getCookie, setCookie, removeCookie } from './cookieUtils';

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

// Cookie name constant
const USER_COOKIE_NAME = 'user_data';

export const getStoredUser = (): User | null => {
  try {
    const userData = getCookie(USER_COOKIE_NAME);
    if (!userData) return null;
    return JSON.parse(userData) as User;
  } catch (error) {
    console.error('Error parsing user data:', error);
    removeCookie(USER_COOKIE_NAME);
    return null;
  }
};

export const setStoredUser = (user: User): void => {
  setCookie(USER_COOKIE_NAME, JSON.stringify(user));
};

export const removeStoredUser = (): void => {
  removeCookie(USER_COOKIE_NAME);
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
