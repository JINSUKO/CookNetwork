/*
쇼핑몰 메인 페이지
*/

import { React, useState } from 'react';
import RecipeList from '../components/FetchRecipeList.jsx'
import '../assets/styles/Main.css'



function Main() {
  // const [products, setProducts] = React.useState([]);

  return ( 
  <div>
    <div>
      <RecipeList categoryProp="all" />
    </div>

  </div>
  )
}

export default Main;