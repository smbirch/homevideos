"use server"

import {User, UserRequestDto, UserResponseDto} from "@/app/types/user";
import {cookies} from 'next/headers'

// const API_BASE_URL = 'http://localhost:8080/api/auth'; // DEV
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/auth'; //PROD

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

  const setCookieHeader = response.headers.get('set-cookie');
  console.log(setCookieHeader);

  if (setCookieHeader) {
    const cookieValue = setCookieHeader.split(';')[0].split('=')[1];

    (await cookies()).set({
      name: 'homevideosCookie',
      value: cookieValue,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 3600, // 1 hour
      // secure: process.env.NODE_ENV === 'production', //TODO: Enable in production
    });
  }

  return response.json();
}

export async function validateUser(userRequestDto: UserRequestDto): Promise<UserResponseDto> {
  const response = await fetch(`${API_BASE_URL}/validate/${userRequestDto.credentials.username}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userRequestDto.credentials),
    credentials: 'include',
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

  const setCookieHeader = response.headers.get('set-cookie');
  if (setCookieHeader) {
    const cookieValue = setCookieHeader.split(';')[0].split('=')[1];

    (await cookies()).set({
      name: 'homevideosCookie',
      value: cookieValue,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 3600, // 1 hour
      // secure: process.env.NODE_ENV === 'production', //TODO: Enable in production
    });
  }

  return response.json();
}

export async function logoutUser(userRequestDto: UserRequestDto): Promise<UserResponseDto> {
  const currentCookie = (await cookies()).get('homevideosCookie')

  const response = await fetch(`${API_BASE_URL}/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `homevideosCookie=${currentCookie?.value || ''}`,
      'Authorization': `Bearer ${currentCookie?.value || ''}`,
    },
    body: JSON.stringify({
      ...userRequestDto,
      token: currentCookie?.value
    }),
    credentials: 'include'
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    (await cookies()).delete('homevideosCookie')
    throw new Error(errorData.message || 'Failed to logout user');
  }

  (await cookies()).delete('homevideosCookie');
  return response.json();
}
