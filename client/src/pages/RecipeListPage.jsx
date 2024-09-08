/**RecipeList
 * [ ] 레시피 카드 레시피이름 외 난이도, 소요시간 추가
// [ ] loadingStyle 등 css 분리
// [ ]  
*/ 

import React, { useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card } from 'react-bootstrap';
import BookmarkButton from "../components/Bookmark/BookmarkButton";


function RecipeListPage({ recipes, currentCategory, hasMore, loadMore }) {
  const observer = useRef();
  const lastRecipeElementRef = useCallback(node => {
    if (observer.current) observer.current.disconnect();
    console.log('observer current')
    observer.current = new IntersectionObserver(entries => {
      console.log('RecipeListPage')
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [hasMore, loadMore]);

  console.log("RecipeListPage - currentCategory:", currentCategory);  // 디버깅용 로그

  return (
    <div>
      <Container className="text-start">
        
        <Row lg={5} className="g-4">
          {recipes && 
            recipes.map((recipe, index) => (
          // <Col key={recipe.recipe_id} ref={index === recipes.length - 1 ? lastRecipeElementRef : null}>  
          <Col ref={index === recipes.length - 1 ? lastRecipeElementRef : null}>  
            <Link to={`/recipe/${recipe.recipe_id}`} style={{ textDecoration: 'none' }}>
              <Card style={{ border: 'none', borderRadius:0, cursor: 'pointer' }}>
                {recipe.recipe_img ? (
              <Card.Img variant="top" src={recipe.recipe_img} style={{borderRadius:0}}/>
                ) : (
                  <div style={{height: '200px' }}></div>
                )}
              <Card.Body>
                <Card.Title  style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>
                  {recipe.recipe_name}
                </Card.Title>
                <Card.Title  style={{ textAlign: 'center', fontSize: '16px' }}>
                  {recipe.recipe_desc}
                </Card.Title>
                {/* <BookmarkButton /> */}
              </Card.Body>
            </Card>
          </Link>
        </Col>
        ))}
        </Row>

          {hasMore && (
            <div style={loadingStyle}>
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading more...</span>
              </Spinner>
            </div>
          )}


      </Container>
    </div>
  )
}

export default RecipeListPage;

