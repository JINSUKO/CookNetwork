import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import boardstyles from '../assets/styles/Board.module.css';


function Board() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const API_URL = import.meta.env.VITE_HOST_IP; 

    // 더미 데이터 생성 함수 (추후 API 데이터로 변경)
    const generateDummyPosts = (startId, count) => {
      return Array.from({ length: count }, (_, index) => ({
        id: startId + index,
        title: `공지사항 #${startId + index}`,
        content: `무한스크롤 테스트를 위한 공지사항 #${startId + index}의 내용입니다.`
      }));
    };

// 게시물 불러오기 함수
const fetchPosts = useCallback(async () => {
  if (loading) return;
  setLoading(true);

  // setTimeout 사용
  setTimeout(() => { 
  
    // 실제 구현에서는 여기서 API를 호출합니다
    // const response = await fetch(`${API_URL}/posts?page=${page}`);
    // const newPosts = await response.json();
    const newPosts = generateDummyPosts((page - 1) * 10 + 1, 10);
    
    if (newPosts.length === 0) {
      setHasMore(false);
    } else {
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
      setPage(prevPage => prevPage + 1);
    }
    setLoading(false);
  }, 1000);
}, [page, loading]);

// Intersection Observer 설정
const lastPostElementRef = useCallback(node => {
  if (loading) return;
  if (observer.current) observer.current.disconnect();
  observer.current = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && hasMore) {
      fetchPosts();
    }
  });
  if (node) observer.current.observe(node);
}, [loading, hasMore, fetchPosts]);

// 초기 게시물 로딩
useEffect(() => {
  fetchPosts();
}, []);

  return (
    <Container className="d-flex flex-column align-items-center">
      <h1 className="my-5">공지사항</h1>
      <Row xs={1} md={2} lg={2} className="g-4 justify-content-center" style={{maxWidth: '1200px' }}>
        {posts.map((post, index) => (
          <Col key={post.id} ref={index === posts.length - 1 ? lastPostElementRef : null}>
            <Card className="h-100" style={{ minHeight: '200px'}}>
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Text>{post.content}</Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">
                  {/* {post.status} | {post.date} */}
                  진행중 | ~2024/09/06
                </small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
      {loading && <p className="text-center mt-3">로딩 중...</p>}
      {!hasMore && <p className="text-center mt-3">더 이상 게시물이 없습니다.</p>}
    </Container>
  );
}

export default Board;