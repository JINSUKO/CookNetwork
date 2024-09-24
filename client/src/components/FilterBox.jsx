/** FilterBox.jsx
 * 상위 카테고리 안에서 선택할 수 있는 필터 토글 버튼 컴포넌트
 * @filter 사용자가 선택한 필터
 */

import React, { useEffect } from 'react';
import ToggleButton from 'react-bootstrap/ToggleButton';

function FilterBox({ filterOptions, selectedFilters, onFilterChange, currentCategory }) {

  // 선택된 필터가 없을 때, 초기 상태 "모두보기"
  useEffect(() => {
    if (selectedFilters.length === 0) {
      onFilterChange(["모두보기"]);
    }
  }, []);
  
  const handleFilterChange = (filter) => {
    let newFilters;
      if (filter === "모두보기") {
        newFilters = selectedFilters.includes("모두보기") ? [] : ["모두보기"];
      } else {
        if (selectedFilters.includes(filter)) {     
          newFilters = selectedFilters.filter(item => item !== filter);
      } else {
        newFilters = [...selectedFilters.filter(item => item !== "모두보기"), filter];
      }
    }
    onFilterChange(newFilters);   // 변경된 필터 상태를 부모 컴포넌트에 전달
  };

  return (
    <div className="justify-content-center">

        {filterOptions.map((filter) => (
          <ToggleButton
            id={`filter-${filter}`}
            key={filter}
            type="checkbox"
            value={filter}
            onChange={() => handleFilterChange(filter)}
            variant={selectedFilters.includes(filter) ? "dark" : "outline-dark"}
            style={{ borderRadius: '20px', margin: '3px', fontSize: '0.875rem',  lineHeight: '1.2',}}
            checked={selectedFilters.includes(filter)}
          >
            {filter}
          </ToggleButton>
        ))}

    </div>
  );
};

export default FilterBox;