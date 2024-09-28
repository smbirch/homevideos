"use client";

import React, {useState, useEffect, useCallback} from 'react';
import {useParams} from 'next/navigation';
import {Video} from '../../types/video';
import {getVideoById} from "@/app/services/videoService";
import CommentSection from "@/app/components/CommentSection";
import {getCommentsByVideoId, postComment} from "@/app/services/commentService";
import {Comment} from "@/app/types/comment";
import VideoPlayer from "@/app/components/VideoPlayer";
import AddCommentForm from "@/app/components/AddCommentForm";

export default function VideoPage() {
  const params = useParams();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  const loadVideo = async () => {
    setLoading(true);
    try {
      const data = await getVideoById(params.id as string);
      setVideo(data);
    } catch (err) {
      setError('An error occurred while fetching the video.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = useCallback(async () => {
    try {
      const fetchedComments: Comment[] = await getCommentsByVideoId(params.id as string);
      setComments(fetchedComments);
    } catch (err) {
      console.error('An error occurred while fetching the comments:', err);
    }
  }, [params.id]);

  useEffect(() => {
    loadVideo();
    loadComments();
  }, [params.id, loadComments]);

  const handleAddComment = async (text: string, author: string) => {
    if (!video) return;
    try {
      const newComment = await postComment(video.id, text, author);
      setComments(prevComments => [newComment, ...prevComments]);
    } catch (err) {
      console.error('An error occurred while posting the comment:', err);
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error || !video) {
    return <div className="text-center mt-8 text-red-500">{error || 'Video not found'}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <VideoPlayer url={video.url} title={video.title}/>
      </div>
      <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
      <p className="text-gray-700 mb-4">{video.description}</p>
      <CommentSection videoId={video.id} comments={comments}/>
      <AddCommentForm videoId={video.id} onCommentAdded={handleAddComment}/>
    </div>
  );
}
