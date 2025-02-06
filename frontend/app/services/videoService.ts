"use server"

import {Video} from "@/app/types/video";
import {cookies} from "next/headers";

// const API_BASE_URL = 'http://localhost:8080/api/video'; // DEV
const API_BASE_URL = 'https://homevideos.smbirch.com/api/video'; //PROD

export async function getVideoPage(page: number): Promise<Video[]> {
  console.log(API_BASE_URL);

  const response = await fetch(`${API_BASE_URL}/page?page=${page}`);

  if (!response.ok) {
    throw new Error('Failed to fetch videos');
  }
  return response.json();
}

export const getVideoById = async (id: string, signal?: AbortSignal): Promise<Video> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
    console.error('Error fetching video:', error);
    throw new Error('Failed to fetch video data');
  }
};
// TODO updateVideoTitle, updateVideoDescription

export async function updateVideoTitle(videoId: number, newTitle: string): Promise<Video> {
  const currentCookie = (await cookies()).get('homevideosCookie');

  const response = await fetch(`${API_BASE_URL}/update/title`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `homevideosCookie=${currentCookie?.value || ''}`,
      'Authorization': `Bearer ${currentCookie?.value || ''}`,
    },
    body: JSON.stringify({
      id: videoId,
      title: newTitle,
      description: null
    }),
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('AUTH_ERROR');
    }
    console.error("Failed to update video title");
    throw new Error('Failed to update video title');
  }

  return response.json();
}

export async function updateVideoDescription(videoId: number, newDescription: string): Promise<Video> {
  const currentCookie = (await cookies()).get('homevideosCookie');

  const response = await fetch(`${API_BASE_URL}/update/description`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `homevideosCookie=${currentCookie?.value || ''}`,
      'Authorization': `Bearer ${currentCookie?.value || ''}`,
    },
    body: JSON.stringify({
      id: videoId,
      title: null,
      description: newDescription
    }),
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('AUTH_ERROR');
    }
    console.error("Failed to update video description");
    throw new Error('Failed to update video description');
  }

  return response.json();
}
