/* FetchRecipeList.jsx
-Fetch 함수를 사용해 레시피 데이터 호출하는 컴포넌트입니다.
-동적 라우팅을 위해 useParams, useCallback 사용
*/

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import RecipeListPage from "../pages/RecipeListPage";

function FetchRecipeList() { 
  const { category } = useParams();

  const currentCategory = category === '전체' || !category ? 'main' : category ;   // '전체' 카테고리를 'main'으로 매칭
  const [recipes, setRecipes] = useState([]);   // recipes 데이터 빈 배열로 설정
  const API_URL = import.meta.env.VITE_HOST_IP;

  console.log("category:", category);
  console.log("path:", location.pathname);

  const fetchRecipes = useCallback(async () => {
    try {
      // 삼항연산자를 사용하여 API 엔드포인트 요청 url 결정
      const url = currentCategory === 'main'
        ? `${API_URL}/api/category/main`   // 전체 레시피 리스트를 가져오는 main 카테고리
        : `${API_URL}/api/category/${currentCategory}`;   // 특정 카테고리

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if(!response.ok) {
        throw new Error((await response.json()).error);
      }

      // 레시피 데이터 result를 받아 recipes에 저장
      const result = await response.json();
      console.log("성공:", result)
      console.log("성공:", result.recipes)
      if (result) {
        console.log(`${currentCategory} 레시피 목록 호출 성공`);
        setRecipes(result || []);}
    } catch (e) {
      console.error("실패:", e);
    }
  }, [currentCategory]);   // 카테고리 값이 변경될 때 함수 재생성
  
  useEffect(() => {   // 컴포넌트가 마운트될 때 fetch 함수 호출
    fetchRecipes();
  }, [currentCategory]);   // currentCategory가 바뀔때마다 다시 실행


  return (
    <Container>
      <RecipeListPage recipes={recipes} currentCategory={currentCategory}/>
    </Container>
  )
}

export default FetchRecipeList;