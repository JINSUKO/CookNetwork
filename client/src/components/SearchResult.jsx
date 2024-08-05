/* SearchResult.jsx
검색결과에 따른 메시지를 출력하는 컴포넌트입니다.
검색 로딩중을 표시하여 사용자가 로드를 기다리는 동안 메시지를 볼 수 있도록 합니다.

[ ] 기존에 SearchBar안에 있어 내비게이션바 안에서 메시지가 출력이 되었음.
    검색결과 컴포넌트에서 출력되도록 수정하기
*/

import React from 'react';

function SearchResult({ results, isLoading, error }) {    // results: 검색결과 배열
  if (!results) {
    return ;
  }
  
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
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchResult;