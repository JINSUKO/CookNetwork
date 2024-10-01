/** MyRecipeList.jsx
 * 셰프회원의 작성 레시피 목록 관리 페이지
 * MyRecipeCard.jsx의 카드 리스트에 user가 작성한 레시피 데이터를 호출해 보여줍니다.
 * 
 */

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import MyRecipeCard from "../components/MyRecipeCard";
import RecipeListPage from './RecipeListPage';
// import FilterBox from "../components/FilterBox";
import Loading from "../components/UI/Loading"

const MyRecipeList = ({ user }) => {    // { recipes }

const [recipes, setRecipes] = useState([]);
const { user_id } = useParams();
// const user_id = user?.user_id
const [isLoading, setIsLoading] = useState(false);
const navigate = useNavigate();
const API_URL = import.meta.env.VITE_HOST_IP;

  useEffect(() => {
    const getMyRecipes = async () => {

      if (!user) {
        console.log("유저를 찾을 수 없습니다.: ", user);
        setIsLoading(false);
        return;
      }

      if (user.chef_code !== 1) {
        console.log('셰프 회원이 아닙니다: ', user);
        // navigate('/');
        return;
      }

        try {
          const response = await fetch(`${API_URL}/api/myRecipe/${user_id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              // 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch recipes');
          }

          const data = await response.json();

          setRecipes(data);
        } catch (error) {
          console.error("Error fetching recipes:", error);
        } finally {
          setIsLoading(false);
        }
      };
      getMyRecipes();
    }, [user, navigate, API_URL, user_id]);
    console.log()
  if (isLoading && !user) {
    return (
      <Container className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Loading />
        <div className="mt-3">사용자 정보를 불러오는 중입니다...</div>
      </Container>
    )
  }
  if (isLoading && (!recipes || recipes.length === 0)) {
    return <Skeleton />
  }

  return (
    <Container style={{ textAlign: 'center' }}>
      {isLoading && recipes.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <h2 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh', margin: '30px 0', fontWeight: "bold" }}>나만의 레시피 관리</h2>
          <RecipeListPage recipes = {recipes}/>
        </>
      )}
    </Container>
  );
};

export default MyRecipeList;

