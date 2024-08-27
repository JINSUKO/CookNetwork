// [ ] 레시피 카드 레시피이름 외 난이도, 소요시간 추가
// [ ] loadingStyle 등 css 분리

import React from "react";
import { Link, useParams } from "react-router-dom";
import FilterBox from "../components/FilterBox";
import { Container, Row, Col, Card} from 'react-bootstrap';


function RecipeListPage({ recipes, currentCategory }) {

  // const recipes = [
  //   { recipe_id: 1, recipe_name: "김치찌개", recipe_img: "https://recipe1.ezmember.co.kr/cache/recipe/2015/10/06/298e976b277b6d58b92c476d4d2dae7d1_m.jpg", category: "korean" },
  //   { recipe_id: 2, recipe_name: "된장찌개", recipe_img: "https://recipe1.ezmember.co.kr/cache/recipe/2017/03/16/67129b3efb169110d80744b30d219b141_m.jpg", category: "korean" },
  //   { recipe_id: 3, recipe_name: "비빔밥", recipe_img: "https://recipe1.ezmember.co.kr/cache/recipe/2015/12/08/0d2249438aac593752292c6380dbb5c41_m.jpg", category: "korean" },
  //   { recipe_id: 4, recipe_name: "불고기", recipe_img: "https://recipe1.ezmember.co.kr/cache/recipe/2017/03/31/afb63a7af63fe1971cf92d7ccd7776ab1_m.jpg", category: "korean" },
  //   { recipe_id: 5, recipe_name: "잡채", recipe_img: "https://recipe1.ezmember.co.kr/cache/recipe/2019/02/03/b967403fe8c42c5814ea0042207a2c931_m.jpg", category: "korean" },
  //   { recipe_id: 6, recipe_name: "김치볶음밥", recipe_img: "https://recipe1.ezmember.co.kr/cache/recipe/2018/12/29/c66e0346fb6fb086abbb6e1caa29d4cb1_m.jpg", category: "korean" },
  //   { recipe_id: 7, recipe_name: "파전", recipe_img: "https://recipe1.ezmember.co.kr/cache/recipe/2017/11/04/66fdacb7533c367a4171c2ffb7de9fba1_m.jpg", category: "korean" },
  //   { recipe_id: 8, recipe_name: "떡볶이", recipe_img: "https://recipe1.ezmember.co.kr/cache/recipe/2017/09/09/ac104c6e8ac4744a602cd35cd6fe1f5e1_m.jpg", category: "korean" },
  //   { recipe_id: 9, recipe_name: "삼겹살", recipe_img: "https://recipe1.ezmember.co.kr/cache/recipe/2015/08/17/5d7a3652d81fb3c5ff7d387499bfd4bf1_m.jpg", category: "korean" },
  //   { recipe_id: 10, recipe_name: "냉면", recipe_img: "https://recipe1.ezmember.co.kr/cache/recipe/2019/07/10/d743fcb7c103610c9fa11f42e0959d371_m.jpg", category: "korean" },
  //   { recipe_id: 11, recipe_name: "김밥", recipe_img: "https://recipe1.ezmember.co.kr/cache/recipe/2016/02/21/f34c2f0fcd67513941d683d90050f3c01_m.jpg", category: "korean" },
  //   { recipe_id: 12, recipe_name: "감자탕", recipe_img: "https://recipe1.ezmember.co.kr/cache/recipe/2017/08/02/85d454a30f1eed0592d7684d9bd4e1c91_m.jpg", category: "korean" },
  //   { recipe_id: 13, recipe_name: "계란말이", recipe_img: "https://recipe1.ezmember.co.kr/cache/recipe/2015/11/12/006d3080be97cb3328a20931e7eafddc1_m.jpg", category: "korean" },
  //   { recipe_id: 14, recipe_name: "닭갈비", recipe_img: "https://recipe1.ezmember.co.kr/cache/recipe/2015/09/03/df854c6c4d5cdede3d1905b78908e7901_m.jpg", category: "korean" },
  //   { recipe_id: 15, recipe_name: "오이무침", recipe_img: "https://recipe1.ezmember.co.kr/cache/recipe/2017/05/24/9fe380db166eeeaa796997ba21595a981_m.jpg", category: "korean" }
  // ];

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

  // 리스트 상단 소개에 카테고리 표시
    const displayCategory = () => {
    if (currentCategory === 'main' || currentCategory === '전체' || !currentCategory) {
      return '모든 레시피';
    }
    return `${currentCategory} 카테고리`;
  };
  
  return (
    <div>
      <FilterBox />
      <Container className="text-start">
        <h5>
        {displayCategory()}<br/> 다양한 레시피를 확인해보세요!</h5>
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

