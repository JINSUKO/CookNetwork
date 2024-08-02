/* FilteredResult.jsx
검색어 필터링을 하고 화면에 표시하는 FilteredResult 함수 컴포넌트입니다.
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