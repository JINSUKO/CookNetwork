import React, { useState, useEffect } from "react";
import styles from "../assets/styles/StarRating.module.css";

const StarRating = ({ initialRating, onRatingChange, recipeId }) => {
  const [rating, setRating] = useState(initialRating || 0);

  useEffect(() => {
    setRating(initialRating || 0);
  }, [initialRating]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    onRatingChange(newRating, recipeId);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.rating}>
        {[5, 4, 3, 2, 1].map((star) => (
          <React.Fragment key={star}>
            <input
              value={star}
              name="rate"
              id={`star${star}`}
              type="radio"
              checked={rating === star}
              onChange={() => handleRatingChange(star)}
            />
            <label title={`${star} stars`} htmlFor={`star${star}`} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StarRating;