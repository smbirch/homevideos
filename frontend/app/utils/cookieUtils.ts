import { cookies } from 'next/headers';

interface CookieOptions {
  maxAge?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  path?: string;
  domain?: string;
}

export function setCookie(name: string, value: string, options: CookieOptions = {}) {
  const defaultOptions: CookieOptions = {
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  };

  const cookieOptions = { ...defaultOptions, ...options };

  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (cookieOptions.maxAge) {
    cookie += `; Max-Age=${cookieOptions.maxAge}`;
  }

  if (cookieOptions.httpOnly) {
    cookie += '; HttpOnly';
  }

  if (cookieOptions.secure) {
    cookie += '; Secure';
  }

  if (cookieOptions.sameSite) {
    cookie += `; SameSite=${cookieOptions.sameSite}`;
  }

  if (cookieOptions.path) {
    cookie += `; Path=${cookieOptions.path}`;
  }

  if (cookieOptions.domain) {
    cookie += `; Domain=${cookieOptions.domain}`;
  }

  if (typeof window !== 'undefined') {
    document.cookie = cookie;
  }
}

export function getCookie(name: string): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const nameEQ = encodeURIComponent(name) + '=';
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }
  return null;
}

export function removeCookie(name: string) {
  if (typeof window === 'undefined') {
    return;
  }
  const date = new Date();

  // Set it expire in -1 days
  date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));
  document.cookie = name+"=; expires="+date.toUTCString()+"; path=/";
}
