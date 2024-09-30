/** FetchRecipeList.jsx
-Fetch 함수를 사용해 레시피 데이터 호출하는 컴포넌트입니다.
- 함수 handleFilterChange: 카테고리 내 필터 선택
- 함수 getSortedList: 정렬 기능(최신순, 난이도순, 조리시간순, 이름순)
[ ] 로그인, 비로그인 북마크 여부 구분
*/  

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, useNavigate  } from 'react-router-dom';
import { Row, Col, Container } from 'react-bootstrap';
import RecipeListPage from "../pages/RecipeListPage";
import FilterBox from "./FilterBox";
import Skeleton from "./UI/Skeleton";
import styles from '../assets/styles/RecipeList.module.css';
import { useBookmarkContext } from "./Bookmark/BookmarkContext";
import SortMenu from "./SortMenu"; 

function FetchRecipeList() { 
  const { category } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = category === '전체' || !category ? 'main' : category ;   // '전체' 카테고리를 'main'으로 매칭
  const [recipes, setRecipes] = useState([]);   // recipes 데이터 빈 배열로 설정
  const API_URL = import.meta.env.VITE_HOST_IP;
  const [isLoading, setIsLoading] = useState(false);
  // 필터 기능
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState(() => {
    const filters = searchParams.get('filters');
    return filters ? filters.split(',') : ["X"];
  });
  // 북마크 기능
  const { isBookmarked } = useBookmarkContext(); 
  // 정렬 기능
  const [sortOption, setSortOption] = useState("최신순");
  const [sortedRecipes, setSortedRecipes] = useState([]);   // 정렬된 레시피 배열

  const filterOptions = [
    "메인요리", "반찬", "국/탕", "디저트", "면", 
    "밥/죽/떡", "퓨전", "양념/소스", "채식", "분식", "안주", 
    "스프", "간식", "음료", "다이어트", "도시락", "X"
  ];
  console.log("filter:", selectedFilters)

  const sortOptionList = [
    { value: "최신순", name: "최신순" },
    { value: "이름순", name: "이름순" },
    { value: "난이도순", name: "난이도순" },
    { value: "조리시간순", name: "조리시간순" },
  ];

  const fetchRecipes = useCallback(async () => {
    setIsLoading(true);

    try {
      // 삼항연산자를 사용하여 API 엔드포인트 요청 url 결정
      let url = currentCategory === 'main'
        ? `${API_URL}/api/category/main`   // 전체 레시피 리스트를 가져오는 main 카테고리
        : `${API_URL}/api/category/${currentCategory}`;   // 특정 카테고리
      const params = new URLSearchParams(searchParams);     

        if (selectedFilters.length > 0 && !selectedFilters.includes("X")) {
          params.set('filters', selectedFilters.join(','));
        } else {
          params.delete('filters');
        }

        url += `?${params.toString()}`;
        console.log("Fetching from URL:", url);  // Log the full URL

        const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("Response status:", response.status);  // Log the response status


      if(!response.ok) {
        throw new Error((await response.json()).error);
      }

      // 레시피 데이터 result를 받아 recipes에 저장
      const result = await response.json();
      console.log("API Response:", result)



      // 북마크 상태 확인
      // if (result) {
      //   const recipesWithBookmarkStatus = result.recipes.map(recipe => ({
      //     ...recipe,
      //     isBookmarked: isBookmarked(recipe.id)
      //   }));
      //   setRecipes(prevRecipes => [...prevRecipes, ...recipesWithBookmarkStatus]);
      //   setFilteredRecipes(prevRecipes => [...prevRecipes, ...recipesWithBookmarkStatus]);
      // }
      
      if (Array.isArray(result)) {
        // console.log(`${currentCategory} 레시피 목록 호출 성공`);
        // console.log("레시피 개수:", result.length);
        
        const recipesWithBookmarkStatus = result.map(recipe => ({   // 레시피마다 북마크 상태 추가
          ...recipe,
          isBookmarked: isBookmarked(recipe.id)
        }));

        setRecipes(recipesWithBookmarkStatus);    // 북마크 상태 추가한 레시피 저장
        setFilteredRecipes(recipesWithBookmarkStatus);    
        setSortedRecipes(recipesWithBookmarkStatus);

      } else {
        // console.error("Unexpected response structure:", result);
        throw new Error("Unexpected response structure");
      }
    } catch (e) {
      // console.error("API 호출 실패:", e.message);
    } finally {
      setIsLoading(false)
    }
  }, [currentCategory, selectedFilters, searchParams, API_URL, isBookmarked]);  // 카테고리 값이 변경될 때 함수 재생성
// }, [isBookmarked]);

  
  useEffect(() => {   // 컴포넌트가 마운트될 때 fetch 함수 호출
    // console.log("Fetching recipes...");
    fetchRecipes();
  }, [fetchRecipes]);   

  useEffect(() => {
    setSelectedFilters(['X']);
  }, [currentCategory])   // currentCategory가 바뀔때마다 필터 새로고침

  // 종류별 필터 선택
  const handleFilterChange = (filters) => {
    setSelectedFilters(filters);
    const newSearchParams = new URLSearchParams(searchParams);
    if (filters.length > 0 && !filters.includes("X")) {
      newSearchParams.set('filters', filters.join(','));
    } else if (selectedFilters.length === 0 || selectedFilters.includes("X")) {
      newSearchParams.delete('filters');
      setFilteredRecipes(recipes);
    } else {
      newSearchParams.delete('filters');
      // setFilteredRecipes(recipes); // 모든 레시피 표시

    }
    setSearchParams(newSearchParams);
    navigate(`/category/${currentCategory}?${newSearchParams.toString()}`);
  };
  
  // 정렬 기능
  // filteredRecipes나 sortOption이 변경될 때마다 정렬된 데이터를 업데이트
  const getSortedList = useCallback((data, option) => {
    const copyList = JSON.parse(JSON.stringify(data));    // 원본데이터를 변경하지 않고 복사본을 만들어 정렬
    switch (option) {
      case "난이도순":
        return copyList.sort((a, b) => a.level - b.level);
      case "조리시간순":
        return copyList.sort((a, b) => a.cooked_time - b.cooked_time);
      case "이름순":
        return copyList.sort((a, b) => a.recipe_name.localeCompare(b.recipe_name));
      case "최신순":
      default:
        return copyList.sort((a, b) => b.recipe_id - a.recipe_id);
    }
  }, []);

  useEffect(() => {
    const sortedData = getSortedList(filteredRecipes, sortOption);
    setSortedRecipes(sortedData);
  }, [filteredRecipes, sortOption, getSortedList]);

  const handleSortChange = (option) => {
    setSortOption(option);
  };





  // 리스트 상단 소개에 카테고리 표시
  const displayCategory = () => {
    if (currentCategory === 'main' || currentCategory === '전체' || !currentCategory) {
      return '모든 레시피';
    }
    return `${currentCategory} 카테고리`;
  };
  

  return (
    <Container className={styles.recipeListContainer}>
      {isLoading && filteredRecipes.length === 0 ? (
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8}>
            <Skeleton/>
          </Col>
        </Row>
      ) : (
      <>
        <Row  className="justify-content-center">
          <Col xs={12} md={10} lg={8}>

          <h6 className={styles.recipeListTitle}>
            |  {displayCategory()}  |
          </h6>

          <div  className={styles.filterBoxWrapper}>
            <FilterBox 
              filterOptions={filterOptions}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              currentCategory={currentCategory}/>
          </div>
          
          </Col>
        </Row>
        <Row>
          <SortMenu
          value={sortOption}
          onChange={handleSortChange}
          optionList={sortOptionList}
          />
        </Row>
        <Row>
        <hr className={styles.customHr}/>
        </Row>

        {sortedRecipes.length === 0 ? (
          <div className={styles.noRecipesMessage}>아직 레시피가 없습니다.</div>
        ) : (
        <RecipeListPage 
          // recipes={filteredRecipes} 
          recipes={sortedRecipes}
          currentCategory={currentCategory}
          isLoading={isLoading}
        />
        )}
      </>
      )}
    </Container>
  )
}

export default FetchRecipeList;