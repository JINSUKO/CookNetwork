/* RecipeDetailPage.jsx
-레시피 상세페이지 컴포넌트입니다.
*/

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import BookmarkButton from '../components/Bookmark/BookmarkButton';
import styles from '../assets/styles/RecipeDetail.module.css';
import Loading from '../components/UI/Loading';

function RecipeDetailPage({ initialIsBookmarked, handleBookmark }) {
  const { recipe_id } = useParams();
  // const location = useLocation();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);   // recipes 데이터 빈 배열로 설정

  const API_URL = import.meta.env.VITE_HOST_IP;
  const filterOptions = [
    "메인요리", "반찬", "국/탕", "디저트", "면",
    "밥/죽/떡", "퓨전", "양념/소스", "채식", "분식", "안주",
    "스프", "간식", "음료", "다이어트", "도시락"
  ];

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
    return <div><Loading/></div>;
  } else {
    return (
      <Container className={styles.recipeDetail} fluid="xl">
        <Row className="justify-content-center">
          <Col md={8} lg={8} xl={6}>
            <div className={styles.imageContainer}>
              <img src={recipe.recipe_img} alt="레시피 사진" className={styles.mainImage}/>
              <img src={recipe.user_img} alt={recipe.username} className={styles.chefProfile} />
              <p className={styles.chefName}>{recipe.username}</p>
            </div>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col md={8} lg={8} xl={6}>
              <h1 className={styles.recipeTitle}>{recipe.recipe_name}</h1>
              <div className={styles.recipeInfo}>
                <p>{recipe.recipe_desc}</p>
              </div>
          </Col>
          <Col md={8} lg={8} xl={6}>
            <BookmarkButton recipeId={recipe.id} initialIsBookmarked={recipe.isBookmarked} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col  xs="auto">
            <p>평점</p>
            <p></p>
          </Col>
        </Row>
        <hr/>
        <Row className="text-center my-3">
          <div className={styles.recipeStats}>
            <Col xs={6} md={4}>{recipe.serving}인분</Col>
            <Col xs={6} md={4}>{recipe.cooked_time}분</Col>
            <Col xs={6} md={4}>레벨 {recipe.level}</Col>
          </div>
        </Row>
        <hr/>
        <Row className="align-items-center">
          <Col  xs="auto">
            <h2>재료</h2>
            <span>ingredient.ingredient_name</span>
            <span>ingredient.count</span>
            <span>ingredient.ingredient_unit</span>
          </Col>
        </Row>
        <hr/>
        <Row className="align-items-center">
          <div className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>조리순서</h2>
            <ol className={styles.stepList}>
              {recipe.steps && recipe.steps.map((step, index) => (
                <li key={index} className={styles.stepItem}>
                  <span className={styles.stepNumber}>{index + 1}</span>
                  <div>
                    <p>{step.desc}</p>
                    {step.image && <img src={step.image} alt={`Step ${index + 1}`} className={styles.stepImage} />}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Row>
        <Row className="align-items-center">
            {recipe.tips && (
            <div className={styles.contentSection}>
              <h2 className={styles.sectionTitle}>조리팁!</h2>
              <p>{recipe.tips}</p>
            </div>
          )}
        </Row>
        <hr/>
        <Row className="align-items-center">
          <div className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>#태그</h2>
            <p>{recipe.category && recipe.category.map(cat => cat.category_name).join(', ')}</p>

          </div>
        </Row>
        <hr/>
        <Row className="align-items-center">
          <Col  xs="auto">
            <h2>평점 등록</h2>
            <p></p>
          </Col>
        </Row>

      </Container>
    );
  }



  
}

export default RecipeDetailPage;