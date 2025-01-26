"use client";

import React, {useState, useEffect} from 'react';
import {Comment} from '@/app/types/comment';
import {deleteComment, updateComment} from "@/app/services/commentService";
import {User} from "@/app/types/user";
import {getLocalUserData} from "@/app/utils/authUtils";

interface CommentSectionProps {
  videoId: number,
  comments: Comment[],
  refreshComments?: () => Promise<void>
}

const CommentSection: React.FC<CommentSectionProps> = ({videoId, comments, refreshComments}) => {
  const [user, setUser] = useState<User | null>(null);
  // const [user, setUser] = useState<{ username: string; isAdmin: boolean } | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    // @ts-ignore
    let user: User | null  = getLocalUserData();
    setUser(user);
  }, []);

  const canModifyComment = (comment: Comment) => {
    if (!user) return false;
    return user.profile.admin || user.username === comment.author;
  };

  const handleEditClick = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.text);
  };

  const handleSaveEdit = async (commentId: number) => {
    try {
      // @ts-ignore
      await updateComment(commentId, editText, videoId, user.username);
      setEditingCommentId(null);
      if (refreshComments) {
        await refreshComments();
      }
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleDelete = async (comment: Comment) => {
    try {
      // @ts-ignore
      await deleteComment(comment.id, comment.text, videoId, user.username);
      if (refreshComments) {
        await refreshComments();
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'AUTH_ERROR') {
        console.error('Authentication error while deleting comment');
        window.location.href = '/';
      } else {
        console.error('Failed to delete comment:', error);
      }
    }
  };

  return (
    <div className="mt-8 w-full">
      <h2 className="text-xl font-bold mb-4 pl-4">Comments</h2>
      {comments.length === 0 ? (
        <p className="text-gray-500 pl-4">No comments yet.</p>
      ) : (
        <ul className="space-y-4 w-full md:w-3/4 pl-4">
          {comments.map((comment) => (
            <li key={comment.id} className="flex flex-col bg-gray-300 p-4 rounded-lg mb-4">
              <div className="flex items-center mb-2">
                <span className="font-semibold text-gray-600 mr-2">{comment.author}</span>
                <span className="text-gray-500 text-sm">{new Date(comment.createdAt).toLocaleString()}</span>
              </div>

              {editingCommentId === comment.id ? (
                <div className="mt-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full p-2 rounded border border-gray-400 text-black"
                    rows={3}
                  />
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={() => handleSaveEdit(comment.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingCommentId(null)}
                      className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-black">{comment.text}</p>
                  {canModifyComment(comment) && (
                    <div className="mt-2 space-x-2">
                      <button
                        onClick={() => handleEditClick(comment)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(comment)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommentSection;
