import {Video} from "@/app/types/video";

export async function getVideoPage(page: number): Promise<Video[]> {
  const response = await fetch(`http://localhost:8080/api/video/page?page=${page}`);
  if (!response.ok) {
    throw new Error('Failed to fetch videos');
  }
  return response.json();
}

export const getVideoById = async (id: string, signal?: AbortSignal): Promise<Video> => {
  try {
    const response = await fetch(`http://localhost:8080/api/video/${id}`, {
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
