/* FilteredResults.jsx
SearchBar 컴포넌트와 달리 필터링과 표시에 집중하는 컴포넌트입니다.
*/

import React from 'react';

function FilteredResult({ data, searchTerm }) {
  const filteredData = data.filter((item) => {
    return item.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // 공백 무시 검색
  const filteredDataIgnoreSpaces = data.filter((item) => {
    return item.title.replace(/\s/g, "").toLowerCase().includes(searchTerm.replace(/\s/g, "").toLowerCase());
  });

  return (
    <div>
      <h3>검색 결과 (일반)</h3>
      <ul>
        {filteredData.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>

      <h3>검색 결과 (공백 무시)</h3>
      <ul>
        {filteredDataIgnoreSpaces.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default FilteredResult;