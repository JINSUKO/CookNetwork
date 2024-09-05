import React, { createContext, useState, useContext, useEffect } from 'react';

const BookmarkContext = createContext();

export const useBookmarkContext = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarkContext must be used within a BookmarkProvider');
  }
  return context;
};

export const BookmarkProvider = ({ children }) => {
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookmarkedRecipes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/bookmarked-recipes');
      if (!response.ok) {
        throw new Error('Failed to fetch bookmarked recipes');
      }
      const data = await response.json();
      setBookmarkedRecipes(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarkedRecipes();
  }, []);

  const isBookmarked = (recipeId) => bookmarkedRecipes.some(recipe => recipe.id === recipeId);

  const addBookmark = async (recipeId) => {
    try {
      const response = await fetch(`/api/bookmark/${recipeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to add bookmark');
      }
      await fetchBookmarkedRecipes(); // 북마크 목록 갱신
    } catch (err) {
      setError(err.message);
    }
  };

  const removeBookmark = async (recipeId) => {
    try {
      const response = await fetch(`/api/bookmark/${recipeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to remove bookmark');
      }
      await fetchBookmarkedRecipes(); // 북마크 목록 갱신
    } catch (err) {
      setError(err.message);
    }
  };

  const value = {
    bookmarkedRecipes,
    loading,
    error,
    isBookmarked,
    addBookmark,
    removeBookmark,
    fetchBookmarkedRecipes
  };

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
};