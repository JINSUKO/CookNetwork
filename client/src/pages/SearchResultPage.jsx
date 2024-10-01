/** SearchResultPage.jsx
* 레시피 검색 결과가 렌더링되는 레시피 리스트 페이지입니다.
*/

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import BookmarkButton from "../components/Bookmark/BookmarkButton";
import Paging from "../components/UI/Paging";
import styles from "../assets/styles/RecipeCard.module.css";
import {FaClock, FaRegChartBar} from "react-icons/fa";   // 페이지네이션

const API_URL = import.meta.env.VITE_HOST_IP;

function SearchResultPage() {
  const [results, setResults] = useState([]);   // 검색 결과 저장
  const [isLoading, setIsLoading] = useState(false);    // 검색 후 로딩
  const [error, setError] = useState(null);
  const location = useLocation();

  // 페이지네이션 관련
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 8;
  // const totalPage = Math.ceil(results.length/itemsPerPage);

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q');
  const category = searchParams.get('category') || 'all'

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');
    const category = searchParams.get('category') || 'all'

    console.log(query)
    console.log(category)
    if (query) {
      fetchSearchResults(query,category);
    }
  }, [location]);


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
      if (e.target.closest(`.${styles.bookmarkWrapper}`)){
          e.preventDefault();
          e.stopPropagation();
      }
  };

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  // Search Result 문구 표시
  if (!results) {
    return;
  }
  
  if (isLoading) {    // 검색 로딩중
    return <p>검색 중...</p>;
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
    <Container>
      <h3>검색 결과: {query}</h3>
      <Row xs={2} md={3} lg={4} className="g-4">
        {results.map((recipe) => (    // results 배열에 저장된 검색결과를 사용
          <Col key={recipe.recipe_id}>
              <Link to={`/recipe/${recipe.recipe_id}`} style={{ textDecoration: 'none' }}>
                <Card
                  className={styles.recipeCard}
                  onClick={(e) => handleCardclick(e, recipe.recipe_id)}
                  >
                <div className={styles.imageWrapper}>
                  {recipe.recipe_img ? (
                  <Card.Img variant="top" src={recipe.recipe_img}  className={styles.recipeImage}/>
                  ) : (
                    <div style={{height: '200px' }}></div>
                  )}
                      <div className={styles.bookmarkWrapper}>
                          {/*<BookmarkButton recipe_id={recipe.recipe_id} />*/}
                      </div>
                </div>
                <Card.Body>
                  <Card.Title className={styles.recipeTitle}>
                    {recipe.recipe_name}
                  </Card.Title>
                  <Card.Title  className={styles.recipeDesc}>
                    {recipe.recipe_desc}
                  </Card.Title>
                  <div className={styles.recipeInfo}>
                    <span style={{ marginRight: '16px'}}>
                      <FaRegChartBar className={styles.icon} />
                      레벨{recipe.level}
                    </span>
                    <span>
                      <FaClock className={styles.icon} />
                      {recipe.cooked_time}분
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