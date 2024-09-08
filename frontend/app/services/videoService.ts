import {Video} from "@/app/types/video";

export async function getVideoPage(page: number): Promise<Video[]> {
  const response = await fetch(`http://localhost:8080/video/page?page=${page}`);
  if (!response.ok) {
    throw new Error('Failed to fetch videos');
  }
  return response.json();
}

export async function getVideoById(id: string): Promise<Video> {
  const response = await fetch(`http://localhost:8080/video/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch video');
  }
  return response.json();
}

// TODO updateVideoTitle, updateVideoDescription
