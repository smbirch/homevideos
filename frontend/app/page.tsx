"use client";

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import { Video } from '@/app/types/video';
import { getVideoPage } from "@/app/services/videoService";
import { Loader2 } from "lucide-react";

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[200px]">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

// Error boundary component
const ErrorDisplay = ({ error }: { error: Error }) => (
  <div className="text-center p-4 text-red-500">
    <p>Error loading content: {error.message}</p>
    <button
      onClick={() => window.location.reload()}
      className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Retry
    </button>
  </div>
);

export default function HomePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isClient, setIsClient] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  // Handle client-side mounting
  useEffect(() => {
    setIsClient(true);
  }, []);

  const getVideos = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);

    try {
      const newVideoPage = await getVideoPage(page);

      // Handle empty or invalid response
      if (!Array.isArray(newVideoPage)) {
        throw new Error('Invalid response format');
      }

      if (newVideoPage.length < 12) {
        setHasMore(false);
      }

      setVideos((prevVideos) => [...prevVideos, ...newVideoPage]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError(error instanceof Error ? error : new Error('Failed to fetch videos'));
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  // Initial data fetch
  useEffect(() => {
    if (isClient && videos.length === 0) {
      getVideos();
    }
  }, [isClient, getVideos, videos.length]);

  // Infinite scroll handler
  useEffect(() => {
    if (inView && isClient && !loading && hasMore) {
      getVideos();
    }
  }, [inView, getVideos, isClient, loading, hasMore]);

  // Show loading state before client-side hydration
  if (!isClient) {
    return <LoadingSpinner />;
  }

  // Show error state if there's an error
  if (error && videos.length === 0) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Link href={`/video/${video.id}`} key={video.id}>
            <div className="bg-black rounded-lg shadow-md overflow-hidden cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-800">
              <div className="relative w-full h-48">
                <img
                  src={video.thumbnailurl}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold truncate text-center">{video.title}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {loading && <LoadingSpinner />}
      {!hasMore && videos.length > 0 && (
        <p className="text-center mt-4">No more videos to load.</p>
      )}
      <div ref={ref} className="h-10" />
    </div>
  );
}


// "use client";
//
// import React, {useState, useEffect, useCallback} from 'react';
// import {useInView} from 'react-intersection-observer';
// import Link from 'next/link';
// import {Video} from '@/app/types/video';
// import {getVideoPage} from "@/app/services/videoService";
//
// export default function HomePage() {
//   const [videos, setVideos] = useState<Video[]>([]);
//   const [page, setPage] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [mounted, setMounted] = useState(false);
//
//   const {ref, inView} = useInView({
//     threshold: 0,
//   });
//
//   // Add this effect to handle initial mount
//   useEffect(() => {
//     setMounted(true);
//     // Fetch initial data
//     getVideos();
//   }, []);
//
//   const getVideos = useCallback(async () => {
//     if (loading || !hasMore) return;
//     setLoading(true);
//
//     try {
//       const newVideoPage = await getVideoPage(page);
//       if (newVideoPage.length < 12) {
//         setHasMore(false);
//       }
//       setVideos((prevVideos) => [...prevVideos, ...newVideoPage]);
//       setPage((prevPage) => prevPage + 1);
//     } catch (error) {
//       console.error('Error fetching videos:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [page, loading, hasMore]);
//
//   useEffect(() => {
//     if (inView && mounted) {
//       getVideos();
//     }
//   }, [inView, getVideos, mounted]);
//
//   // Show loading state before mount
//   if (!mounted) {
//     return (
//       <div className="container mx-auto p-4">
//         <div className="text-center">Loading...</div>
//       </div>
//     );
//   }
//
//   return (
//     <div className="container mx-auto p-4">
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
//         {videos.map((video) => (
//           <Link href={`/video/${video.id}`} key={video.id}>
//             <div
//               className="bg-black rounded-lg shadow-md overflow-hidden cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-800">
//               <img
//                 src={video.thumbnailurl}
//                 alt={video.title}
//                 className="w-full h-48 object-cover"
//               />
//               <div className="p-4">
//                 <h2 className="text-lg font-semibold truncate text-center">{video.title}</h2>
//               </div>
//             </div>
//           </Link>
//         ))}
//       </div>
//       {loading && <p className="text-center mt-4">Loading...</p>}
//       {!hasMore && <p className="text-center mt-4">No more videos to load.</p>}
//       <div ref={ref} style={{height: '10px'}}></div>
//     </div>
//   );
// }
