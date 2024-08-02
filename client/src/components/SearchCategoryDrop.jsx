/* SearchCategoryDrop.jsx
검색창 내 드롭다운으로 카테고리를 선택할 수 있는 컴포넌트입니다.
카테고리별 검색 기능에 사용됩니다.
*/

import React, { useState } from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown';

function SearchCategoryDrop() {
  const [category, setCategory] = useState("카테고리");

  const handleSelect = (eventkey, event) => {
    setCategory(event.target.text);
    
  };

  return (
    <NavDropdown title={category} id="nav-dropdown" onSelect={handleSelect} >
      <NavDropdown.Item eventKey="4.1">전체</NavDropdown.Item>
      <NavDropdown.Item eventKey="4.2">한식</NavDropdown.Item>
      <NavDropdown.Item eventKey="4.3">양식</NavDropdown.Item>
      <NavDropdown.Item eventKey="4.4">중식</NavDropdown.Item>
      <NavDropdown.Item eventKey="4.5">일식</NavDropdown.Item>
    </NavDropdown>
  );
}

export default SearchCategoryDrop;