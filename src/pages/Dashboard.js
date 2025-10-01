import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTodos } from '../hooks/useTodos';
import TodoList from '../components/TodoList';
import TodoForm from '../components/TodoForm';
import UserProfile from '../components/UserProfile';
import TodoSuggestionsModal from '../components/TodoSuggestionsModal';
import { todoService } from '../services/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { todos, loading, error, fetchTodos, createTodo } = useTodos();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState(null);
  const [suggestionsMessage, setSuggestionsMessage] = useState('');
  const [selectedSuggestionIndexes, setSelectedSuggestionIndexes] = useState([]);
  const [addingSuggestions, setAddingSuggestions] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleLogout = async () => {
    await logout();
  };

  const handleCloseSuggestions = useCallback(() => {
    if (addingSuggestions) {
      return;
    }
    setShowSuggestions(false);
  }, [addingSuggestions]);

  const handleToggleSuggestion = useCallback((index) => {
    setSelectedSuggestionIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  }, []);

  const handleGetSuggestions = useCallback(async () => {
    setShowSuggestions(true);
    setSuggestions([]);
    setSelectedSuggestionIndexes([]);
    setSuggestionsMessage('');
    setSuggestionsError(null);
    setSuggestionsLoading(true);

    try {
      const response = await todoService.getTodoSuggestions();
      if (response.success) {
        const suggestionList = response.data?.suggestions || [];
        setSuggestions(suggestionList);
        setSuggestionsMessage(response.message || '');
      } else {
        setSuggestionsError(response.message || 'Unable to generate suggestions right now.');
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Unable to generate suggestions right now.';
      setSuggestionsError(message);
    } finally {
      setSuggestionsLoading(false);
    }
  }, []);

  const handleAddSelectedSuggestions = useCallback(async () => {
    if (!selectedSuggestionIndexes.length) {
      return;
    }

    setAddingSuggestions(true);
    setSuggestionsError(null);

    try {
      for (const suggestionIndex of selectedSuggestionIndexes) {
        const suggestion = suggestions[suggestionIndex];
        if (!suggestion) {
          continue;
        }

        const result = await createTodo({
          title: suggestion.title,
          description: suggestion.description?.trim() ? suggestion.description : null,
          completed: false,
        });

        if (!result.success) {
          throw new Error(result.message || 'Failed to add one of the suggestions.');
        }
      }

      setShowSuggestions(false);
      setSelectedSuggestionIndexes([]);
    } catch (err) {
      const message = err.message || 'Failed to add the selected suggestions.';
      setSuggestionsError(message);
    } finally {
      setAddingSuggestions(false);
    }
  }, [createTodo, selectedSuggestionIndexes, suggestions]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="bg-blue-600 rounded-lg p-2">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="ml-3 text-xl font-semibold text-gray-900">Todo App</h1>
            </div>

            <div className="flex items-center space-x-4">
              <UserProfile user={user} />
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Add Todo Button */}
          <div className="mb-6 flex flex-wrap gap-3">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Todo
            </button>
            <button
              onClick={handleGetSuggestions}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-blue-200 bg-white text-blue-600 shadow-sm transition hover:border-blue-300 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7M9 5v2m6-2v2M7 9H5m14 0h-2M7 15H5m14 0h-2" />
              </svg>
              Suggest todos
            </button>
          </div>

          {/* Add Todo Form */}
          {showAddForm && (
            <div className="mb-6">
              <TodoForm onClose={() => setShowAddForm(false)} />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Todo List */}
          <TodoList todos={todos} loading={loading} />
        </div>
      </main>

      <TodoSuggestionsModal
        open={showSuggestions}
        onClose={handleCloseSuggestions}
        suggestions={suggestions}
        loading={suggestionsLoading}
        message={suggestionsMessage}
        error={suggestionsError}
        selectedIndexes={selectedSuggestionIndexes}
        onToggleSuggestion={handleToggleSuggestion}
        onAddSelected={handleAddSelectedSuggestions}
        adding={addingSuggestions}
      />
    </div>
  );
};

export default Dashboard;
