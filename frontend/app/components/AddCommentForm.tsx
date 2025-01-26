"use client";

import React, {memo, useState, useEffect} from 'react';
import {Comment} from "@/app/types/comment"
import {getLocalUserData} from "@/app/utils/authUtils";
import {User} from "@/app/types/user";


interface AddCommentFormProps {
  videoId: number;
  onCommentAdded: (text: string, author: string) => Promise<Comment | null>;
}

const AddCommentForm: React.FC<AddCommentFormProps> = memo(({videoId, onCommentAdded}) => {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // @ts-ignore
    let user: User | null = getLocalUserData();
    setUser(user);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("handleSubmit");
    e.preventDefault();
    if (!text || !user) return;

    setIsSubmitting(true);
    try {
      await onCommentAdded(text, user.username);
      setText('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isClient) {
    return null;
  }

  if (!user) {
    return (
      <div className="p-4 text-center">
        <p className="text-white">Log in to leave a comment!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-white">
          Comment
        </label>
        <textarea
          id="comment"
          rows={3}
          className="mt-1 block w-half rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
      </div>
      <div className="text-sm text-white">
        Posting as: {user.username}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-800 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        {isSubmitting ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
});

export default AddCommentForm;
