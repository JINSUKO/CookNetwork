/** RecipeList.jsx
 * 메인, 카테고리에서 나열되는 레시피 리스트 페이지입니다.
 * [ ] 북마크
 * [ ] 레시피 카드 레시피 이름 외 난이도, 소요시간 추가
 * [ ] 레시피카드UI 컴포넌트 분리
 * [ ] 검색결과 리스트 카드 통일
*/ 

import React, { useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card } from 'react-bootstrap';
import BookmarkButton from "../components/Bookmark/BookmarkButton";


function RecipeListPage({ recipes, currentCategory, hasMore, loadMore, isLoading  }) {
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
  

  // const loadingStyle = {
  //   backgroundColor: '#ffffff',
  //   padding: '4rem 0 2rem 0',
  //   display: 'flex',
  //   flexDirection: 'column',
  //   justifyContent: 'center',
  //   alignItems: 'center'
  // };

  // if (!recipes || recipes.length === 0) {
  //   return (
  //     <Container style={loadingStyle}>
  //       <Spinner animation="border" role="status">
  //       <span className="visually-hidden">Loading...</span>
  //       </Spinner>
  //     </Container>
  //   );
  // }

  return (
    <div>
      <Container className="text-start">
        
        <Row xs={2} md={3} lg={4} className="g-4">
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
                <Card.Title  style={{ textAlign: 'start', fontSize: '16px', fontWeight: 'bold' }}>
                  {recipe.recipe_name}
                </Card.Title>
                <Card.Title  style={{ textAlign: 'start', fontSize: '14px' }}>
                  {recipe.recipe_desc}
                </Card.Title>
                <BookmarkButton />
              </Card.Body>
            </Card>
          </Link>
        </Col>
        ))}
        </Row>
      </Container>
    </div>
  )
}

export default RecipeListPage;
