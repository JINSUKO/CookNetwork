/* FetchRecipeList.jsx
-Fetch 함수를 사용해 레시피 데이터 호출하는 컴포넌트입니다.
-동적 라우팅을 위해 useParams, useCallback 사용
// */

// import React, { useState, useEffect } from "react";
// import { useParams } from 'react-router-dom';
// import FilterBox from "./FilterBox";

// const API_URL = import.meta.env.VITE_HOST_IP;

// function FetchFilter({ currentCategory }) { 
//   const [category, setCategory] = useState();
//   const [filter, setFilter] = useState([]);
  
//   // 필터로 사용될 배열
//   const Vals = [
//     "모두보기", "메인요리", "반찬", "국/탕", "디저트", "면", 
//     "밥/죽/떡", "퓨전", "양념/소스", "채식", "분식", "안주", 
//     "스프", "간식", "음료", "다이어트", "도시락"
//   ];

//   const [item, setItem] = useState(Data);

//   const menuItems = [...new Set(Vals.map((Val) => Val.category))];

//   const filterItem = (currentCategory) => {
//     const newItem = Vals.filter((newVal) => {
//       return newVal.category === currentCategory;
//     });
//     setItem(newItem);
//   };

//   const handleSelect = (eventKey) => {
//     console.log(eventKey)
//     const selectedCategory = categories.find(cat => cat.name === eventKey);
//     if (selectedCategory){                     // 선택한 카테고리와 같은 카테고리를 찾아서
//       setCategory(selectedCategory.name); 
//       onCategoryChange(selectedCategory.path); // 선택된 카테고리 정보를 부모 컴포넌트로 전달
//     }
//   };
//   const getFilteredList = async (query, category) => {
//     try {
//       const response = await fetch(`${API_URL}/api/category/${category}?q=${encodeURIComponent(query)}&filter=${encodeURIComponent(category)}`)
//     }
    
//   }


// return (
//   <div>
//     <FilterBox 
//       filterItem={filterItem}
//       setItem={setItem}
//       menuITems={menuItems}
//     />
//   </div>
//   )
// };
// export default FetchFilter;