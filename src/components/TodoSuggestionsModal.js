import React from 'react';
import AiLoadingIndicator from './AiLoadingIndicator';

const TodoSuggestionsModal = ({
  open,
  onClose,
  suggestions,
  loading,
  message,
  error,
  selectedIndexes,
  onToggleSuggestion,
  onAddSelected,
  adding,
}) => {
  if (!open) {
    return null;
  }

  const hasSuggestions = suggestions && suggestions.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={() => !adding && onClose()}
      />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Suggested todos</h2>
            <p className="text-sm text-slate-500">Powered by our AI copilot</p>
          </div>
          <button
            onClick={onClose}
            disabled={adding}
            className="text-slate-400 hover:text-slate-600 disabled:opacity-50"
            aria-label="Close suggestions"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <AiLoadingIndicator />
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-medium text-red-700">{error}</p>
              <p className="mt-1 text-xs text-red-600">Please try again in a moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {message ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-sm text-slate-600">{message}</p>
                </div>
              ) : null}

              {hasSuggestions ? (
                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <label
                      key={`${suggestion.title}-${index}`}
                      className="flex cursor-pointer items-start space-x-3 rounded-lg border border-slate-200 px-4 py-3 hover:border-blue-300 hover:shadow-sm"
                    >
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedIndexes.includes(index)}
                        onChange={() => onToggleSuggestion(index)}
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{suggestion.title}</p>
                        {suggestion.description ? (
                          <p className="mt-1 text-sm text-slate-600">{suggestion.description}</p>
                        ) : null}
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-sm text-slate-500">
                  No suggestions are available just yet.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            {loading
              ? 'Generating personalized ideas...'
              : hasSuggestions
              ? 'Select the todos you want to add to your list.'
              : 'Come back after adding a few more todos to see AI suggestions.'}
          </p>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={adding}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 disabled:opacity-50"
            >
              Close
            </button>
            <button
              type="button"
              onClick={onAddSelected}
              disabled={adding || !selectedIndexes.length || loading}
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {adding ? (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : null}
              Add selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoSuggestionsModal;
