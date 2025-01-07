"use client";

import React from 'react';

interface VideoPlayerProps {
  url: string;
  title: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({url, title}) => {
  return (
    <div className="relative w-auto" style={{paddingTop: '56.25%'}}>
      <video
        src={url}
        controls
        preload="auto"
        className="absolute top-0 left-0 w-full h-full object-contain"
        title={title}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
