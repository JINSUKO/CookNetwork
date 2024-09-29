import React, { createContext, useState, useContext } from 'react';

const RatingContext = createContext();

export const useRating = () => useContext(RatingContext);

export const RatingProvider = ({ children }) => {
  const [ratings, setRatings] = useState({});

  const setRating = (recipeId, rating) => {
    setRatings(prevRatings => ({
      ...prevRatings,
      [recipeId]: rating
    }));
  };

  return (
    <RatingContext.Provider value={{ ratings, setRating }}>
      {children}
    </RatingContext.Provider>
  );
};