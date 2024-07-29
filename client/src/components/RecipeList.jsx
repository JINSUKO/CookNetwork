/* 목록 컴포넌트
이미지, 이름, 레벨, 시간 
*/

import React from "react";
import sampleimage from '../assets/images/sample.jpeg';

function RecipeList() {
  return (
    <div class="container">
      <div class="">
        <div class="row">
          {/* {products.map((item, i) => <Card products={item} i={i+1} key={item.id} />)} */}
          <a href="#" class=""><img src={sampleimage}/></a>
          <a href="#" class=""><img src={sampleimage}/></a>
          <a href="#" class=""><img src={sampleimage}/></a>
        </div>
        <div class="row">
          <a href="#" class=""><img src={sampleimage}/></a>
        </div>
        <div class="row">
          <a href="#" class=""><img src={sampleimage}/></a>
        </div>
      </div>
    </div>
  )
}

export default RecipeList;
