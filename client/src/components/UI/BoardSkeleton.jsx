import React from 'react';
import ContentLoader from 'react-content-loader';
import { Container, Row, Col } from 'react-bootstrap';
import boardstyles from '../../assets/styles/Board.module.css';

const BoardCardSkeleton = () => (
  <ContentLoader
    speed={2}
    width={400}
    height={200}
    viewBox="0 0 400 150"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <rect x="0" y="0" rx="5" ry="5" width="400" height="120" />
    <rect x="10" y="120" rx="3" ry="3" width="140" height="15" />
    <rect x="160" y="120" rx="3" ry="3" width="230" height="15" />
  </ContentLoader>
);

function BoardSkeleton () {
  return (
    <Container className={`d-flex flex-column align-items-center ${boardstyles.boardContainer}`}>
      <h1 className={`my-5 ${boardstyles.boardHeader}`}>공지사항</h1>
      <Row xs={1} md={2} lg={2} className="g-4 justify-content-center" style={{maxWidth: '1200px'}}>
        {[...Array(6)].map((_, index) => (
          <Col key={index}>
            <div className={`h-100 ${boardstyles.postContainer}`} style={{ minHeight: '200px'}}>
              <BoardCardSkeleton />
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default BoardSkeleton;