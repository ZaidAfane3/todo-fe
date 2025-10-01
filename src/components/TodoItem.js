import React, { useState } from 'react';
import TodoForm from './TodoForm';

const TodoItem = ({ todo, onToggle, onDelete, onEdit, onEditComplete, isEditing }) => {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await onToggle(todo.id, todo.completed);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(todo.id);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    onEdit(todo.id);
  };

  if (isEditing) {
    return (
      <div className="border border-gray-200 rounded-lg p-4">
        <TodoForm
          initialData={todo}
          onClose={onEditComplete}
          onSubmit={onEditComplete}
        />
      </div>
    );
  }

  return (
    <div className={`border border-gray-200 rounded-lg p-4 transition-all duration-200 ${
      todo.completed ? 'bg-gray-50 opacity-75' : 'bg-white hover:shadow-sm'
    }`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <button
            onClick={handleToggle}
            disabled={loading}
            className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${
              todo.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-blue-500'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
            ) : todo.completed ? (
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : null}
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className={`text-sm font-medium ${
              todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'
            }`}>
              {todo.title}
            </h4>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleEdit}
                disabled={loading}
                className="text-gray-400 hover:text-blue-600 p-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Edit todo"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete todo"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {todo.description && (
            <p className={`mt-1 text-sm ${
              todo.completed ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {todo.description}
            </p>
          )}

          <div className="mt-2 text-xs text-gray-500">
            Created: {new Date(todo.created_at || todo.createdAt).toLocaleDateString()}
            {todo.updated_at && todo.updated_at !== todo.created_at && (
              <span className="ml-2">
                • Updated: {new Date(todo.updated_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
