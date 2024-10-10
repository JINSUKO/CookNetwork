/** SearchResultPage.jsx
* 레시피 검색 결과가 렌더링되는 레시피 리스트 페이지입니다.
*/

import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import BookmarkButton from "../components/Bookmark/BookmarkButton";
import Paging from "../components/UI/Paging";
import cardStyles from "../assets/styles/RecipeCard.module.css";
import listStyles from "../assets/styles/RecipeList.module.css";
// 페이지네이션
import {FaClock} from "@react-icons/all-files/fa/FaClock";  
import {FaRegChartBar} from "@react-icons/all-files/fa/FaRegChartBar";  
import {FaUser} from "@react-icons/all-files/fa/FaUser";  
import Skeleton from "../components/UI/Skeleton";
import SortMenu from "../components/SortMenu";

const API_URL = import.meta.env.VITE_HOST_IP;

function SearchResultPage() {
  const [results, setResults] = useState([]);   // 검색 결과 저장
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(null);
  const location = useLocation();
  // 정렬 기능 관련
  const [sortOption, setSortOption] = useState("최신순");
  const [sortedResults, setSortedResults] = useState([]);   // 정렬된 레시피 배열
  // 페이지네이션 관련
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 8;

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q');
  const category = searchParams.get('category') || 'all'

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');
    const category = searchParams.get('category') || 'all'

    // console.log(query)
    // console.log(category)
    if (query) {
      fetchSearchResults(query,category);
    }
  }, [location]);

  // 정렬 기능
  useEffect(() => {
    setSortedResults(getSortedList(results, sortOption));
  }, [results, sortOption]);

  // fetch 함수
  const fetchSearchResults = async (query,category) => {
    setIsLoading(true);   
    setError(null)

    try {
      const response = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`, {    // 검색어 내 공백이나 특수문자 인코딩하여 가져옴
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
      if (!response.ok) {
        throw new Error(`검색 요청에 실패했습니다.: ${response.status}`);
      }
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('검색 중 오류 발생:', error.message);
      setError('검색 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
      // console.log(results)
    }
  };

  const handleCardclick = (e, recipe_id) => {
      // 북마크 버튼 클릭 시 카드가 클릭되어 상세페이지로 이동되는 것을 방지
      if (e.target.closest(`.${cardStyles.bookmarkWrapper}`)){
          e.preventDefault();
          e.stopPropagation();
      }
  };

  // 정렬 기능
  // sortOption이 변경될 때마다 정렬된 데이터를 업데이트
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

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const sortOptionList = [
    { value: "최신순", name: "최신순" },
    { value: "이름순", name: "이름순" },
    { value: "난이도순", name: "난이도순" },
    { value: "조리시간순", name: "조리시간순" },
  ];


  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  // Search Result 문구 표시
  if (!results) {
    return;
  }
  
  if (isLoading) {    // 검색 로딩중
    return <div><Skeleton /></div>;
  }

  if (error) {      // 검색 오류
    return <p className="error-message">{error}</p>;
  }

  if (results.length === 0) {    // 해당 검색 결과가 없을 때
    return <p>검색 결과가 없습니다.</p>;
  }


  // const indexOfLastItem = activePage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = results.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Container className="py-5" style={{margin: '0 auto'}}>
      <h3 className={listStyles.recipeListTitle}>
        검색 결과: {query}</h3>
      <Row>
        <SortMenu 
          value={sortOption}
          onChange={handleSortChange}
          optionList={sortOptionList}
        />
      </Row>
      <Row>
      <hr className={listStyles.customHr}/>
      </Row>

      <Row xs={2} md={3} lg={4} className="g-4">
        {sortedResults.map((recipe) => (    // results 배열에 저장된 검색결과를 사용
          <Col key={recipe.recipe_id}>
              <Link to={`/recipe/${recipe.recipe_id}`} style={{ textDecoration: 'none' }}>
                <Card
                  className={cardStyles.recipeCard}
                  onClick={(e) => handleCardclick(e, recipe.recipe_id)}
                  >
                <div className={cardStyles.imageWrapper}>
                  {recipe.recipe_img ? (
                  <Card.Img variant="top" src={recipe.recipe_img}  className={cardStyles.recipeImage}/>
                  ) : (
                    <div style={{height: '200px' }}></div>
                  )}
                      <div className={cardStyles.bookmarkWrapper}>
                          {/*<BookmarkButton recipe_id={recipe.recipe_id} />*/}
                      </div>
                </div>
                <Card.Body>
                  <Card.Title className={cardStyles.recipeTitle}>
                    {recipe.recipe_name}
                  </Card.Title>
                  <Card.Title  className={cardStyles.recipeDesc}>
                    {recipe.recipe_desc}
                  </Card.Title>
                  <div className={cardStyles.recipeInfo}>
                    <span>
                        <FaRegChartBar className={cardStyles.icon} />
                        Lv.{recipe.level}
                      </span>
                      <span>
                        <FaClock className={cardStyles.icon} />
                        {recipe.cooked_time}분
                      </span>
                      <span>
                        <FaUser className={cardStyles.icon}/>
                        셰프
                    </span>
                  </div>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
      <Row>
        <Paging
          activePage={activePage}
          itemsCountPerPage={itemsPerPage}
          totalItemsCount={results.length}
          onChange={handlePageChange}
        />
      </Row>
    </Container>
  );
}


export default SearchResultPage;