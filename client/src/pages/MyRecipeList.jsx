/** MyRecipeList.jsx
 * 셰프회원의 작성 레시피 목록 관리 페이지
 * MyRecipeCard.jsx의 카드 리스트에 user가 작성한 레시피 데이터를 호출해 보여줍니다.
 * 
 */

import React, { useState, useEffect } from "react";
import { useSearchParams  } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import MyRecipeCard from "../components/MyRecipeCard";
import RecipeListPage from './RecipeListPage';
// import FilterBox from "../components/FilterBox";
import Loading from "../components/UI/Loading"

const MyRecipeList = ({ user }) => {    // { recipes }
  if (!user) {
    console.log(user)
    return <div>사용자 정보를 불러오는 중입니다...</div>;
  }
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = import.meta.env.VITE_HOST_IP;

  const sampleRecipes = [
  {
    recipe_id: 1,
    recipe_name: "김치 볶음밥",
    recipe_desc: "맛있고 간단한 김치 볶음밥",
    recipe_img: "",
    category: "한식",
    cooked_time: 20,
    level: "쉬움"
  },
  {
    recipe_id: 2,
    recipe_name: "스파게티 카르보나라",
    recipe_desc: "크리미한 이탈리안 파스타",
    recipe_img: "",
    category: "양식",
    cooked_time: 30,
    level: "보통"
  },
  {
    recipe_id: 3,
    recipe_name: "닭가슴살 샐러드",
    recipe_desc: "건강하고 맛있는 샐러드",
    recipe_img: "",
    category: "샐러드",
    cooked_time: 15,
    level: "쉬움"
  }
]

  const getMyRecipes = async () => {
    try {
      const response = await fetch(`${API_URL}/api/myRecipe`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        
      });

      if (!response.ok) throw new Error((await response.json()).error); 
      const result = await response.json();
      setRecipes(result);
    } catch (e) {
      console.error("실패:", e);
    } finally {
      setIsLoading(false)
    }
  }

  // 컴포넌트가 마운트될 때 fetch 함수 호출
  useEffect(() => {   
    getMyRecipes();
  }, []);

  return (
    <Container style={{ textAlign: 'center' }}>
      {isLoading && recipes.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <h2 style={{ margin: '30px 0' }}>나만의 레시피 관리</h2>
          <RecipeListPage recipes = {sampleRecipes}/>
        </>
      )}
    </Container>
  );
};

export default MyRecipeList;

