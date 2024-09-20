/* RecipeDetailPage.jsx
-레시피 상세페이지 컴포넌트입니다.
*/

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import BookmarkButton from '../components/Bookmark/BookmarkButton';
import styles from '../assets/styles/RecipeDetail.module.css';
import { FaUsers, FaClock, FaChartBar } from 'react-icons/fa';
import Loading from '../components/UI/Loading';

function RecipeDetailPage({ initialIsBookmarked, handleBookmark }) {
  const { recipe_id } = useParams();
  // const location = useLocation();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);   // recipes 데이터 빈 배열로 설정
  const [ingredients, setIngredients] = useState([]);
  const [orders, setOrders] = useState([]);

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
      console.log("레시피:", result)
      if (result) {
        setRecipe(result);
      }
    } catch (error) {
      console.error("레시피 호출 실패:", error);
    }
  }, [recipe_id]);

  const fetchRecipeRate = useCallback(async () => {  
  }, [recipe_id]);

  // 재료 데이터 호출
  const fetchRecipeIngredients = useCallback(async () => {
    try{
      const response = await fetch(`${API_URL}/api/recipe/${recipe_id}/ingredients`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if(!response.ok) {
        throw new Error((await response.json()).error);
      }

      const result = await response.json();
      console.log("재료 데이터 호출 성공:", result);
      if (result) {
        setIngredients(result);
      }
    } catch (error) {
      console.error("재료 호출 실패:", error);
    }
  }, [recipe_id]);
  
  // 조리순서 데이터
  const fetchRecipeOrders = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/recipe/${recipe_id}/orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if(!response.ok) {
        throw new Error((await response.json()).error);
      }

      const result = await response.json();
      console.log("조리순서 데이터 호출 성공:", result);
      if (result) {
        setOrders(result);
      }
    } catch (error) {
      console.error("조리순서 호출 실패:", error);
    }
  }, [recipe_id]);

  // 컴포넌트가 마운트될 때 fetch 함수 호출
  useEffect(() => {   
    fetchRecipeDetails();
    fetchRecipeRate();
    fetchRecipeIngredients();
    fetchRecipeOrders();
  }, [fetchRecipeDetails, fetchRecipeRate, fetchRecipeIngredients, fetchRecipeOrders]);

  if (!recipe) {
    return <div><Loading/></div>;
  } else {
    return (
      <Container className={styles.recipeDetail}>
      <Row>
        <Col>
          <div className={styles.imageContainer}>
            <Image src={recipe.recipe_img} alt={recipe.recipe_name} fluid className={styles.mainImage} />
            <Image src={recipe.user_img} alt={recipe.username} roundedCircle className={styles.chefProfile} />
          </div>
          <div>
            <p className={styles.chefName}>{recipe.username}</p>
          </div>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className={styles.recipeTitle}>{recipe.recipe_name}</h1>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={8}>
          <div className={styles.recipeInfo}>
            <p>{recipe.recipe_desc}</p>
            <BookmarkButton recipeId={recipe.id} initialIsBookmarked={recipe.isBookmarked} />
            
            <Row className={styles.recipeStats}>
              <Col xs={3}>
                <FaUsers className={styles.icon} size={20} color="#666" />
                 {recipe.serving}인분</Col>
              <Col xs={3}>
                <FaClock className={styles.icon} size={20} color="#666" />
                 {recipe.cooked_time}분</Col>
              <Col xs={3}>
                <FaChartBar className={styles.icon} size={20} color="#666" />
                 레벨 {recipe.level}</Col>
            </Row>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>재료</h2>
            <ul className={styles.ingredientList}>
              {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
                <li key={index} className={styles.ingredientItem}>
                  {ingredient.ingredient_name}: {ingredient.count} {ingredient.ingredient_unit}
                </li>
              ))}
            </ul>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>조리순서</h2>
            <ol className={styles.stepList}>
              {recipe.steps && recipe.steps.map((step, index) => (
                <li key={index} className={styles.stepItem}>
                  <Row>
                    <Col xs={1}>
                      <span className={styles.stepNumber}>{index + 1}</span>
                    </Col>
                    <Col xs={11}>
                        <div className={styles.stepBlock}>
                          <p>step.description</p>
                        </div>
                          {step.image && <Image src={step.image} alt={`Step ${index + 1}`} fluid className={styles.stepImage} />}
                    </Col>
                  </Row>
                </li>
              ))}
            </ol>





            {/* 확인용 */}
            <Row>
                    <Col xs={1}>
            <span className={styles.stepNumber}>1</span>
            </Col>
            <Col xs={11}>

            <div className={styles.stepBlock}>
              <p className={styles.stepList}>조리 1단계</p>
            </div>

            </Col>
                  </Row>







          </div>
        </Col>
      </Row>

      {recipe.tips && (
        <Row>
          <Col>
            <div className={styles.contentSection}>
              <h2 className={styles.sectionTitle}>조리팁!</h2>
              <div className={styles.tipBlock}>
                <p>{recipe.tips}</p>
              </div>
            </div>
          </Col>
        </Row>
      )}

      {recipe.recipe_category && (
        <Row>
          <Col>
            <div className={styles.contentSection}>
              <h2 className={styles.sectionTitle}>#태그</h2>
              <p>{recipe.recipe_category.map(cat => cat.category_name).join(', ')}</p>
            </div>
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <div className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>평점 등록</h2>
            {/* 평점 등록 컴포넌트를 여기에 추가 */}
          </div>
        </Col>
      </Row>
    </Container>
    );
  }
}

export default RecipeDetailPage;