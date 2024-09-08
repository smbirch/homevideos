import {User, UserRequestDto, UserResponseDto} from "@/app/types/user";
import {Credentials} from "@/app/types/credentials";

const API_BASE_URL = 'http://localhost:8080';

export async function getUserByUsername(username: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${username}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
}

export async function createUser(userRequestDto: UserRequestDto): Promise<UserResponseDto> {
  const response = await fetch(`${API_BASE_URL}/users`, {
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
  const response = await fetch(`${API_BASE_URL}/users/validate`, {
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
