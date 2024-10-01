import React, { createContext, useState, useContext, useCallback } from 'react';

const RatingContext = createContext();

export const useRating = () => useContext(RatingContext);

export const RatingProvider = ({ children }) => {
  const [ratings, setRatings] = useState({});
  const [averageRatings, setAverageRatings] = useState({});

  // 로그인 유저 별점 등록
  const setRating = (recipe_id, rating) => {
    setRatings(prevRatings => ({
      ...prevRatings,
      [recipe_id]: rating
    }));
  };

  // 평균 별점 계산
  const calculateAverageRating = useCallback((recipe_id, ratingData) => {
    const totalRating = ratingData.reduce((sum, rate) => sum + rate.rate, 0);
    const averageRating = totalRating / ratingData.length;
    setAverageRatings(prevAverageRatings => ({
      ...prevAverageRatings,
      [recipe_id]: averageRating
    }));
  }, []);

  return (
    <RatingContext.Provider value={{ ratings, setRating, averageRatings, calculateAverageRating }}>
      {children}
    </RatingContext.Provider>
  );
};