"use server"

import {User, UserRequestDto, UserResponseDto} from "@/app/types/user";
import {Credentials} from "@/app/types/credentials";
import { cookies } from 'next/headers'

const API_BASE_URL = 'http://localhost:8080/api/auth';

export async function getUserByUsername(username: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/${username}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
}

export async function createUser(userRequestDto: UserRequestDto): Promise<UserResponseDto> {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userRequestDto),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create user');
  }

  return response.json();
}

export async function validateUser(credentials: Credentials): Promise<UserResponseDto> {
  const response = await fetch(`${API_BASE_URL}/validate/${credentials.username}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to validate user');
  }

  return response.json();
}

export async function loginUser(userRequestDto: UserRequestDto): Promise<UserResponseDto> {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userRequestDto),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to login user');
  }

  // Get the Set-Cookie header
  const setCookieHeader = response.headers.get('set-cookie');
  if (setCookieHeader) {
    // Parse the cookie value from the header
    const cookieValue = setCookieHeader.split(';')[0].split('=')[1];

    // Set the cookie using Next.js cookies API
    cookies().set({
      name: 'homevideosCookie',
      value: cookieValue,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 3600, // 1 hour
      // secure: process.env.NODE_ENV === 'production', // Enable in production
    });
  }

  return response.json();
}

export async function logoutUser(userRequestDto: UserRequestDto): Promise<UserResponseDto> {
  const currentCookie = cookies().get('homevideosCookie')
  console.log('Current cookie:', currentCookie)

  const response = await fetch(`${API_BASE_URL}/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `homevideosCookie=${currentCookie?.value || ''}`,
      'Authorization': `Bearer ${currentCookie?.value || ''}`,
    },
    body: JSON.stringify({
      ...userRequestDto,
      token: currentCookie?.value // Add token to request body as well
    }),
    credentials: 'include'
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to logout user');
  }

  cookies().delete('homevideosCookie')

  return response.json();
}
