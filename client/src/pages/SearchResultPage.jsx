/* SearchResultPage.jsx
검색 결과를 보여주는 페이지입니다.
useLocation 훅을 사용하여 데이터를 useState로 상태관리 후 props로 넘겨 매번 API를 재요청하지 않고 사용합니다.
*/

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchResult from "../components/FilteredResult";

const API_URL = 'http://localhost:3000'; 

function SearchResultPage() {
  const [results, setResults] = useState([]);   // 검색 결과 저장
  const [isLoading, setIsLoading] = useState(false);    // 검색 후 로딩
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');
    if (query) {
      fetchSearchResults(query);
    }
  }, [location]);

  
  // fetch 함수
  const fetchSearchResults = async (query) => {
    setIsLoading(true);   // SearchResult 컴포넌트에서 함수를 가져와 사용
    setError(null)

    try {
      const response = await fetch(`${API_URL}/search?query=${encodeURIComponent(query)}`, {    // 검색어 내 공백이나 특수문자 인코딩하여 가져옴
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
      if (!response.ok) {
        throw new Error('검색 요청에 실패했습니다.');
      }
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
      setError('검색 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };


  /*
  검색어를 필터링할 handleFilter.
  -검색어와 같은 값들을 걸러내줄 filter 함수
  -배열의 특정 요소가 포함되는지 판별해주는 include 함수
  -toLocaleLowerCase 함수로 입력값과 제목을 소문자로 통일시킴. includes 함수는 대소문자를 인식(구분)하기 때문에 필요
  -공백 유무 상관없이 검색 가능하게 해줄 replace 함수
  */

  useEffect(() => {
    handleFilter();
  }, [search, recipeData]);

  const handleFilter = () => {
    if (!recipeData) return;    // 데이터가 없을 때에는 함수 실행안함
    const results = recipeData.filter((recipeData) => recipeData.title.replace(" ","").toLcaleLowerCase().includes(search.toLocaleLowerCase().replace(" ",""))
    )
    setResults(results)   
  };


  return(
    <div className="search-result-page">
      <h3>검색 결과</h3>
      <SearchResult results={results} isLoading={isLoading} error={error} />
    </div>
  )
}


export default SearchResultPage;