"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Video } from '../../types/video';
import { Comment } from "@/app/types/comment";
import {getVideoById, updateVideoDescription, updateVideoTitle} from "@/app/services/videoService";
import VideoPlayer from "@/app/components/VideoPlayer";
import CommentSection from "@/app/components/CommentSection";
import AddCommentForm from "@/app/components/AddCommentForm";
import { getCommentsByVideoId, postComment } from "@/app/services/commentService";
import { logoutUser } from "@/app/services/userService";
import { getLocalUserData } from "@/app/utils/authUtils";
import EditableField from "@/app/components/EditableField";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300"/>
  </div>
);

const ErrorDisplay = ({message}: { message: string }) => (
  <div className="container mx-auto p-4">
    <div className="text-center mt-8 text-red-500 p-4 bg-red-100 rounded-lg">
      {message}
    </div>
  </div>
);

const useFetchVideoData = (videoId: string | undefined) => {
  const [video, setVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!videoId) {
      setError('No video ID provided');
      setIsLoading(false);
      return;
    }

    try {
      const [videoData, commentData] = await Promise.all([
        getVideoById(videoId),
        getCommentsByVideoId(videoId)
      ]);

      setVideo(videoData);
      setComments(commentData);
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : 'An unexpected error occurred';

      setError(errorMessage);
      console.error('Data fetching error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [videoId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addComment = async (text: string, author: string): Promise<Comment | null> => {
    if (!video) return null;

    try {
      const newComment = await postComment(video.id, text, author);
      setComments(prevComments => [newComment, ...prevComments]);
      return newComment;
    } catch (err) {
      alert("Please log in again to perform this action");
      const localUser = getLocalUserData();
      if (localUser?.username) {
        await logoutUser({
          credentials: {
            username: localUser.username,
            password: ""
          },
          profile: localUser.profile,
          token: ""
        });
      }
      localStorage.removeItem("user");
      location.reload();
      return null;
    }
  };

  return {
    video,
    setVideo,
    comments,
    isLoading,
    error,
    addComment,
    refreshComments: fetchData
  };
};

export default function VideoPage() {
  const params = useParams();
  const videoId = params.id as string;
  const [user, setUser] = useState(getLocalUserData());

  const {
    video,
    setVideo,
    comments,
    isLoading,
    error,
    addComment,
    refreshComments,
  } = useFetchVideoData(videoId);

  const handleTitleEdit = async (newTitle: string) => {
    if (!user?.profile?.admin) {
      alert("You must be an admin to edit videos");
      return;
    }

    try {
      const updatedVideo = await updateVideoTitle(video!.id, newTitle);
      setVideo(updatedVideo);
    } catch (err) {
      if (err instanceof Error && err.message === 'AUTH_ERROR') {
        alert("Please log in again to perform this action");
        const localUser = getLocalUserData();
        if (localUser?.username) {
          await logoutUser({
            credentials: {
              username: localUser.username,
              password: ""
            },
            profile: localUser.profile,
            token: ""
          });
        }
        localStorage.removeItem("user");
        location.reload();
      } else {
        alert("Failed to update video title");
      }
    }
  };

  const handleDescriptionEdit = async (newDescription: string) => {
    if (!video) return;

    try {
      const updatedVideo = await updateVideoDescription(video.id, newDescription);
      setVideo(updatedVideo);
    } catch (err) {
      if (err instanceof Error && err.message === 'AUTH_ERROR') {
        alert("Please log in again to perform this action");
        const localUser = getLocalUserData();
        if (localUser?.username) {
          await logoutUser({
            credentials: {
              username: localUser.username,
              password: ""
            },
            profile: localUser.profile,
            token: ""
          });
        }
        localStorage.removeItem("user");
        location.reload();
      } else {
        alert("Failed to update video description");
      }
    }
  };

  // Early return for loading and error states
  if (isLoading) return <LoadingSpinner/>;
  if (error) return <ErrorDisplay message={error}/>;
  if (!video) return <ErrorDisplay message="Video not found"/>;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <VideoPlayer url={video.url} title={video.title}/>
      </div>

      {user?.profile?.admin ? (
        <>
          <EditableField
            value={video.title}
            onSave={handleTitleEdit}
            onCancel={undefined}
          />
          <EditableField
            value={video.description}
            onSave={handleDescriptionEdit}
            onCancel={undefined}
            isTextArea
          />
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
          <p className="text-gray-700 mb-8">{video.description}</p>
        </>
      )}

      <AddCommentForm
        videoId={video.id}
        onCommentAdded={addComment}
      />

      <CommentSection
        videoId={video.id}
        comments={comments}
        refreshComments={refreshComments}
      />
    </div>
  );
}
