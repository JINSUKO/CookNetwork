/* RecipeDetailPage.jsx
-레시피 상세페이지 컴포넌트입니다.
-상세페이지가 로딩됐을 때 한번만 실행되어야 하므로 useEffect 훅 사용
-새로고침 없이 컴포넌트만 다시 렌더링하기 위해 react router link, useNavigate 사용
-동적라우팅 매개변수 recipe 
*/

import React from 'react';
import { Container } from 'react-bootstrap';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

function RecipeDetailPage( recipe ) {
  const { recipe_id } = useParams();
  // const location = useLocation();
  const navigate = useNavigate();

  // 
  // useEffect(() => {
  //   if () {

  //     navigate("/recipe/:id");
  //   }
  // }, [])


  return (
    <Container className='recipe-detail-container'>
      <div className='recipeTitleContainer'>{recipe_name}</div>
        <div className="col-md-6">
          <img src={recipe.recipe_img} width="100%" />
          <img src={user_img}/>
        </div>
        <div className="col-md-6">
          <h4 className='pt-5'>{recipe.recipe_name}</h4>
          <p></p>
        </div>

      <p>레시피 ID: {recipe_id}</p>
      {/* 여기에 레시피 상세 정보를 표시하는 로직을 추가하세요 */}
    </Container>
  );
}

export default RecipeDetailPage;