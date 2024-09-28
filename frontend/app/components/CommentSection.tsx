"use client";

import React from 'react';
import {Comment} from '@/app/types/comment';

interface CommentSectionProps {
  videoId: number;
  comments: Comment[];
}

const CommentSection: React.FC<CommentSectionProps> = ({videoId, comments}) => {
  return (
    <div className="mt-8 w-full">
      <h2 className="text-xl font-bold mb-4">Comments</h2>
      {comments.length === 0 ? (
        <p className="text-gray-500 pl-4">No comments yet.</p>
      ) : (
        <ul className="space-y-4 w-full md:w-3/4 ">
          {comments.map((comment) => (
            <li key={comment.id} className="flex flex-col pb-4 pt-4 rounded-lg">
              <p className="text-gray-100">{comment.text}</p>
              <div className="flex items-center mb-2 pt-3">
                <span>&gt;&gt;&nbsp;</span>
                <span className="font-semibold text-gray-300 mr-2">{comment.author}</span>
                <span className="text-gray-500 text-sm">{new Date(comment.createdAt).toLocaleString()}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommentSection;
