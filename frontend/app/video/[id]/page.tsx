"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Video } from '../../types/video';

export default function VideoPage() {
  const params = useParams();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`http://localhost:8080/video/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch video');
        }
        const data = await response.json();
        setVideo(data);
      } catch (err) {
        setError('An error occurred while fetching the video.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [params.id]);

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error || !video) {
    return <div className="text-center mt-8 text-red-500">{error || 'Video not found'}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <div className="relative w-auto " style={{paddingTop: '56.25%'}}> {/* 16:9 Aspect Ratio */}
          <video
            src={video.url}
            controls
            className="absolute top-0 left-0 w-full h-full object-contain"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
      <p className="text-gray-700 mb-4">{video.description}</p>
      {/* You can add more details here, such as upload date, view count, etc. */}
    </div>
  );
}
