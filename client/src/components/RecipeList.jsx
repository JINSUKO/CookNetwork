/* 상품 목록 컴포넌트
*/

import React from "react";
import sampleimage from '../assets/images/sample.jpeg';


function RecipeList() {
  return (
    <div className="container">
      <div className="recipeCard">
        <div>
          <img className="recipeImg"></img>
        </div>
        <div className="recipeContents">
          <div className="recipeName"></div>
          <div className="chefName"></div>
          <div className="recipeLevel"></div>
          <div className="recipeTime"></div>
        </div>
    </div>
    

      <div className="col">
        <div className="row">
          {/* {products.map((item, i) => <Card products={item} i={i+1} key={item.id} />)} */}
          <a href="#" className=""><img src={sampleimage}/></a>
          <a href="#" className=""><img src={sampleimage}/></a>
          <a href="#" className=""><img src={sampleimage}/></a>
        </div>
        <div className="row">
          <a href="#" className=""><img src={sampleimage}/></a>
        </div>
        <div className="row">
          <a href="#" className=""><img src={sampleimage}/></a>
        </div>






        <div>
          {/* {products.map((item, i) => <Card products={item} i={i+1} key={item.id} />)} */}
          <a href="#" className=""><img src={sampleimage}/></a>
          <a href="#" className=""><img src={sampleimage}/></a>
          <a href="#" className=""><img src={sampleimage}/></a>
        </div>
        <div className="row">
          <a href="#" className=""><img src={sampleimage}/></a>
        </div>
        <div className="row">
          <a href="#" className=""><img src={sampleimage}/></a>
        </div>
      </div>
    </div>
  )
}


export default RecipeList;
