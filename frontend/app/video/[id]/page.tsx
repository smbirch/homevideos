"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Video } from '../../types/video';
import { getVideoById } from "@/app/services/videoService";
import CommentSection from "@/app/components/CommentSection";
import { getCommentsByVideoId, postComment } from "@/app/services/commentService";
import { Comment } from "@/app/types/comment";
import VideoPlayer from "@/app/components/VideoPlayer";
import AddCommentForm from "@/app/components/AddCommentForm";

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300" />
  </div>
);

export default function VideoPage() {
  const params = useParams();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setIsClient(true);
  }, []);

  const loadVideo = useCallback(async (signal: AbortSignal) => {
    if (!params.id) return;

    try {
      const data = await getVideoById(params.id as string, signal);
      setVideo(data);
    } catch (err) {
      if (!(err instanceof DOMException && err.name === 'AbortError')) {
        setError('An error occurred while fetching the video.');
        console.error(err);
      }
    }
  }, [params.id]);

  const loadComments = useCallback(async (signal: AbortSignal) => {
    if (!params.id) return;

    try {
      const fetchedComments: Comment[] = await getCommentsByVideoId(params.id as string, signal);
      setComments(fetchedComments);
    } catch (err) {
      if (!(err instanceof DOMException && err.name === 'AbortError')) {
        console.error('An error occurred while fetching the comments:', err);
      }
    }
  }, [params.id]);

  useEffect(() => {
    if (!isClient) return;

    setLoading(true);
    const controller = new AbortController();
    const { signal } = controller;

    const loadData = async () => {
      try {
        await Promise.all([
          loadVideo(signal),
          loadComments(signal)
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    return () => {
      controller.abort();
    };
  }, [isClient, params.id, loadVideo, loadComments]);

  const handleAddComment = async (text: string, author: string) => {
    if (!video) return;

    try {
      const newComment = await postComment(video.id, text, author);
      setComments(prevComments => [newComment, ...prevComments]);
    } catch (err) {
      console.error('An error occurred while posting the comment:', err);
    }
  };

  // Show loading spinner before client-side hydration
  if (!isClient || loading) {
    return <LoadingSpinner />;
  }

  if (error || !video) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center mt-8 text-red-500 p-4 bg-red-100 rounded-lg">
          {error || 'Video not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <VideoPlayer url={video.url} title={video.title} />
      </div>
      <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
      <p className="text-gray-700 mb-4">{video.description}</p>
      <AddCommentForm videoId={video.id} onCommentAdded={handleAddComment} />
      <CommentSection videoId={video.id} comments={comments} />
    </div>
  );
}

// "use client";
//
// import React, {useState, useEffect, useCallback} from 'react';
// import {useParams} from 'next/navigation';
// import {Video} from '../../types/video';
// import {getVideoById} from "@/app/services/videoService";
// import CommentSection from "@/app/components/CommentSection";
// import {getCommentsByVideoId, postComment} from "@/app/services/commentService";
// import {Comment} from "@/app/types/comment";
// import VideoPlayer from "@/app/components/VideoPlayer";
// import AddCommentForm from "@/app/components/AddCommentForm";
//
// export default function VideoPage() {
//   const params = useParams();
//   const [video, setVideo] = useState<Video | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [comments, setComments] = useState<Comment[]>([]);
//
//   const loadVideo = useCallback(async (signal: AbortSignal) => {
//     try {
//       const data = await getVideoById(params.id as string, signal);
//       setVideo(data);
//     } catch (err) {
//       // Only set error if the request wasn't aborted
//       if (!(err instanceof DOMException && err.name === 'AbortError')) {
//         setError('An error occurred while fetching the video.');
//         console.error(err);
//       }
//     }
//   }, [params.id]);
//
//   const loadComments = useCallback(async (signal: AbortSignal) => {
//     try {
//       const fetchedComments: Comment[] = await getCommentsByVideoId(params.id as string, signal);
//       setComments(fetchedComments);
//     } catch (err) {
//       // Only log error if the request wasn't aborted
//       if (!(err instanceof DOMException && err.name === 'AbortError')) {
//         console.error('An error occurred while fetching the comments:', err);
//       }
//     }
//   }, [params.id]);
//
//   useEffect(() => {
//     setLoading(true);
//
//     // Create abort controller for cleanup
//     const controller = new AbortController();
//     const {signal} = controller;
//
//     // Use Promise.all to load video and comments concurrently
//     const loadData = async () => {
//       try {
//         await Promise.all([
//           loadVideo(signal),
//           loadComments(signal)
//         ]);
//       } finally {
//         setLoading(false);
//       }
//     };
//
//     loadData();
//
//     // Cleanup function
//     return () => {
//       controller.abort();
//     };
//   }, [params.id, loadVideo, loadComments]);
//
//   const handleAddComment = async (text: string, author: string) => {
//     if (!video) return;
//
//     try {
//       const newComment = await postComment(video.id, text, author);
//       setComments(prevComments => [newComment, ...prevComments]);
//     } catch (err) {
//       console.error('An error occurred while posting the comment:', err);
//     }
//   };
//
//   if (loading) {
//     return <div className="text-center mt-8">Loading...</div>;
//   }
//
//   if (error || !video) {
//     return <div className="text-center mt-8 text-red-500">{error || 'Video not found'}</div>;
//   }
//
//   return (
//     <div className="container mx-auto p-4">
//       <div className="mb-4">
//         <VideoPlayer url={video.url} title={video.title}/>
//       </div>
//       <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
//       <p className="text-gray-700 mb-4">{video.description}</p>
//       <AddCommentForm videoId={video.id} onCommentAdded={handleAddComment}/>
//       <CommentSection videoId={video.id} comments={comments}/>
//     </div>
//   );
// }
