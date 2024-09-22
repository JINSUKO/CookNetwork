import React from 'react';
import ContentLoader from 'react-content-loader';
import { Container, Row, Col } from 'react-bootstrap';
import listStyles from '../../assets/styles/RecipeList.module.css';
import styles from '../../assets/styles/RecipeCard.module.css';

const RecipeCardSkeleton = () => (
  <div className={styles.recipeCardWrapper}>
    <div className={styles.recipeCard}>
      <ContentLoader
        speed={2}
        width="100%"
        height={300}
        viewBox="0 0 100 100"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        <rect x="0" y="0" rx="3" ry="3" width="100" height="66.67" />
        <rect x="3" y="70" rx="1" ry="1" width="94" height="6.67" />
        <rect x="3" y="80" rx="1" ry="1" width="94" height="10" />
        <rect x="3" y="93" rx="1" ry="1" width="30" height="6.67" />
        <rect x="36" y="93" rx="1" ry="1" width="30" height="6.67" />
      </ContentLoader>
    </div>
  </div>
);

const Skeleton = () => {
  return (
    <Container fluid className={styles.recipeListContainer}>
      <Row className={styles.recipeCardContainer}>
            {[...Array(8)].map((_, index) => (
              <Col key={index}  xs={6} sm={6} md={4} lg={3} className="mb-4">
                  <RecipeCardSkeleton />
              </Col>
            ))}
      </Row>
    </Container>
  );
};

export default Skeleton;