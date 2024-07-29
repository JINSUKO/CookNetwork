/*
쇼핑몰 메인 페이지
*/

import { React, useState } from 'react';
import logo from '../assets/images/logo.png';
import SearchBar from '../components/SearchBar.jsx'
import RecipeList from '../components/RecipeList.jsx'
import '../assets/styles/Main.css'
import 'bootstrap/dist/css/bootstrap.min.css';
// import Navbar from '../components/Navbar.jsx';



function Main() {
  // const [products, setProducts] = React.useState([]);

  return ( 
  <div>
    <div className="header">
      <header>
        <img src={logo} alt="로고 이미지" width={200}/>
        <SearchBar/>
        {/* <Navbar/> */}
      </header>
    </div>

    <div>태그 컴포넌트</div>
    <div>
      <RecipeList/>
    </div>

    <div className="footer">
      <footer></footer>
    </div>
  </div>
  )
}

export default Main;