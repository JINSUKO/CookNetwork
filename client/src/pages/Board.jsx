/** Board.jsx 
 * 공지사항 페이지
*/

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import boardstyles from '../assets/styles/Board.module.css';
import BoardSkeleton from '../components/UI/BoardSkeleton';
import ScrollToTop from '../components/UI/ScrollToTop';

function Board() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_HOST_IP;

  // 더미 데이터 생성 함수 (추후 API 데이터로 변경)
  // const generateDummyPosts = (count) => {
  //   return Array.from({ length: count }, (_, index) => ({
  //     id: index + 1,
  //     title: `공지사항 #${index + 1}`,
  //     content: `공지사항 #${index + 1}의 내용입니다.`
  //   }));
  // };

  // Notice 데이터 불러오기 함수
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/board`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('데이터를 불러오는데 실패했습니다.');
        }
        
        const fetchedPosts = await response.json();
        
        setPosts(fetchedPosts);
        setIsLoading(false);
      } catch (e) {
        console.error(e);
        setError(e.message);
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [API_URL]);

  if (isLoading) return <div><BoardSkeleton /></div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container className={`d-flex flex-column align-items-center ${boardstyles.boardContainer}`}>
      <h1 className={`my-5 ${boardstyles.boardHeader}`}>공지사항</h1>
      <Row xs={1} md={2} lg={2} className="g-4 justify-content-center" style={{maxWidth: '1200px' }}>
        {posts && posts.map((post) => (
          <Col key={post.notice_id}>
            <Card className={`h-100 ${boardstyles.postContainer}`} style={{ minHeight: '200px'}}>
              <Card.Body>
                <Card.Title className={boardstyles.postTitle}>{post.notice_name}</Card.Title>
                <Card.Text className={boardstyles.postContent}>{post.notice_desc}</Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">
                  {post.create_notice_date}
                </small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
      <ScrollToTop />
    </Container>
  );
}

export default Board;