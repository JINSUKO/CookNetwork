import React, { createContext, useState, useContext, useEffect } from 'react';

// Context 생성 
const BookmarkContext = createContext();

// 북마크 커스텀 훅
export const useBookmarkContext = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarkContext must be used within a BookmarkProvider');
  }
  return context;
};

// Provider 컴포넌트 생성
export const BookmarkProvider = ({ children }) => {
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 북마크 목록 조회
  const fetchBookmark = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/bookmarkedRecipe');
      if (!response.ok) {
        throw new Error('Failed to fetch bookmarked recipes');
      }
      const data = await response.json();
      setBookmarkedRecipes(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트가 마운트될 때 북마크 목록 조회
  useEffect(() => {
    fetchBookmark();
  }, []);

  const isBookmarked = (recipeId) => bookmarkedRecipes.some(recipe => recipe.id === recipeId);

  // 북마크 추가
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
        throw new Error('서버 응답 오류 Failed to add bookmark');
      }
      const newBookmark = await response.json(); // 북마크 목록 갱신
      setBookmarkedRecipes([...bookmarkedRecipes, newBookmark]);
    } catch (err) {
      setError(err.message);
    }
  };

  // 북마크 제거
  const removeBookmark = async (bookmarkId) => {    // bookmarkID?
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
      setBookmarkedRecipes(prev => prev.filter(id => id !== recipeId));
      // 북마크 목록 갱신
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
    fetchBookmark
  };

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
};