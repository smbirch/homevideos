"use client";

import React from 'react';
import { Comment } from '@/app/types/comment'; // Assume you have a Comment type defined

interface CommentSectionProps {
  videoId: number;
  comments: Comment[];
}

const CommentSection: React.FC<CommentSectionProps> = ({ videoId, comments }) => {
  return (
    <div className="mt-8">
      <h2 className="text-1xl font-bold mb-4">Comments</h2>
      {comments.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        <ul className="space-y-2">
          {comments.map((comment) => (
            <li key={comment.id} className="bg-gray-300 p-4 rounded-lg mr-[60rem]">
              <div className="flex items-center mb-2">
                <span className="font-semibold text-gray-400 mr-2">{comment.author}</span>
                <span className="text-gray-400 text-sm">{new Date(comment.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-black">{comment.text}</p>
            </li>
          ))}
        </ul>
      )}
      {/* TODO: Add a form to post new comments */}
    </div>
  );
};

export default CommentSection;
