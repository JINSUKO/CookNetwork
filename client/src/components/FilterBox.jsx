/*
FilterBox.jsx
상위 카테고리 안에서 선택할수 있는 필터 버튼들을 화면에 출력하는 컴포넌트.
*/

import React, { useState } from 'react';
import ToggleButton from 'react-bootstrap/ToggleButton';

function FilterBox() {

  const filters = [
    "모두보기", "메인요리", "반찬", "국/탕", "디저트", "면", 
    "밥/죽/떡", "퓨전", "양념/소스", "채식", "분식", "안주", 
    "스프", "간식", "음료", "다이어트", "도시락"
  ];

  const [selectedFilter, setSelectedFilter] = useState([]);

  const handleFilterChange = (filter) => {
    setSelectedFilter(prev => {
      if (prev.includes(filter)) {
        return prev.filter(item => item !== filter);
      } else {
        return [...prev, filter];
      }
    });
  };

  return (
    <div  className="justify-content-center">
        {filters.map((filter) => (
        <ToggleButton
          id={`filter-${filter}`}
          key={filter}
          type="checkbox"
          value={filter}
          onChange={() => handleFilterChange(filter)}
          variant={selectedFilter.includes(filter) ? "dark" : "outline-dark"}
          style={{ borderRadius: '20px', margin: '3px'}}
          checked={selectedFilter.includes(filter)}
        >
          {filter}
        </ToggleButton>
        ))}
    </div>
  );
};

export default FilterBox;