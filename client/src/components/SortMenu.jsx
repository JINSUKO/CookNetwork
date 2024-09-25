/**SortMenu.jsx
 * 정렬 기준 드롭다운 UI
 * value
 * onSortChange
 * optionList
 */

import React, { useState } from 'react';
import FetchRecipeList from './FetchRecipeList';

const sortOptionList = [
  { value: "최신순", name: "최신순" },
  { value: "오래된순", name: "오래된순" },
  { value: "난이도순", name: "난이도순" },
  { value: "조리시간순", name: "조리시간순" },
  { value: "평점순", name: "평점순" },
]

const SortMenu = ({ value, onChange, optionList }) => {
  const [sortOption, setSortOption] = useState("최신순");
  
  return (
    <select value={value} onChange={(e) => onSortChange(e.target.value)}>

      {optionList.map((opt, index) => (
          <option value={value} key={index}>
            {opt.name}
          </option>
      ))}
    </select>
  );
};

export default SortMenu;