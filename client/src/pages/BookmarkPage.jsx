/**BookmarkPage.jsx
 * 북마크된 레시피 리스트 컴포넌트
 * [ ] 
 * [ ] 무한스크롤 
 * [ ] toast 알림
 */

import React, { useState, useCallback } from "react";
import { Link } from 'react-router-dom';
// import useInfinityScroll from "../components/useInfinityScroll";
// import useIntersectionObserver from '../components/useIntersectionObserver';
import { Container, Col, Row, Card } from 'react-bootstrap';

const BookmarkPage = () => {
  const API_URL = import.meta.env.VITE_HOST_IP;

  const fetchBookmarked = async (page) => {

    try {
      let url = `${API_URL}/api/bookmark`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if(!response.ok) {
        throw new Error((await response.json()).error);
      }

      const result = await response.json();
      console.log("성공:", result)
    } catch (e) {
      console.error("실패:", e);
    }
    return response.json();
  }

  const { data: recipes, isFetchingNextPage, status, fetchNextPage, hasNextPage } = useInfinityScroll('bookmarkedRecipes', fetchBookmarked);    //bookmarkedRecipes = queryKey

  if (status === 'loading') return <p>로딩중...</p>;
  if (status === 'error') return <p>Error fetching data</p>;


  return (
    <div>
      <Container className="text-start">
        <Row lg={5} className="g-4">
          {recipes && 
            recipes.map((recipe) => (
          <Col key={recipe.recipe_id}>  
            <Link to={`/recipe/${recipe.recipe_id}`} style={{ textDecoration: 'none' }}>
              <Card style={{ border: 'none', borderRadius:0, cursor: 'pointer' }}>
                {recipe.recipe_img ? (
              <Card.Img variant="top" src={recipe.recipe_img} style={{borderRadius:0}}/>
                ) : (
                  <div style={{height: '200px' }}></div>
                )}
              <Card.Body>
                <Card.Title  style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>
                  {recipe.recipe_name}
                </Card.Title>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        ))}
        
        </Row>

        {isFetchingNextPage && <p>Loading more...</p>}
        <div id="observer" style={{ height: "10px" }}></div>

    {/* <OuterWrapper>
      <List items={items} />
      <ActionWrapper>
        <button onClick={handleAddOneItem}>Add one item</button>
        <button onClick={handleRemoveOneItem}>Remove one item</button>
        <button onClick={handleToggleOrder}>Toggle order</button>
      </ActionWrapper>
      <ActionWrapper>
        <button className="editBtn" onClick={handleOpenEditModal}>
          Edit list content
        </button>
      </ActionWrapper>
    </OuterWrapper> */}

      </Container>
    </div>
  );
};

export default BookmarkPage;