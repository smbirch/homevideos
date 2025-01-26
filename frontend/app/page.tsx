'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { Video } from '@/app/types/video';
import { getVideoPage } from "@/app/services/videoService";
import LoadingSpinner from "@/app/components/LoadingSpinner"

const ErrorDisplay = ({ onRetry }: { onRetry: () => void }) => (
  <div className="text-center p-6 bg-gray-100">
    <p className="text-red-600 mb-4">Unable to load videos</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Try Again
    </button>
  </div>
);

export default function HomePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { ref, inView } = useInView({
    threshold: 1,
    rootMargin: '200px',
  });

  const fetchVideos = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const newVideos = await getVideoPage(page);

      if (newVideos.length < 12) {
        setHasMore(false);
      }

      // Append new videos
      setVideos(prevVideos => [...prevVideos, ...newVideos]);

      // Increment page
      setPage(prevPage => prevPage + 1);
    } catch (err) {
      console.error('Failed to fetch videos:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch videos'));
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    fetchVideos();
  }, []);

  // Infinite scroll
  useEffect(() => {
    if (inView && !loading && hasMore) {
      fetchVideos();
    }
  }, [inView, fetchVideos, loading, hasMore]);

  if (error && videos.length === 0) {
    return <ErrorDisplay onRetry={() => {
      setPage(0);
      setVideos([]);
      setHasMore(true);
      fetchVideos();
    }} />;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((video) => (
          <Link
            key={video.id}
            href={`/video/${video.id}`}
            className="group"
          >
            <div className="bg-black rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 group-hover:scale-105">
              <Image
                src={video.thumbnailurl}
                alt={video.title}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
                priority={false}
                loading="lazy"
              />
              <div className="p-4">
                <h2 className="text-white text-lg font-semibold truncate text-center">
                  {video.title}
                </h2>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {loading && <LoadingSpinner />}

      {!hasMore && videos.length > 0 && (
        <p className="text-center mt-4 text-gray-500">
          No more videos to load
        </p>
      )}

      <div ref={ref} className="h-10" />
    </div>
  );
}
