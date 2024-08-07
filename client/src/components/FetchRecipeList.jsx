/* RecipeList.jsx
-레시피 데이터들을 단순 나열하는 레시피 리스트 컴포넌트입니다.
-동적 라우팅을 위해 useParams, useCallback 사용
*/

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Card} from 'react-bootstrap';
import RecipeListPage from "../pages/RecipeListPage";

function FetchRecipeList() { 
  const { category } = useParams();
  console.log(category)
  const currentCategory = category || 'main';   // category 없으면 main으로
  const [recipes, setRecipes] = useState([]);   // recipes 데이터 빈 배열로 설정
  const API_URL = import.meta.env.VITE_HOST_IP;

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
      console.log(result)
      if (result) {
        console.log(`${currentCategory} 레시피 목록 호출 성공`);
        setRecipes(result);}
    } catch (e) {
      console.error('Error:', e);
    }
  }, [currentCategory]);   // 카테고리 값이 변경될 때 함수 재생성
  
  useEffect(() => {   // 컴포넌트가 마운트될 때 fetch 함수 호출
    fetchRecipes();
  }, [category]);   // 카테고리가 바뀔때마다 다시 실행


  return (
    <Container className="text-start">
      <RecipeListPage />
    </Container>
  )
}

export default FetchRecipeList;