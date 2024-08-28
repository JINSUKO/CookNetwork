/* FetchRecipeList.jsx
-Fetch 함수를 사용해 레시피 데이터 호출하는 컴포넌트입니다.
-동적 라우팅을 위해 useParams, useCallback 사용
-카테고리 내 필터 댜중 선택 
*/

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import RecipeListPage from "../pages/RecipeListPage";
import FilterBox from "./FilterBox";

function FetchRecipeList() { 
  const { category } = useParams();
  const currentCategory = category === '전체' || !category ? 'main' : category ;   // '전체' 카테고리를 'main'으로 매칭
  const [recipes, setRecipes] = useState([]);   // recipes 데이터 빈 배열로 설정
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const API_URL = import.meta.env.VITE_HOST_IP;

  const filterOptions = [
    "모두보기", "메인요리", "반찬", "국/탕", "디저트", "면", 
    "밥/죽/떡", "퓨전", "양념/소스", "채식", "분식", "안주", 
    "스프", "간식", "음료", "다이어트", "도시락"
  ];

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
        setRecipes(result || []);
        setFilteredRecipes(result || []);
      }
    } catch (e) {
      console.error("실패:", e);
    }
  }, [currentCategory]);   // 카테고리 값이 변경될 때 함수 재생성
  
  useEffect(() => {   // 컴포넌트가 마운트될 때 fetch 함수 호출
    fetchRecipes();
  }, [currentCategory]);   // currentCategory가 바뀔때마다 다시 실행

  // 카테고리 내 필터 함수
  const filterRecipes = () => {
    if (selectedFilters.length === 0 || selectedFilters.includes("모두보기")) {
      setFilteredRecipes(recipes);
    } else {
      const filtered = recipes.filter(recipe => 
        selectedFilters.includes(recipe.subCategory)
      );
      setFilteredRecipes(filtered);
    }
  };

  const handleFilterChange = (filters) => {
    setSelectedFilters(filters);
  };
  
  useEffect(() => {   // 필터 선택되면 fetchRecipe 함수 호출
    filterRecipes();
  }, [selectedFilters, recipes]);

  

  return (
    <Container>
      <FilterBox 
        filterOptions={filterOptions}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}/>
      <RecipeListPage 
        recipes={filteredRecipes} 
        currentCategory={currentCategory}/>
    </Container>
  )
}

export default FetchRecipeList;