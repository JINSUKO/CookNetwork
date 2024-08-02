/* SearchResult.jsx
*/

import React from 'react';

function SearchResult({ results, isLoading, error }) {
  if (isLoading) {    // 검색 로딩중 표시
    return <p>검색 중...</p>;
  }

  if (error) {      // 검색 오류 메시지
    return <p className="error-message">{error}</p>;
  }

  if (results.length === 0) {    // 해당 검색 결과가 없을 때
    return <p>검색 결과가 없습니다.</p>;
  }

  return (
    <div className="search-results">
      <h2>검색 결과</h2>
      <ul>
        {results.map((result) => (
          <li key={result.recipeId}>
            <h3>{result.title}</h3>
            <p>{result.img}</p>
            {/* 레시피 리스트 카드에 담는 방법? */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchResult;