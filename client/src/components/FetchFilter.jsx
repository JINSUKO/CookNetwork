/* FetchRecipeList.jsx
-Fetch 함수를 사용해 레시피 데이터 호출하는 컴포넌트입니다.
-동적 라우팅을 위해 useParams, useCallback 사용
*/

import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_HOST_IP;

function FetchFilter({ currentCategory }) { 
  const [category, setCategory] = useState();
  const [filter, setFilter] = useState([]);
  // 카테고리로 사용될 배열
  const categories = [
    { name: '전체', path: 'all' },
    { name: '한식', path: '한식' },
    { name: '양식', path: '양식' },
    { name: '중식', path: '중식' },
    { name: '일식', path: '일식' }
  ];

  const handleSelect = (eventKey) => {
    console.log(eventKey)
    const selectedCategory = categories.find(cat => cat.name === eventKey);
    if (selectedCategory){                     // 선택한 카테고리와 같은 카테고리를 찾아서
      setCategory(selectedCategory.name); 
      onCategoryChange(selectedCategory.path); // 선택된 카테고리 정보를 부모 컴포넌트로 전달
    }
  };
  const getFilteredList = async (query, category) => {
    try {
      const response = await fetch(`${API_URL}/api/category/${category}?q=${encodeURIComponent(query)}&filter=${encodeURIComponent(category)}`)
    }
  }


return (

  )
};
export default FetchFilter;