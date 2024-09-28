"use client";

import React, {useState} from 'react';

interface AddCommentFormProps {
  videoId: number;
  onCommentAdded: (text: string, author: string) => Promise<void>;
}

const AddCommentForm: React.FC<AddCommentFormProps> = ({videoId, onCommentAdded}) => {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text || !author) return;

    setIsSubmitting(true);
    try {
      await onCommentAdded(text, author);
      setText('');
      setAuthor('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="comment" className="block pt-4 text-sm font-medium text-gray-300">
          Add a new comment
        </label>
        <textarea
          id="comment"
          rows={3}
          className="mt-1 block w-half rounded-md border-gray-300 shadow-sm text-white bg-gray-700 outline-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="author" className="block text-sm font-medium text-white">
          Username
        </label>
        <input
          type="text"
          id="author"
          className="mt-1 block w-half rounded-md border-gray-300 shadow-sm focus:border-gray-400 focus:ring-0 text-black"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex justify-center rounded-md border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-white-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        {isSubmitting ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
};

export default AddCommentForm;
