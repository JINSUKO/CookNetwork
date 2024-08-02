/* SearchBar.jsx 
검색 입력고 API 요청 처리 컴포넌트입니다.
검색창 컴포넌트 중 자식 컴포넌트에 해당합니다.
메인 상단 검색창, 버튼은 부트스트랩을 사용하였습니다.

검색어와 같은 값들을 걸러내기 -> filter 함수 사용

[ ] 상위,하위 컴포넌트로 나누기 -> prop-types 라이브러리?

참고: https://velog.io/@jahommer/React-%EA%B2%80%EC%83%89%EC%B0%BD-%EB%A7%8C%EB%93%A4%EA%B8%B0
*/

import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from "react-bootstrap";
import SearchResult from "./SearchResult";
import FilteredResult from "./FilteredResult";
import SearchCategoryDrop from "./SearchCategoryDrop";

function SearchBar() {
  // 검색한 키워드 저장
  const [search, setSearch] = useState("") ;
  // 검색 결과 저장
  const [results, setResults] = useState([]);
  // 검색 후 로딩
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:3000'; // 서버 URL을 여기에 설정하세요


  // 검색버튼 submit 함수
  const handleSubmit = async (event) => {
    event.preventDefault();   // 제출 방지
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/search?query=${encodeURIComponent(search)}`, {

        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('검색 요청에 실패했습니다.');   // 오류 메시지. 새로운 Error 객체의 새 인스턴스 생성. Error 객체는 Javascript의 내장 객체 생성자
      }

      const results = await response.json();
      setResults(results);
      // 여기서 검색 결과를 처리합니다. 예를 들어, 상위 컴포넌트에 결과를 전달하거나 상태를 업데이트할 수 있습니다.
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
      setError('검색 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }  
  };

  // // 검색어와 같은 값들을 걸러내줄 filter 함수
  // // 배열의 특정 요소가 포함되는지 판별해주는 include 함수
  // const filterTitle = recipes.filter((props) => {     // 인자값은 임의로 설정
  //   return props.title.toLocaleLowerCase().includes(search.toLocaleLowerCase())   // toLocaleLowerCase 함수로 입력값과 제목을 소문자로 통일시킴. includes 함수는 대소문자를 인식(구분)하기 때문에 필요
  // });

  // // 공백 유무 상관없이 검색 가능하게 해줄 replace 함수 추가
  // const replaceTitle = recipes.filter((props) => {
  //   return props.title.replace(" ","").toLcaleLowerCase().includes(search.toLocaleLowerCase().replace(" ",""))
  // });


  return(
    <div>
      <Form onSubmit={handleSubmit} className="search-form d-flex align-items-center" style={{ position: 'relative' }}>
        <SearchCategoryDrop />
        <Form.Control 
          type="search"
          className="search-input"
          required
          value={search}    // 검색한 키워드
          onChange={(event) => setSearch(event.target.value)}

          {...results.filter((props) => {
            return props.title.replace(" ","").toLocaleLowerCase().includes(search.toLocaleLowerCase())
          })}  //수정필요

          placeholder="레시피를 검색하세요"
          />
        <Button type="submit" value="검색" className="search-button " variant="dark"/>
      </Form>
      {/* <FilteredResult data={results} /> */}
      {/* <SearchResult results={results} isLoading={isLoading} error={error} /> */}
    </div>
  )
}

export default SearchBar;