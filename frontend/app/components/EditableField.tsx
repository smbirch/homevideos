"use client"

import React, { useState } from 'react';

// @ts-ignore
const EditableField = ({ value, onSave, onCancel, isTextArea = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);

  const handleSave = () => {
    onSave(editedValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedValue(value);
    setIsEditing(false);
    onCancel?.();
  };

  if (!isEditing) {
    return (
      <div
        onClick={() => setIsEditing(true)}
        className="w-1/3 rounded-md hover:bg-gray-100 hover:text-gray-600 transition-colors p-2 cursor-pointer mx-3"
      >
        {isTextArea ? (
          <p className="text-gray-700 mb-8">{value}</p>
        ) : (
          <h1 className="text-3xl font-bold mb-4">{value}</h1>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-1/3 text-black">
      {isTextArea ? (
        <textarea
          value={editedValue}
          onChange={(e) => setEditedValue(e.target.value)}
          className="w-full p-2 border rounded-md"
          rows={4}
        />
      ) : (
        <input
          type="text"
          value={editedValue}
          onChange={(e) => setEditedValue(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      )}
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
        >
          Save
        </button>
        <button
          onClick={handleCancel}
          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditableField;
