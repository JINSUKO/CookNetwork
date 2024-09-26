/* RecipeDetailPage.jsx
-레시피 상세페이지 컴포넌트입니다.
*/

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import BookmarkButton from '../components/Bookmark/BookmarkButton';
import styles from '../assets/styles/RecipeDetail.module.css';
import { FaUtensils, FaClock, FaRegChartBar, FaStarHalf  } from 'react-icons/fa';
import Loading from '../components/UI/Loading';
import StarRating from '../components/StarRating';

function RecipeDetailPage({ initialIsBookmarked, handleBookmark }) {
  const { recipe_id } = useParams();
  // const location = useLocation();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);   // recipes 데이터 빈 배열로 설정
  // const [ingredients, setIngredients] = useState([]);
  // const [orders, setOrders] = useState([]);
  // const [categories, setCategories] = useState([]);
  // const [userRating, setUserRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_HOST_IP;
  // const filterOptions = [
  //   "메인요리", "반찬", "국/탕", "디저트", "면",
  //   "밥/죽/떡", "퓨전", "양념/소스", "채식", "분식", "안주",
  //   "스프", "간식", "음료", "다이어트", "도시락"
  // ];

  // 레시피 기본정보 데이터 가져오기 함수
  const fetchRecipeDetails = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/recipe/${recipe_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
          // 'Authorization': `Bearer ${localStorage.getItem('token')}` 
        }
      });
      if(!response.ok) {
        throw new Error((await response.json()).error);
      }

      const result = await response.json();
      console.log("레시피:", result)
      if (result) {
        setRecipe(result);
      }
    } catch (error) {
      console.error("레시피 호출 실패:", error);
    }
  }, [recipe_id, API_URL]);

  // 레시피 재료 데이터 가져오기 함수 - X
  const fetchRecipeIngredients = useCallback(async () => {
    try{
      const response = await fetch(`${API_URL}/api/recipe/${recipe_id}/ingredients`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
  }, [recipe_id, API_URL]);
  
  // 레시피 조리순서 데이터 가져오기 함수 - X
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
  }, [recipe_id, API_URL]);

  // 레시피 필터 데이터 가져오기 함수
  // const fetchRecipeCategories = useCallback(async () => {
  //   try {
  //     const response = await fetch(`${API_URL}/api/recipe/${recipe_id}/filters`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     });
  //     if(!response.ok) {
  //       throw new Error((await response.json()).error);
  //     }

  //     const result = await response.json();
  //     console.log("조리순서 데이터 호출 성공:", result);
  //     if (result) {
  //       setFilters(result);
  //     }
  //   } catch (error) {
  //     console.error("조리순서 호출 실패:", error);
  //   }
  // }, [recipe_id, API_URL]);


  // 레시피 평점 데이터 가져오기 함수 -X
  const fetchUserRating = useCallback(async () => {  
    try {
      const response = await fetch(`${API_URL}/api/recipe/${recipe_id}/rating`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('token')}` // 사용자 인증 토큰
        }
      });
      if (!response.ok) {
        throw new Error((await response.json()).error);
      }

      const result = await response.json();
      setUserRating(result.rating);
    } catch (error) {
      console.error("사용자 평점 호출 실패:", error);
    }
  }, [recipe_id, API_URL]);

  // [ ] 유저 평점 등록 함수
  const handleRatingChange = async (newRating) => {
    try {
      const response = await fetch(`${API_URL}/api/recipe/${recipe_id}/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // 사용자 인증 토큰
        },
        body: JSON.stringify({ rating: newRating })
      });
      if (!response.ok) {
        throw new Error((await response.json()).error);
      }
      // 평점 등록 후 레시피 정보를 다시 불러옴
      await fetchRecipeDetails();
    } catch (error) {
      console.error("평점 등록 실패:", error);
    }
  };




  // 컴포넌트가 마운트될 때 fetch 함수 호출
  useEffect(() => {
    const loadRecipeData = async () => {
      setIsLoading(true);
      await fetchRecipeDetails();
      setIsLoading(false);
    };

    loadRecipeData();
  }, [fetchRecipeDetails]);
  
  if (isLoading) {
    return <div><Loading /></div>;
  }
  if (!recipe) {
    return <div className="justify-content-center">
      레시피를 찾을 수 없습니다.</div>;
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
            {/* <BookmarkButton recipeId={recipe.id} initialIsBookmarked={recipe.isBookmarked} /> */}
            
            <Row className={styles.recipeStats}>
              <Col xs={3}>
                <FaUtensils className={styles.icon} size={20} color="#666" />
                 {recipe.serving}인분</Col>
              <Col xs={3}>
                <FaClock className={styles.icon} size={20} color="#666" />
                 {recipe.cooked_time}분</Col>
              <Col xs={3}>
                <FaRegChartBar className={styles.icon} size={20} color="#666" />
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
                  <span className={styles.ingredientName}>{ingredient.ingredient_name}</span>
                  <span className={styles.ingredientAmount}>{ingredient.count} {ingredient.ingredient_unit}</span>
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
              {recipe.orders && recipe.orders.map((step, index) => (
                <li key={index} className={styles.stepItem}>
                  <div className={styles.stepContainer}>
                    <div className={styles.stepNumberWrapper}>
                      <span className={styles.stepNumber}>{index + 1}</span>
                    </div>
                    <div className={styles.stepContent}>
                      <div className={styles.stepBlock}>
                        <p>{step.order_desc}</p>
                      </div>
                      {step.order_img && <Image src={step.order_img} alt={`Step ${index + 1}`} fluid className={styles.stepImage} />}
                    </div>
                  </div>
                  {/* <Row>
                    <Col>
                      {step.order_img && <Image src={step.order_img} alt={`Step ${index + 1}`} fluid className={styles.stepImage} />}
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={1}>
                      <span className={styles.stepNumber}>{index + 1}</span>
                    </Col>
                    <Col xs={11}>
                        <div className={styles.stepBlock}>
                          <p>{step.order_desc}</p>
                        </div>
                    </Col>
                  </Row> */}
                </li>
              ))}
            </ol>

          </div>
        </Col>
      </Row>

      {/* {recipe.tips && (
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
      )} */}

      {recipe.categories && (
        <Row>
          <Col>
            <div className={styles.contentSection}>
              <h2 className={styles.sectionTitle}>태그</h2>
              <p>{recipe.categories.map(cat => cat.category_name).join(', ')}</p>
            </div>
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <div className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>내 평점 등록</h2>
            <StarRating
              initialRating={recipe.userRating}
              onRatingChange={handleRatingChange}
              recipeId={recipe_id}
            />
          </div>
        </Col>
      </Row>
    </Container>
    );
  }
}

export default RecipeDetailPage;