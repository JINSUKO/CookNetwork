/** RecipeList.jsx
[ ] RecipeListPage.jsx로 대체하기
*/ 

import React, { useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card } from 'react-bootstrap';


function MyRecipeCard({ recipes, hasMore, loadMore, isLoading  }) {
  // const observer = useRef();
  // const lastRecipeElementRef = useCallback(node => {
  //   if (observer.current) observer.current.disconnect();
  //   console.log('observer current')
  //   observer.current = new IntersectionObserver(entries => {
  //     console.log('RecipeListPage')
  //     if (entries[0].isIntersecting && hasMore) {
  //       loadMore();
  //     }
  //   });
  //   if (node) observer.current.observe(node);
  // }, [hasMore, loadMore]);

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
      {/* <Container className="text-start">
        
        <Row xs={2} md={3} lg={4} className="g-4">
          {recipes && 
            recipes.map((recipe, index) => (
          // <Col key={recipe.recipe_id} ref={index === recipes.length - 1 ? lastRecipeElementRef : null}>  
          <Col key={recipe.recipe_id} >  
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
                <div style={{ display: 'flex', justifyContent: 'flex-start', fontSize: '12px', color: '#666' }}>
                  <span style={{ marginRight: '16px'}}>📌{recipe.level}</span>
                  <span>🕛{recipe.cooked_time}분</span>
                </div>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        ))}
        </Row>
      </Container> */}
    </div>
  )
}

export default MyRecipeCard;
