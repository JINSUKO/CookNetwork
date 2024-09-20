/** BookmarkList.jsx
 * 마이페이지 내 북마크한 레시피 리스트 컴포넌트
 * 
 */

import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { useBookmarkContext } from '../../context/BookmarkContext';

const BookmarkList = () => {
  const { bookmarkedRecipes, removeBookmark, loading, error } = useBookmarkContext();
  
  if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;

  if (!Array.isArray(bookmarkedRecipes) || bookmarkedRecipes.length === 0) {
    return <div className="d-flex justify-content-center align-items-center">북마크한 레시피가 없습니다.</div>;
  }

  return (
    <div>
      <h2>최근 북마크 리스트</h2>
      <Row xs={2} md={3} lg={4} className="g-2 mb-4">
        {bookmarkedRecipes.map((recipe) => (
          <Col key={recipe.id}>
            <Card>
              <Card.Img 
                variant="top" 
                src={recipe.image_url || '/placeholder-image.jpg'} 
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover'
                }}
              />
              <Card.Body>
                <Card.Title>{recipe.title}</Card.Title>
                <button onClick={() => removeBookmark(recipe.id)}>북마크 제거</button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default BookmarkList;