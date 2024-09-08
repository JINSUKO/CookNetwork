/* FetchRecipeList.jsx
-Fetch 함수를 사용해 레시피 데이터 호출하는 컴포넌트입니다.
-동적 라우팅을 위해 useParams, useCallback 사용
-카테고리 내 필터 댜중 선택 
*/

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, useNavigate  } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import RecipeListPage from "../pages/RecipeListPage";
import FilterBox from "./FilterBox";
import Loading from "./Loading";

function FetchRecipeList() { 
  const { category } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = category === '전체' || !category ? 'main' : category ;   // '전체' 카테고리를 'main'으로 매칭
  const [recipes, setRecipes] = useState([]);   // recipes 데이터 빈 배열로 설정
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState(() => {
    const filters = searchParams.get('filters');
    return filters ? filters.split(',') : [];
  });
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_HOST_IP;

  const filterOptions = [
    "모두보기", "메인요리", "반찬", "국/탕", "디저트", "면", 
    "밥/죽/떡", "퓨전", "양념/소스", "채식", "분식", "안주", 
    "스프", "간식", "음료", "다이어트", "도시락"
  ];
  console.log("category:", category);
  console.log("path:", location.pathname);
  console.log("filter:", selectedFilters)

  const fetchRecipes = useCallback(async () => {
    try {
      // 삼항연산자를 사용하여 API 엔드포인트 요청 url 결정
      let url = currentCategory === 'main'
        ? `${API_URL}/api/category/main`   // 전체 레시피 리스트를 가져오는 main 카테고리
        : `${API_URL}/api/category/${currentCategory}`;   // 특정 카테고리
      const params = new URLSearchParams(searchParams);     

        if (selectedFilters.length > 0 && !selectedFilters.includes("모두보기")) {
          params.set('filters', selectedFilters.join(','));
        } else {
          params.delete('filters');
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }

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

      if (result) {
        console.log(`${currentCategory} 레시피 목록 호출 성공`);
        setRecipes(result || []);
        setFilteredRecipes(result || []);
      }
    } catch (e) {
      console.error("실패:", e);
    } finally {
      setIsLoading(false);
    }
  }, [currentCategory, selectedFilters, searchParams]);   // 카테고리 값이 변경될 때 함수 재생성
  
  useEffect(() => {   // 컴포넌트가 마운트될 때 fetch 함수 호출
    fetchRecipes();
  }, [fetchRecipes,currentCategory]);   // currentCategory가 바뀔때마다 다시 실행

  useEffect(() => {
    setSelectedFilters([]);
  }, [currentCategory])   // currentCategory가 바뀔때마다 필터 새로고침

  const handleFilterChange = (filters) => {
    setSelectedFilters(filters);
    const newSearchParams = new URLSearchParams(searchParams);
    if (filters.length > 0 && !filters.includes("모두보기")) {
      newSearchParams.set('filters', filters.join(','));
    } else if (selectedFilters.length === 0 || selectedFilters.includes("모두보기")) {
      newSearchParams.delete('filters');
      setFilteredRecipes(recipes);
    } else {
      newSearchParams.delete('filters');
    }
    setSearchParams(newSearchParams);
    navigate(`/category/${currentCategory}?${newSearchParams.toString()}`);
  };
  
  // 리스트 상단 소개에 카테고리 표시
  const displayCategory = () => {
    if (currentCategory === 'main' || currentCategory === '전체' || !currentCategory) {
      return '모든 레시피';
    }
    return `${currentCategory} 카테고리`;
  };
  

  return (
    <Container>
      {isLoading ? (
        <Loading />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <h5 style={{ 
            marginTop: '2rem', 
            marginBottom: '1rem', 
            textAlign: 'center',
            fontSize: '1.5rem',
            // fontWeight: 'bold'
          }}>{displayCategory()}
          <br/> 
            <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>
              다양한 레시피를 확인해보세요!
            </span>
          </h5>
          <div style={{ marginBottom: '2rem' }}>
          <FilterBox 
            filterOptions={filterOptions}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}/>
          </div>
          <RecipeListPage 
            recipes={filteredRecipes} 
            currentCategory={currentCategory}/>
        </div>
      )}
    </Container>
  )
}

export default FetchRecipeList;