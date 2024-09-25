import {User} from "@/app/types/user";

const API_BASE_URL = 'http://localhost:8080';

export async function getCommentsByVideoId(videoId: string): Promise<Comment[]> {
  const response = await fetch(`${API_BASE_URL}/comments/${videoId}`);
  if (!response.ok) {
    console.log("failed to fetch comments");
    throw new Error('Failed to fetch comments');
  }
  return response.json();
}
