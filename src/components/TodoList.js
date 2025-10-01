import React, { useState } from 'react';
import { useTodos } from '../hooks/useTodos';
import TodoItem from './TodoItem';

const TodoList = ({ todos, loading }) => {
  const [editingId, setEditingId] = useState(null);
  const { toggleTodo, deleteTodo } = useTodos();

  const handleToggle = async (id, completed) => {
    await toggleTodo(id, !completed);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      await deleteTodo(id);
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleEditComplete = () => {
    setEditingId(null);
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading todos...</span>
        </div>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No todos</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first todo.
          </p>
        </div>
      </div>
    );
  }

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <div className="space-y-6">
      {/* Active Todos */}
      {activeTodos.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Active Todos ({activeTodos.length})
            </h3>
            <div className="space-y-3">
              {activeTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onEditComplete={handleEditComplete}
                  isEditing={editingId === todo.id}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Completed Todos */}
      {completedTodos.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Completed Todos ({completedTodos.length})
            </h3>
            <div className="space-y-3">
              {completedTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onEditComplete={handleEditComplete}
                  isEditing={editingId === todo.id}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;
