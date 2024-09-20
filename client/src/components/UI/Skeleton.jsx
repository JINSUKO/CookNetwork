import React from 'react';
import ContentLoader from 'react-content-loader';
import { Container, Row, Col } from 'react-bootstrap';
// import styles from '../assets/styles/RecipeCard.module.css';

const RecipeCardSkeleton = () => (
  <ContentLoader
    speed={2}
    width={280}
    height={300}
    viewBox="0 0 280 300"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <rect x="0" y="0" rx="8" ry="8" width="260" height="200" />
    <rect x="0" y="210" rx="3" ry="3" width="200" height="20" />
    <rect x="0" y="240" rx="3" ry="3" width="250" height="30" />
    <rect x="0" y="280" rx="3" ry="3" width="100" height="15" />
    <rect x="110" y="280" rx="3" ry="3" width="100" height="15" />
  </ContentLoader>
);

const Skeleton = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={10}>
          <Row xs={2} md={3} lg={4} className="g-4">
            {[...Array(8)].map((_, index) => (
              <Col key={index}>
                <RecipeCardSkeleton />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Skeleton;