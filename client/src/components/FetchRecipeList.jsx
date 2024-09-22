/** FetchRecipeList.jsx
-Fetch 함수를 사용해 레시피 데이터 호출하는 컴포넌트입니다.
-카테고리 내 필터 선택
[ ] 무한스크롤
[ ] 로그인, 비로그인 북마크 여부 구분
[ ] 북마크- 낙관적 업데이트 적용
*/  


import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useSearchParams, useNavigate  } from 'react-router-dom';
import { Row, Col, Container } from 'react-bootstrap';
import RecipeListPage from "../pages/RecipeListPage";
import InfiniteRecipeList from "../pages/InfiniteRecipeList";
import FilterBox from "./FilterBox";
import Skeleton from "./UI/Skeleton";
import styles from '../assets/styles/RecipeList.module.css';
import { useBookmarkContext } from "../context/BookmarkContext";

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
  const API_URL = import.meta.env.VITE_HOST_IP;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const { isBookmarked } = useBookmarkContext(); 

  const filterOptions = [
    "모두보기", "메인요리", "반찬", "국/탕", "디저트", "면", 
    "밥/죽/떡", "퓨전", "양념/소스", "채식", "분식", "안주", 
    "스프", "간식", "음료", "다이어트", "도시락"
  ];
  console.log("filter:", selectedFilters)

  const fetchRecipes = useCallback(async (pageNum = 1) => {
    // if (isLoading || !hasMore) return;
    // setIsLoading(true);

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
        
        params.set('page', pageNum);
        params.set('limit', 3); // 한 번에 가져올 레시피 수

        url += `?${params.toString()}`;
        

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

      // 북마크 상태 확인
      // if (result && result.recipes) {
      //   const recipesWithBookmarkStatus = result.recipes.map(recipe => ({
      //     ...recipe,
      //     isBookmarked: isBookmarked(recipe.id)
      //   }));
      //   setRecipes(prevRecipes => [...prevRecipes, ...recipesWithBookmarkStatus]);
      //   setFilteredRecipes(prevRecipes => [...prevRecipes, ...recipesWithBookmarkStatus]);
      // }
      
      if (result && result.recipes) {
        console.log(`${currentCategory} 레시피 목록 호출 성공`);
        
        if (pageNum === 1) {
          setRecipes(result);
          setFilteredRecipes(result.recipes);
          setTotalCount(result.totalCount);
        } else {
          setRecipes(prevRecipes => [...prevRecipes, ...result.recipes]);
          setFilteredRecipes(prevRecipes => [...prevRecipes, ...result.recipes]);
        }
        // setHasMore(result.length === 3); // 3개 미만이면 더 이상 데이터가 없다고 판단
        setHasMore(Array.isArray(result.recipes) && recipes.length + result.recipes.length < result.totalCount);   // 남은데이터가 더 있으면 로드
      } else {
        setHasMore(false);
      }
    } catch (e) {
      console.error("실패:", e);
      setHasMore(false)   // 추가 로드 방지
    } finally {
      setIsLoading(false)
    }
  }, [currentCategory, selectedFilters, searchParams, API_URL]);
   // 카테고리 값이 변경될 때 함수 재생성
  
  useEffect(() => {   // 컴포넌트가 마운트될 때 fetch 함수 호출
    setPage(1);
    setHasMore(true);
    setRecipes([]);
    setFilteredRecipes([]);
    fetchRecipes(1);
  }, [fetchRecipes, currentCategory, selectedFilters]);   // currentCategory가 바뀔때마다 다시 실행

  useEffect(() => {
    setSelectedFilters([]);
    setPage(1);
  }, [currentCategory])   // currentCategory가 바뀔때마다 필터 새로고침

  // 종류별 필터 선택
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
    setPage(1);
    // setRecipes([]);
    fetchRecipes(1);
  };
  
  // 무한 스크롤
  const loadMore = useCallback(() => {
    console.log('loadMore', page)
    if (!isLoading && hasMore) {
      console.log('새 페이지 로딩 시작')
      const nextPage = page + 1;
      setPage(nextPage);
      console.log('다음 페이지:', nextPage);
      setIsLoading(true);
      fetchRecipes(nextPage).finally(() => {
        setIsLoading(false);  // 로딩 상태 해제
        console.log('페이지 로딩 완료');
      });
    }
  }, [hasMore, page, isLoading, fetchRecipes]);

  // 리스트 상단 소개에 카테고리 표시
  const displayCategory = () => {
    if (currentCategory === 'main' || currentCategory === '전체' || !currentCategory) {
      return '모든 레시피';
    }
    return `${currentCategory} 카테고리`;
  };
  

  return (
    <Container className={styles.recipeListContainer}>

      {isLoading && recipes.length === 0 ? (
        <div>
          <Skeleton/>
        </div>
      ) : (
        <Row  className="justify-content-center">
          <Col xs={12} md={10} lg={8}>

          <h6 className={styles.recipeListTitle}>{displayCategory()}</h6>

          <div  className={styles.filterBoxWrapper}>
            <FilterBox 
              filterOptions={filterOptions}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}/>
          </div>
          {/* <RecipeListPage 
            recipes={filteredRecipes} 
            currentCategory={currentCategory}
            hasMore={hasMore}
            loadMore={() => fetchRecipes(page + 1)}
            isLoading={isLoading}
            totalCount={totalCount}
          /> */}

          <InfiniteRecipeList>
            recipes={recipes}
            hasMore={hasMore}
            loadMore={fetchRecipes}
            isLoading={isLoading}
          </InfiniteRecipeList>
          </Col>
        </Row>
      )}
    </Container>
  )
}

export default FetchRecipeList;