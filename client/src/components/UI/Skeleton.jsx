import React from 'react';
import ContentLoader from 'react-content-loader';
import { Container, Row, Col } from 'react-bootstrap';
import styles from '../../assets/styles/RecipeCard.module.css';

const RecipeCardSkeleton = () => (
    <div className={styles.recipeCard}>
      <ContentLoader
        speed={2}
        width="100%"
        height="100%"
        viewBox="0 0 258 350"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        preserveAspectRatio="none"
>
        {/* <rect x="0" y="0" rx="3" ry="3" width="100" height="66.67" />
        <rect x="3" y="70" rx="1" ry="1" width="94" height="6.67" />
        <rect x="3" y="80" rx="1" ry="1" width="94" height="10" />
        <rect x="3" y="93" rx="1" ry="1" width="30" height="6.67" />
        <rect x="36" y="93" rx="1" ry="1" width="30" height="6.67" /> */}
        
        <rect x="0" y="0" rx="4" ry="4" width="100%" height="57%" />
        <rect x="5%" y="60%" rx="3" ry="3" width="90%" height="8%" />
        <rect x="5%" y="72%" rx="3" ry="3" width="90%" height="6%" />
        <rect x="5%" y="82%" rx="3" ry="3" width="40%" height="6%" />
        <rect x="55%" y="82%" rx="3" ry="3" width="40%" height="6%" />
      </ContentLoader>
    </div>
);

const Skeleton = () => {
  return (
    <Container className="py-5">
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {[...Array(8)].map((_, index) => (
              <Col key={index} className={styles.recipeCardWrapper}>
                  <RecipeCardSkeleton />
              </Col>
            ))}
      </Row>
    </Container>
  );
};

export default Skeleton;