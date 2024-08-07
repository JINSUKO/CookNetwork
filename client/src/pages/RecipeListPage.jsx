import React from "react";
import FetchRecipeList from "../components/FetchRecipeList";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Card} from 'react-bootstrap';


function RecipeListPage() {
  const [category, currentCategory] = useState([]);
  // const currentCategory = category || 'main';)

  return (
    <Container className="text-start">
      <h5>{currentCategory === 'main' ? '모든 레시피' : `${currentCategory} 카테고리`} <br/> 다양한 레시피를 확인해보세요!</h5>
      <Row lg={5} className="g-4">
        {recipes.map((recipe) => (
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