/** BookmarkList.jsx
 * 마이페이지 내 북마크한 레시피 리스트 컴포넌트
 * 
 */


import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
// import { useBookmarkContext } from './BookmarkContext';

const BookmarkList = () => {
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await fetch('/api/bookmarks', {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch bookmarks');
        }
        const data = await response.json();
        setBookmarkedRecipes(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default BookmarkList;