/* RecipeCarousel.jsx
메인페이지에서 사용될 레시피 캐러셀 컴포넌트. 부트스트랩 Card 활용

<데이터바인딩>
Data.jsx 파일에서 Data라는 변수로 받아온 상품 데이터를 recipes라는 state에 저장합니다.
RecipeList가 각 카테고리에서 숫자 제한없이 레시피 카드를 나열하는 컴포넌트라면,
RecipeCarousel은 메인 페이지에서 종류별 라벨 아래 한줄로 Carousel이 나열되는 컴포넌트가 될 예정입니다.

레시피이름: <Card.title>{props.recipes.title}</Card.title>
조회수: <Card.title>{props.recipes.views}</Card.title>
북마크수: <Card.title>{props.recipes.bookmark}</Card.title>

[ ] 이미지 데이터바인딩 - 이미지 파일 이름을 recipe1.jpg, recipe2.jpg 이런식으로 각 인덱스를 이용하여 숫자를 매김. 백틱 기호를 사용하여 props.recipes.id+1 로 작성하여 해당 인덱스 +1한 숫자가 recipe 글자 뒤에 오도록 하여 시도해보기
[ ] 캐러셀 기능 추후 구현 

참고: https://seoyun-is-connecting-the-dots.tistory.com/330
*/

import Data from './Data.jsx';
import React, { useState } from "react";
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';



function RecipeCarousel(props) {
  const [recipes, setRecipes] = useState(Data);

  return (
    <Container className="text-start">
      <h3>다양한 레시피를 확인해보세요</h3>
      <Row lg={5} className="g-4">
        {
          recipes.map((recipe, index) => (

        <Col key={recipe.id}>  
          <Link to={`/recipe/${recipe.id}`} style={{ textDecoration: 'none' }}>
            <Card style={{ cursor: 'pointer' }}>
            <Card.Img variant="top" src="https://recipe1.ezmember.co.kr/cache/recipe/2016/08/12/f434121cb72feba6e3509b7d38177ec01_m.jpg" />
            <Card.Body>
              <Card.Title>레시피 이름</Card.Title>
              <Button variant="dark">보러가기</Button>
            </Card.Body>
          </Card>
        </Link>
      </Col>
      ))}
      </Row>
    </Container>
  )
};

export default RecipeCarousel;
  