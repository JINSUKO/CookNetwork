import React, { useEffect } from "react";
import { Container } from 'react-bootstrap';
import { useBookmarkContext } from '../../context/BookmarkContext';
import RecipeListPage from "../../pages/RecipeListPage";
// import Loading from "../../components/UI/Loading";
import Skeleton from "../../components/UI/Skeleton";
import { FaTruckMonster } from "react-icons/fa";

function BookmarkList() {
  const { fetchBookmark, loading, bookmarkedRecipes } = useBookmarkContext();

  useEffect(() => {
    fetchBookmark(); // [ ] 북마크 isBookmarked 상태 반영
  }, [fetchBookmark]);

  return (
    <Container>
      {loading && bookmarkedRecipes.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Skeleton />
        </div>
      ) : (
        <>
        <h3 className="d-flex justify-content-center align-items-center" style={{ height: '10vh' }}>
          <FaTruckMonster/>서비스 준비중입니다. 
        </h3>          <RecipeListPage 
            recipes={bookmarkedRecipes}
            isLoading={loading}
            isBookmarkPage={true}
          />
        </>
      )}
    </Container>
  );
}

export default BookmarkList;
