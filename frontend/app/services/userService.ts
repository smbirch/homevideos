import {User, UserRequestDto, UserResponseDto} from "@/app/types/user";
import {Credentials} from "@/app/types/credentials";

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
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to login user');
  }
  return response.json();
}
