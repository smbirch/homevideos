"use client";

import React, {useState, useEffect, useCallback} from 'react';
import {useInView} from 'react-intersection-observer';
import Link from 'next/link';
import {Video} from '@/app/types/video';
import {getVideoPage} from "@/app/services/videoService";

export default function HomePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const {ref, inView} = useInView({
    threshold: 0,
  });

  const getVideos = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    let isCurrent = true;

    try {
      const newVideoPage = await getVideoPage(page);
      if (isCurrent) {
        if (newVideoPage.length < 12) {
          setHasMore(false);
        }
        setVideos((prevVideos) => [...prevVideos, ...newVideoPage]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      if (isCurrent) {
        setLoading(false);
      }
    }
    return () => {
      isCurrent = false;
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    if (inView) {
      getVideos();
    }
  }, [inView, getVideos]);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Link href={`/video/${video.id}`} key={video.id}>
            <div
              className="bg-black rounded-lg shadow-md overflow-hidden cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-800">
              <img
                src={video.thumbnailurl}
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold truncate text-center">{video.title}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {loading && <p className="text-center mt-4">Loading...</p>}
      {!hasMore && <p className="text-center mt-4">No more videos to load.</p>}
      <div ref={ref} style={{height: '10px'}}></div>
    </div>
  );
}
