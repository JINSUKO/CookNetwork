/* SearchBar.jsx 
검색어 입력과 API 요청 처리 컴포넌트입니다.

메인 상단 검색창, 버튼은 부트스트랩을 사용하였습니다.
--
[ ] 상위,하위 컴포넌트로 나누기 -> prop-types 라이브러리?
참고:https://velog.io/@jahommer/React-검색창-만들기
*/

import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import SearchCategoryDrop from "./SearchCategoryDrop";
import "../assets/styles/SearchBar.css"

function SearchBar({ onSearch }) {    // onSearch를 prop으로 받기
  const [search, setSearch] = useState("") ;    // useState 사용하여 검색한 키워드 저장    
  
  const handleSubmit = (event) => {   // submit(검색) 버튼 클릭시 아벤트 함수
    event.preventDefault();
    onSearch(search);   // onSearch를 호출하여 현재 검색어를 NavbarElement.jsx에 전달
  };
  

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
          placeholder="레시피를 검색하세요"
          />
        <Button type="submit" variant="warning" className="search-button" ><span>검색</span>
        </Button>
      </Form>
      {/* <FilteredResult data={results} /> */}
      {/* <SearchResult results={results} isLoading={isLoading} error={error} /> */}
    </div>
  )
}

export default SearchBar;