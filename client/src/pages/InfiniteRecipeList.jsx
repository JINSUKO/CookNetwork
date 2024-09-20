// RecipeListPage.jsx의 무한스크롤버전,,

import React, { useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { Card, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import BookmarkButton from '../components/Bookmark/BookmarkButton';
import styles from '../assets/styles/RecipeCard.module.css';

function InfiniteRecipeList({ recipes = [], currentCategory, hasMore, loadMore, isLoading  }) {
  const itemCount = hasMore ? recipes.length + 1 : recipes.length;
  const isItemLoaded = useCallback(index => !hasMore || index < recipes.length, [hasMore, recipes]);
  const loadMoreItems = isLoading ? () => {} : loadMore;

  const RecipeCard = ({ index, style }) => {
    if (!isItemLoaded(index)) {
      return <div style={style}>Loading...</div>;
    }

    const recipe = recipes[index];
    if (!recipe) {
      return <div style={style}>레시피 정보를 불러올 수 없습니다.</div>;
    }

    return (
      <Col style={style}>
        <Link to={`/recipe/${recipe.recipe_id}`} style={{ textDecoration: 'none' }}>
          <Card className={styles.recipeCard}>
            <div className={styles.imageWrapper}>
              {recipe.recipe_img ? (
                <Card.Img variant="top" src={recipe.recipe_img} className={styles.recipeImage} />
              ) : (
                <div style={{ height: '200px' }}></div>
              )}
              <div className={styles.bookmarkWrapper}>
                <BookmarkButton recipe_id={recipe.recipe_id} />
              </div>
            </div>
            <Card.Body>
              <Card.Title className={styles.recipeTitle}>{recipe.recipe_name}</Card.Title>
              <Card.Title className={styles.recipeInfo}>{recipe.recipe_desc}</Card.Title>
              <div className={styles.recipeInfo}>
                <span style={{ marginRight: '16px' }}>📌레벨{recipe.level}</span>
                <span>🕛{recipe.cooked_time}분</span>
              </div>
            </Card.Body>
          </Card>
        </Link>
      </Col>
    )
  }

  if (recipes.length === 0) {
    return <div>레시피가 없습니다.</div>;
  }

  const height = 800; 
  const width = '100%'; 
  const itemSize = 400; 


  return(
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
      >

      {({ onItemsRendered, ref }) => (
        <List
          height={height}
          itemCount={itemCount}
          itemSize={itemSize}
          onItemsRendered={onItemsRendered}
          ref={ref}
          width={width}
        >
          {RecipeCard}
        </List>
      )}


      </InfiniteLoader>
  )
}

export default InfiniteRecipeList;