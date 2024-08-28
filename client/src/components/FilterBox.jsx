/*
FilterBox.jsx
상위 카테고리 안에서 선택할수 있는 필터 버튼들을 화면에 출력하는 컴포넌트.
*/

import React from 'react';
import ToggleButton from 'react-bootstrap/ToggleButton';

function FilterBox({ filterOptions, selectedFilters, onFilterChange  }) {

  // filter: 사용자가 선택한 필터
  // selectedFilters: 현재 선택된 모든 필터 배열
  // item: selectedFilters배열의 요소
  // newFilters: 사용자가 선택한 filter를 제외한 나머지 필터들
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
    <div  className="justify-content-center">

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