"use server"

import {Comment} from "@/app/types/comment";
import {cookies} from "next/headers";

// const API_BASE_URL = 'http://localhost:8080'; //DEV
const API_BASE_URL = 'http://homevideos.smbirch.com/api/video'; //PROD

export const getCommentsByVideoId = async (videoId: string, signal?: AbortSignal): Promise<Comment[]> => {
  const response = await fetch(`${API_BASE_URL}/api/comments/${videoId}`, {signal});
  if (!response.ok) throw new Error('Failed to fetch comments');
  return response.json();
};

export async function postComment(videoId: number, text: string, author: string): Promise<Comment> {
  const currentCookie = (await cookies()).get('homevideosCookie')
  const response = await fetch(`${API_BASE_URL}/api/comments/new`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `homevideosCookie=${currentCookie?.value || ''}`,
      'Authorization': `Bearer ${currentCookie?.value || ''}`,

    },
    body: JSON.stringify({
      videoId,
      text,
      author,
    }),
  });

  if (!response.ok) {
    if (response.status === 404 || response.status === 500) {
      throw new Error('AUTH_ERROR')
    }
    console.log("failed to post comment");
    throw new Error('Failed to post comment');
  }

  return response.json();
}

export async function updateComment(
  commentId: number,
  text: string,
  videoId: number,
  author: string
): Promise<Comment> {
  const currentCookie = (await cookies()).get('homevideosCookie')
  const response = await fetch(`${API_BASE_URL}/api/comments/update`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `homevideosCookie=${currentCookie?.value || ''}`,
      'Authorization': `Bearer ${currentCookie?.value || ''}`,
    },
    body: JSON.stringify({
      commentId,
      videoId,
      text,
      author,
    }),
  });

  if (!response.ok) {
    if (response.status === 404 || response.status === 500) {
      throw new Error('AUTH_ERROR')
    }
    console.log("failed to update comment");
    throw new Error('Failed to update comment');
  }

  return response.json();
}

export async function deleteComment(commentId: number, text: string, videoId: number, author: string): Promise<void> {
  const currentCookie = (await cookies()).get('homevideosCookie')
  const response = await fetch(`${API_BASE_URL}/api/comments/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `homevideosCookie=${currentCookie?.value || ''}`,
      'Authorization': `Bearer ${currentCookie?.value || ''}`,
    },
    body: JSON.stringify({
      commentId,
      videoId,
      text,
      author,
    }),
  });

  if (!response.ok) {
    if (response.status === 404 || response.status === 500) {
      throw new Error('AUTH_ERROR')
    }
    console.log("failed to delete comment");
    throw new Error('Failed to delete comment');
  }
}
