"use client";

import React, { useState } from 'react';
import {postComment} from "@/app/services/commentService";
import {User} from "@/app/types/user";

interface AddCommentFormProps {
  videoId: string;
  onCommentAdded: (newComment: Comment) => void;
}

const AddCommentForm: React.FC<AddCommentFormProps> = ({ videoId, onCommentAdded }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      // Assume you have an API function to post a new comment
      const newComment = await postComment(videoId, comment, username);
      onCommentAdded(newComment);
      setComment('');
    } catch (error) {
      console.error('Failed to post comment:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Add a comment
        </label>
        <textarea
          id="comment"
          rows={3}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
          placeholder="Write your comment here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
      </div>
      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Post Comment
      </button>
    </form>
  );
};

export default AddCommentForm;
