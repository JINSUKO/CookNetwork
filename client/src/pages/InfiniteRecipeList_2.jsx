/** InfiniteRecipeList.jsx
 * 레시피 리스트 렌더링 컴포넌트
 * 무한스크롤 기능
 */

import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import BookmarkButton from '../components/Bookmark/BookmarkButton';
import styles from '../assets/styles/RecipeCard.module.css';
import { FaClock, FaRegChartBar } from 'react-icons/fa';
import Skeleton from '../components/UI/Skeleton';

// import { recipes as allRecipes } from './mockRecipes';



const ITEMS_PER_PAGE = 3;

function InfiniteRecipeList({ recipes, currentCategory, hasMore, loadMore, isLoading, totalCount }) {
  // const [recipes, setRecipes] = useState([]);
  // const [hasMore, setHasMore] = useState(true);
  // const [page, setPage] = useState(0);

  // const fetchMoreData = () => {
  //   if (recipes.length >= allRecipes.length) {
  //     setHasMore(false);
  //     return;
  //   }

  
  useEffect(() => {
    console.log('RecipeListPage - Recipes:', recipes.length, 'HasMore:', hasMore, 'IsLoading:', isLoading);
  }, [recipes, hasMore, isLoading]);

  const handleCardclick = (e, recipe_id) => {
    // 북마크 버튼 클릭 시 카드가 클릭되어 상세페이지로 이동되는 것을 방지
    if (e.target.closest(`.${styles.bookmarkWrapper}`)){
      e.preventDefault();
      e.stopPropagation();
    } else {
      // 카드의 다른 부분 클릭시 레시피 상세 페이지로 이동
      window.location.href = `/recipe/${recipe_id}`;
    }
  };

    // Simulate an API call with setTimeout
  //   setTimeout(() => {
  //     const newRecipes = allRecipes.slice(
  //       page * ITEMS_PER_PAGE,
  //       (page + 1) * ITEMS_PER_PAGE
  //     );
  //     setRecipes(prevRecipes => [...prevRecipes, ...newRecipes]);
  //     setPage(prevPage => prevPage + 1);
  //   }, 500);
  // };

  // useEffect(() => {
  //   fetchMoreData();
  // }, []);




  useEffect(() => {
    console.log('RecipeListPage - Recipes:', recipes.length, 'HasMore:', hasMore, 'IsLoading:', isLoading);
  }, [recipes, hasMore, isLoading]);

  const handleCardClick = (e, recipe_id) => {
    // 북마크 버튼 클릭 시 카드가 클릭되어 상세페이지로 이동되는 것을 방지
    if (e.target.closest(`.${styles.bookmarkWrapper}`)){
      e.preventDefault();
      e.stopPropagation();
    } else {
      // 카드의 다른 부분 클릭시 레시피 상세 페이지로 이동
      window.location.href = `/recipe/${recipe_id}`;
    }
  };

  if (isLoading && (!recipes || recipes.length === 0)) {
    return <Skeleton />;
  }




  const RecipeCard = React.memo(({ recipe }) => (
    <Col xs={6} sm={6} md={4} lg={3} className="mb-4">
      <div className={styles.recipeCardWrapper}>

      <Link to={`/recipe/${recipe.recipe_id}`} style={{ textDecoration: 'none' }}>
        <Card 
          className={styles.recipeCard}
          onClick={(e) => handleCardClick(e, recipe.recipe_id)}
        >
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
            <Card.Text className={styles.recipeInfo}>{recipe.recipe_desc}</Card.Text>
            <div className={styles.recipeInfo}>
              <span >
              <FaRegChartBar className={styles.icon} />
              레벨{recipe.level}</span>
              <span >
              <FaClock className={styles.icon}  />
              {recipe.cooked_time}분</span>
            </div>
          </Card.Body>
        </Card>
      </Link>
      </div>
    </Col>
  ));

  return (
    <Container fluid className={styles.recipeListContainer}>

      <InfiniteScroll
        dataLength={recipes.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<Skeleton/>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>모든 레시피를 불러왔습니다.</b>
          </p>
        }
      >
        <Row className={styles.recipeCardContainer}>
          {recipes.map(recipe => (
            <RecipeCard key={recipe.recipe_id} recipe={recipe} />
          ))}
        </Row>
      </InfiniteScroll>
    </Container>

  );
}

export default InfiniteRecipeList;


// function InfiniteRecipeList({ recipes = [], currentCategory, hasMore, loadMore, isLoading  }) {
//   const itemCount = hasMore ? recipes.length + 1 : recipes.length;
//   const isItemLoaded = useCallback(index => !hasMore || index < recipes.length, [hasMore, recipes]);
//   const loadMoreItems = isLoading ? () => {} : loadMore;

//   const RecipeCard = ({ index, style }) => {
//     if (!isItemLoaded(index)) {
//       return <div style={style}>Loading...</div>;
//     }

//     const recipe = recipes[index];
//     if (!recipe) {
//       return <div style={style}>레시피 정보를 불러올 수 없습니다.</div>;
//     }

//     return (
//       <Col style={style}>
//         <Link to={`/recipe/${recipe.recipe_id}`} style={{ textDecoration: 'none' }}>
//           <Card className={styles.recipeCard}>
//             <div className={styles.imageWrapper}>
//               {recipe.recipe_img ? (
//                 <Card.Img variant="top" src={recipe.recipe_img} className={styles.recipeImage} />
//               ) : (
//                 <div style={{ height: '200px' }}></div>
//               )}
//               <div className={styles.bookmarkWrapper}>
//                 <BookmarkButton recipe_id={recipe.recipe_id} />
//               </div>
//             </div>
//             <Card.Body>
//               <Card.Title className={styles.recipeTitle}>{recipe.recipe_name}</Card.Title>
//               <Card.Title className={styles.recipeInfo}>{recipe.recipe_desc}</Card.Title>
//               <div className={styles.recipeInfo}>
//                 <span style={{ marginRight: '16px' }}>📌레벨{recipe.level}</span>
//                 <span>🕛{recipe.cooked_time}분</span>
//               </div>
//             </Card.Body>
//           </Card>
//         </Link>
//       </Col>
//     )
//   }

//   if (recipes.length === 0) {
//     return <div>레시피가 없습니다.</div>;
//   }

//   const height = 800; 
//   const width = '100%'; 
//   const itemSize = 400; 


//   return(
//     <InfiniteLoader
//       isItemLoaded={isItemLoaded}
//       itemCount={itemCount}
//       loadMoreItems={loadMoreItems}
//       >

//       {({ onItemsRendered, ref }) => (
//         <List
//           height={height}
//           itemCount={itemCount}
//           itemSize={itemSize}
//           onItemsRendered={onItemsRendered}
//           ref={ref}
//           width={width}
//         >
//           {RecipeCard}
//         </List>
//       )}


//       </InfiniteLoader>
//   )
// }

// export default InfiniteRecipeList;