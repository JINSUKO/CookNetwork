

import React from 'react';
import { useParams } from 'react-router-dom';

function RecipeDetail() {
  let { recipeId } = useParams();

  return (
    <div>
      <h1>레시피 상세 정보</h1>
      <p>레시피 ID: {recipeId}</p>
      {/* 여기에 레시피 상세 정보를 표시하는 로직을 추가하세요 */}
    </div>
  );
}

export default RecipeDetail;