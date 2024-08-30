/* RecipeDetailPage.jsx
-레시피 상세페이지 컴포넌트입니다.
-상세페이지가 로딩됐을 때 한번만 실행되어야 하므로 useEffect 훅 사용
-새로고침 없이 컴포넌트만 다시 렌더링하기 위해 react router link, useNavigate 사용
-동적라우팅 매개변수 recipe 
*/

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

function RecipeDetailPage() {
  const { recipe_id } = useParams();
  // const location = useLocation();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);   // recipes 데이터 빈 배열로 설정
  const API_URL = import.meta.env.VITE_HOST_IP;


  const fetchRecipeDetails = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/recipe/${recipe_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if(!response.ok) {
        throw new Error((await response.json()).error);
      }

      // 레시피 데이터 result를 받아 recipes에 저장
      const result = await response.json();
      console.log("성공:", result)
      if (result) {
        console.log(`${recipe_id} 레시피 호출 성공`);
        setRecipe(result);
      }
    } catch (error) {
      console.error("레시피 호출 실패:", error);
    }
  }, [recipe_id]);

  const fetchRecipeRate = useCallback(async () => {  
  }, [recipe_id]);

  const fetchRecipeIngredients = useCallback(async () => {
    
  }, [recipe_id]);
  
  useEffect(() => {   // 컴포넌트가 마운트될 때 fetch 함수 호출
    fetchRecipeDetails();
    fetchRecipeRate();
    fetchRecipeIngredients();
  }, [fetchRecipeDetails, fetchRecipeRate, fetchRecipeIngredients]);

  if (!recipe) {
    return <div>로딩 중...</div>;
  } else {
    return (
      <Container className='recipe-detail-container' fluid="xl">
        <Row className="justify-content-center">
          <Col md={8} lg={8} xl={6}>
            <img src={recipe.recipe_img} alt="레시피 사진" className="img-fluid"/>
            <div className='recipe-title-wrap'>
              <h2>{recipe.recipe_name}</h2>
              <p>{recipe.recipe_desc}</p>
            </div>
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col  xs="auto">
            <p>평점 등록</p>
            <p></p>
          </Col>
        </Row>
        <Row className="text-center my-3">
          <Col xs={6} md={4}>{recipe.serving}인분</Col>
          <Col xs={6} md={4}>{recipe.cooked_time}분</Col>
          <Col xs={6} md={4}>레벨 {recipe.level}</Col>
        </Row>
        <Row className="align-items-center">
          <Col  xs="auto">
            <Image src={recipe.user_img} alt="셰프 프로필" roundedCircle  width={50} height={50} />
            <span>{recipe.username}</span>
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col  xs="auto">
            <p>재료</p>
            <span>ingredient.ingredient_name</span>
            <span>ingredient.count</span>
            <span>ingredient.ingredient_unit</span>
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col  xs="auto">
            <p>조리법</p>
            <p>Step.1<br/>Step.2<br/>Step.3</p>
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col  xs="auto">
            <p>조리팁!</p>
            <p>recipe.tips</p>
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col  xs="auto">
            <p>#태그</p>
            <p>recipe_category.category_id.category_name</p>
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col  xs="auto">
            <p>평점 등록</p>
            <p></p>
          </Col>
        </Row>
      </Container>
    );
  }



  
}

export default RecipeDetailPage;