/** StarRating.jsx
 * 레시피 상세페이지 내 평점 컴포넌트
 */

import React from "react";
// import { useRating } from '../context/StarRatingContext';
import styles from "../assets/styles/StarRating.module.css";

const StarRating = ({ onRatingChange, recipe_id }) => {
  // const { ratings } = useRating();
  // const rating = ratings[recipe_id] || 0;

  const [rating, setRating] = useState(initialRating || 0);

  // useEffect(() => {
  //   setRating(initialRating || 0);
  // }, [initialRating]);

  // const handleRatingChange = (newRating) => {
  //   setRating(recipe_id, newRating);
  //   onRatingChange(newRating, recipe_id);
  // };

  return (
    <div className={styles.wrapper}>
      <div className={styles.rating}>
        {[1, 2, 3, 4, 5].map((star) => (
          <React.Fragment key={star}>
            <input
              value={star}
              name={`rate-${recipe_id}`}
              id={`star${star}-${recipe_id}`}
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