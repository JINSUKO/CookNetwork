/** GetRecipeList.jsx
 * FetchRecipeList.jsx에 RTK Query를 적용하여 수정
 * fetchRecipes 함수 대신 RTK Query의 useGetRecipeListQuery 훅을 사용
 * recipes 상태를 제거하고 useGetRecipeListQuery에서 반환된 data를 직접 사용
 */


import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import RecipeListPage from "../pages/RecipeListPage";
import FilterBox from "./FilterBox";
import { useGetRecipeListQuery } from '../services/useGetRecipeListQuery';

function GetRecipeList() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = category === '전체' || !category ? 'main' : category;
  const [selectedFilters, setSelectedFilters] = useState(() => {
    const filters = searchParams.get('filters');
    return filters ? filters.split(',') : [];
  });

  // RTK Query hook 사용
  const { data: recipes, error, isLoading } = useGetRecipeListQuery(currentCategory);

  const [filteredRecipes, setFilteredRecipes] = useState([]);

  const filterOptions = [
    "모두보기", "메인요리", "반찬", "국/탕", "디저트", "면", 
    "밥/죽/떡", "퓨전", "양념/소스", "채식", "분식", "안주", 
    "스프", "간식", "음료", "다이어트", "도시락"
  ];

  useEffect(() => {
    if (recipes) {
      setFilteredRecipes(recipes);
    }
  }, [recipes]);

  useEffect(() => {
    setSelectedFilters([]);
  }, [currentCategory]);

  const handleFilterChange = (filters) => {
    setSelectedFilters(filters);
    const newSearchParams = new URLSearchParams(searchParams);
    if (filters.length > 0 && !filters.includes("모두보기")) {
      newSearchParams.set('filters', filters.join(','));
    } else {
      newSearchParams.delete('filters');
    }
    setSearchParams(newSearchParams);
    navigate(`/category/${currentCategory}?${newSearchParams.toString()}`);

    // 필터링 로직
    if (recipes) {
      const filtered = filters.includes("모두보기") || filters.length === 0
        ? recipes
        : recipes.filter(recipe => filters.includes(recipe.category));
      setFilteredRecipes(filtered);
    }
  };

  const displayCategory = () => {
    if (currentCategory === 'main' || currentCategory === '전체' || !currentCategory) {
      return '모든 레시피';
    }
    return `${currentCategory} 카테고리`;
  };

  if (isLoading) {
    return <Container><h5>레시피를 불러오는 중입니다...</h5></Container>;
  }

  if (error) {
    return <Container><h5>에러가 발생했습니다: {error.message}</h5></Container>;
  }

  return (
    <Container>
      <h5>{displayCategory()}<br/> 다양한 레시피를 확인해보세요!</h5>
      {/* <FilterBox 
        filterOptions={filterOptions}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
      /> */}
      <RecipeListPage 
        recipes={filteredRecipes} 
        currentCategory={currentCategory}
      />
    </Container>
  );
}

export default GetRecipeList;