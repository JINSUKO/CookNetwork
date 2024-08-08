/*
메인 페이지
*/

import { React, useState } from 'react';
import RecipeListPage from './RecipeListPage';
import '../assets/styles/Main.css'



function Main() {
  // const [products, setProducts] = React.useState([]);

  return ( 
  <div>
    <div>
      <RecipeListPage categoryProp="all" />
    </div>

  </div>
  )
}

export default Main;