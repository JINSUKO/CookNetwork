/*
메인 페이지
*/

import { React, useState } from 'react';
import RecipeListPage from './RecipeListPage';
import '../assets/styles/Main.css'
import FetchRecipeList from '../components/FetchRecipeList';



function Main() {
  // const [products, setProducts] = React.useState([]);

  return ( 
  <div>
    <div>
      <FetchRecipeList categoryProp="all" />
    </div>

  </div>
  )
}

export default Main;