// frontend/src/components/TaskItem.js
import React, { useState } from 'react';

const TaskItem = ({ task, onEdit, onDelete, onUpdate, onCancelEdit, isEditing, currentEditText, onTextChange }) => {
  return (
    <li
      key={task.id}
      className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg shadow-sm bg-gray-100 hover:bg-gray-200 transition-all duration-200 ease-in-out"
    >
      {isEditing ? (
        <>
          <input
            type="text"
            value={currentEditText}
            onChange={onTextChange}
            className="flex-1 px-3 py-2 border rounded w-full sm:w-auto mb-3 sm:mb-0 mr-0 sm:mr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={`Edit task ${task.title}`}
          />
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={onUpdate}
              className="flex-1 sm:flex-none text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors duration-200"
            >
              Save
            </button>
            <button
              onClick={onCancelEdit}
              className="flex-1 sm:flex-none text-sm text-gray-600 hover:text-gray-800 border border-gray-300 px-3 py-1 rounded transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <span className="text-lg text-gray-800 font-medium break-words w-full sm:w-auto pr-2">{task.title}</span>
          <div className="flex gap-2 mt-3 sm:mt-0">
            <button
              onClick={() => onEdit(task)}
              className="text-sm bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded transition-colors duration-200"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors duration-200"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
};

export default TaskItem;