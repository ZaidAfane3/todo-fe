import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { todoService } from '../services/api';

const TodosContext = createContext(null);

const useTodosProvider = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await todoService.getTodos();
      if (response.success) {
        setTodos(response.data || []);
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch todos';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTodo = useCallback(async (todoData) => {
    try {
      const response = await todoService.createTodo(todoData);
      if (response.success) {
        setTodos(prev => [response.data, ...prev]);
        return { success: true, data: response.data };
      }
      return { success: false, message: response.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create todo';
      setError(message);
      return { success: false, message };
    }
  }, []);

  const updateTodo = useCallback(async (id, updates) => {
    try {
      const response = await todoService.updateTodo(id, updates);
      if (response.success) {
        setTodos(prev => prev.map(todo =>
          todo.id === id ? response.data : todo
        ));
        return { success: true, data: response.data };
      }
      return { success: false, message: response.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update todo';
      setError(message);
      return { success: false, message };
    }
  }, []);

  const deleteTodo = useCallback(async (id) => {
    try {
      const response = await todoService.deleteTodo(id);
      if (response.success) {
        setTodos(prev => prev.filter(todo => todo.id !== id));
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete todo';
      setError(message);
      return { success: false, message };
    }
  }, []);

  const toggleTodo = useCallback(async (id, completed) => {
    return updateTodo(id, { completed });
  }, [updateTodo]);

  const value = useMemo(() => ({
    todos,
    loading,
    error,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
  }), [todos, loading, error, fetchTodos, createTodo, updateTodo, deleteTodo, toggleTodo]);

  return value;
};

export const TodosProvider = ({ children }) => {
  const value = useTodosProvider();

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(TodosContext);

  if (!context) {
    throw new Error('useTodos must be used within a TodosProvider');
  }

  return context;
};
