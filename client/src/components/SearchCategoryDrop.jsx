/* SearchCategoryDrop.jsx
검색창 내 드롭다운으로 카테고리를 선택할 수 있는 컴포넌트입니다.
카테고리별 검색 기능에 사용됩니다.
* 'eventKey'; 리액트 부트스트랩의 NavDropdown 컴포넌트에서 사용되는 prop입니다.
              이 값은 해당 아이템이 선택되었을 때 onClick 대신 onSelect 핸들러에 전달됩니다.
*/

import React, { useState } from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown'; 

function SearchCategoryDrop({ onCategoryChange }) {   // SearchBar에 함수 전달
  const [category, setCategory] = useState("카테고리");

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

  return (
    <NavDropdown 
      title={category} 
      id="nav-dropdown" 
      onSelect={handleSelect} 
      style={styles.dropdownToggle}
    >
      {categories.map((cat, index) => (
        <NavDropdown.Item 
          key={index} 
          eventKey={cat.name}
          style={styles.dropdownItem}
          >
          {cat.name}
        </NavDropdown.Item>
      ))}
    </NavDropdown>
  );
}

export default SearchCategoryDrop;


// 스타일 객체 추가
const styles = {
  dropdownToggle: {
    fontWeight: 'normal',
    fontSize: '16px',
  },
  dropdownItem: {
    fontWeight: 'normal',
    fontSize: '16px',
  }
};
