/** RecipeList.jsx
 * 메인, 카테고리에서 나열되는 레시피 리스트 페이지입니다.
 * [ ] 북마크
*/ 

import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card } from 'react-bootstrap';
import BookmarkButton from "../components/Bookmark/BookmarkButton";
import styles from '../assets/styles/RecipeCard.module.css';
import Skeleton from '../components/UI/Skeleton';
import { FaClock, FaRegChartBar, FaUser } from 'react-icons/fa';

function RecipeListPage({ recipes, currentCategory, isLoading }) {
  
  // useEffect(() => {
  //   console.log('RecipeListPage - Recipes:', recipes.length, 'HasMore:', hasMore, 'IsLoading:', isLoading);
  // }, [recipes, hasMore, isLoading]);

  const handleCardclick = (e, recipe_id) => {
    // 북마크 버튼 클릭 시 카드가 클릭되어 상세페이지로 이동되는 것을 방지
    if (e.target.closest(`.${styles.bookmarkWrapper}`)){
      e.preventDefault();
      e.stopPropagation();
    } 
  };

  if (isLoading && (!recipes || recipes.length === 0)) {
    return <Skeleton />
  }

  return (
    <div>
      <Container className="py-5" style={{margin: '0 auto'}}>
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">

              {recipes && recipes.map((recipe, index) => (
              <Col key={recipe.recipe_id} className={styles.recipeCardWrapper}>  
                <Link to={`/recipe/${recipe.recipe_id}`} style={{ textDecoration: 'none' }}>
                  <Card 
                    className={styles.recipeCard}
                    onClick={(e) => handleCardclick(e, recipe.recipe_id)}
                    >
                  <div className={styles.imageWrapper}>
                    {recipe.recipe_img ? (
                    <Card.Img variant="top" src={recipe.recipe_img}  className={styles.recipeImage}/>
                    ) : (
                      <div style={{height: '200px' }}></div>
                    )}
                        <div className={styles.bookmarkWrapper}>
                            {/* <BookmarkButton recipe_id={recipe.recipe_id} /> */}
                        </div>
                  </div>
                  <Card.Body>
                    <Card.Title className={styles.recipeTitle}>
                      {recipe.recipe_name}
                    </Card.Title>
                    <Card.Title  className={styles.recipeDesc}>
                      {recipe.recipe_desc}
                    </Card.Title>
                    <div className={styles. recipeInfo}>
                      <span>
                        <FaRegChartBar className={styles.icon} />
                        Lv.{recipe.level}
                      </span>
                      <span>
                        <FaClock className={styles.icon} />
                        {recipe.cooked_time}분
                      </span>
                      <span>
                        <FaUser className={styles.icon}/>
                        {recipe.username}
                      </span>
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
            ))}
            
            </Row>
            
        {isLoading && recipes.length > 0 && <Skeleton />}

      </Container>
    </div>
  )
}

export default RecipeListPage;
