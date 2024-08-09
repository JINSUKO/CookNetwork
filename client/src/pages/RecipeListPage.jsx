import React from "react";
import { Link, useParams } from "react-router-dom";
import { Container, Row, Col, Button, Card} from 'react-bootstrap';


function RecipeListPage({ recipes, currentCategory }) {
  console.log(recipes)

  const loadingStyle = {
    backgroundColor: '#ffffff',
    padding: '4rem 0 2rem 0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  };

  if (!recipes || recipes.length === 0) {
    return (
      <Container style={loadingStyle}>
        <h5>레시피를 불러오는 중입니다...</h5>
      </Container>
    );
  }

  return (
    <Container className="text-start">
      <h5>{currentCategory === 'main' ? '모든 레시피' : `${currentCategory} 카테고리`} <br/> 다양한 레시피를 확인해보세요!</h5>
      <Row lg={5} className="g-4">
        {recipes && 
          recipes.map((recipe) => (
        <Col key={recipe.recipe_id}>  
          <Link to={`/recipe/${recipe.recipe_id}`} style={{ textDecoration: 'none' }}>
            <Card style={{ cursor: 'pointer' }}>
              {recipe.recipe_img ? (
            <Card.Img variant="top" src={recipe.recipe_img} />
              ) : (
                <div style={{height: '200px' }}></div>
              )}
            <Card.Body>
              <Card.Title>
                {recipe.recipe_name}
              </Card.Title>
              <Button variant="dark">보러가기</Button>
            </Card.Body>
          </Card>
        </Link>
      </Col>
      ))}
      </Row>
    </Container>
  )
}

export default RecipeListPage;

