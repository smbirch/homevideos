import {Comment} from "@/app/types/comment";

const API_BASE_URL = 'http://localhost:8080';

export async function getCommentsByVideoId(videoId: string): Promise<Comment[]> {
  const response = await fetch(`${API_BASE_URL}/comments/${videoId}`);
  if (!response.ok) {
    console.log("failed to fetch comments");
    throw new Error('Failed to fetch comments');
  }
  return response.json();
}

export async function postComment(videoId: number, text: string, author: string): Promise<Comment> {
  const response = await fetch(`${API_BASE_URL}/comments/new`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      videoId,
      text,
      author,
    }),
  });

  if (!response.ok) {
    console.log("failed to post comment");
    throw new Error('Failed to post comment');
  }

  return response.json();
}
