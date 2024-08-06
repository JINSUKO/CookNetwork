/* SearchCategoryDrop.jsx
검색창 내 드롭다운으로 카테고리를 선택할 수 있는 컴포넌트입니다.
카테고리별 검색 기능에 사용됩니다.
*/

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavDropdown from 'react-bootstrap/NavDropdown';

function SearchCategoryDrop() {
  const [category, setCategory] = useState("카테고리");
  const navigate = useNavigate();

  const categories = [
    { name: '전체', path: '/' },
    { name: '한식', path: '/category/korean' },
    { name: '양식', path: '/category/western' },
    { name: '중식', path: '/category/chinese' },
    { name: '일식', path: '/category/japanese' }
  ];

  const handleSelect = (event) => {
    setCategory(event.target.text);
    
  };

  return (
    <NavDropdown title={category} id="nav-dropdown" onSelect={handleSelect} >
      {categories.map((cat, index) => (
      <NavDropdown.Item key={index} >
        {cat.name}
      </NavDropdown.Item>
      ))}
    </NavDropdown>
  );
}

export default SearchCategoryDrop;