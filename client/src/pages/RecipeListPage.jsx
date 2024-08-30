// [ ] 레시피 카드 레시피이름 외 난이도, 소요시간 추가
// [ ] loadingStyle 등 css 분리

import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card} from 'react-bootstrap';


function RecipeListPage({ recipes, currentCategory }) {


  console.log("RecipeListPage - currentCategory:", currentCategory);  // 디버깅용 로그
  

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
    <div>
      <Container className="text-start">
        
        <Row lg={5} className="g-4">
          {recipes && 
            recipes.map((recipe) => (
          <Col key={recipe.recipe_id}>  
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
                {/* <Button variant="dark">보러가기</Button> */}
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

